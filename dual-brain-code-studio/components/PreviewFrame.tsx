import React, { useMemo } from 'react';
import { Task } from '../types';

interface PreviewFrameProps {
  tasks: Task[];
  activeTaskId: string | null;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ tasks, activeTaskId }) => {
  
  // Find the file to render. Priority:
  // 1. The currently active file (if it's a component)
  // 2. index.tsx / main.tsx / App.tsx
  // 3. The first available file
  const activeFile = useMemo(() => {
    if (activeTaskId) {
      return tasks.find(t => t.id === activeTaskId);
    }
    return tasks.find(t => t.file_name?.match(/index|main|App/i)) || tasks[0];
  }, [tasks, activeTaskId]);

  // Generate the srcDoc for the iframe
  const srcDoc = useMemo(() => {
    if (!activeFile) return '';

    // Create a map of files for the "bundler"
    const filesMap = tasks.reduce((acc, task) => {
        if (task.file_name && task.code) {
            acc[task.file_name] = task.code;
        }
        return acc;
    }, {} as Record<string, string>);

    const entryPath = activeFile.file_name || 'unknown';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { background-color: #ffffff; color: #1a1a1a; margin: 0; padding: 0; font-family: sans-serif; }
            #root { padding: 20px; height: 100vh; box-sizing: border-box; overflow: auto; }
            /* Scrollbar for the preview */
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            // Mock System to handle modules
            const modules = {};
            const exportsMap = {};
            
            // The files content injected from React
            const projectFiles = ${JSON.stringify(filesMap)};

            // Path Resolver
            function resolvePath(base, relative) {
               const stack = base.split('/');
               stack.pop(); // Remove filename
               
               const parts = relative.split('/');
               for (let i = 0; i < parts.length; i++) {
                 if (parts[i] === '.') continue;
                 if (parts[i] === '..') stack.pop();
                 else stack.push(parts[i]);
               }
               
               const path = stack.join('/');
               
               // Try to find exact match or with extensions
               if (projectFiles[path]) return path;
               if (projectFiles[path + '.tsx']) return path + '.tsx';
               if (projectFiles[path + '.ts']) return path + '.ts';
               if (projectFiles[path + '/index.tsx']) return path + '/index.tsx';
               
               return path; 
            }

            function customRequire(currentPath, importPath) {
               if (importPath.startsWith('react')) return window.React;
               if (importPath.startsWith('react-dom')) return window.ReactDOM;
               
               if (importPath.startsWith('.')) {
                  const resolved = resolvePath(currentPath, importPath);
                  if (exportsMap[resolved]) return exportsMap[resolved];
                  throw new Error('Module not found: ' + resolved);
               }
               return {}; // Mock external libs
            }

            // Define function for Babel to use
            window.defineModule = function(path, code) {
                // We wrap code in a function to execute later
                modules[path] = code;
            };

            async function run() {
               const root = ReactDOM.createRoot(document.getElementById('root'));
               
               try {
                  // 1. Transpile all files
                  for (const [path, code] of Object.entries(projectFiles)) {
                      try {
                        const transformed = Babel.transform(code, {
                            presets: ['react', ['typescript', { isTSX: true, allExtensions: true }]],
                            plugins: ['transform-modules-commonjs'],
                            filename: path
                        }).code;
                        
                        // Wrap in a factory
                        const factory = new Function('require', 'exports', 'module', 'React', 'ReactDOM', transformed);
                        modules[path] = factory;
                      } catch(e) {
                          console.error("Compilation error in " + path, e);
                      }
                  }

                  // 2. Execute modules (Lazy naive loading or topological sort? Naive for now)
                  // We need to execute the entry point, and it will trigger requires.
                  
                  const execute = (path) => {
                      if (exportsMap[path]) return exportsMap[path];
                      
                      const factory = modules[path];
                      if (!factory) throw new Error("Module not compiled: " + path);
                      
                      const module = { exports: {} };
                      const require = (p) => customRequire(path, p);
                      
                      // Execute
                      factory(require, module.exports, module, window.React, window.ReactDOM);
                      
                      exportsMap[path] = module.exports;
                      return module.exports;
                  };

                  // 3. Start with active file
                  const entryPoint = "${entryPath}";
                  const MainModule = execute(entryPoint);
                  
                  // 4. Render
                  const App = MainModule.default || Object.values(MainModule).find(v => typeof v === 'function');
                  
                  if (App) {
                     root.render(React.createElement(App));
                  } else {
                     root.render(React.createElement('div', { className: "text-red-500" }, "No component export found in " + entryPoint));
                  }

               } catch (err) {
                  root.render(
                    React.createElement('div', { className: "p-4 bg-red-50 border border-red-200 rounded text-red-800" },
                      React.createElement('h3', { className: "font-bold mb-2" }, "Preview Error"),
                      React.createElement('pre', { className: "text-xs overflow-auto" }, err.toString())
                    )
                  );
                  console.error(err);
               }
            }

            run();
          </script>
        </body>
      </html>
    `;
  }, [tasks, activeFile]);

  if (!tasks.length) {
      return (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              No code generated yet.
          </div>
      );
  }

  return (
    <div className="w-full h-full bg-white relative">
        <iframe 
            srcDoc={srcDoc}
            title="Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin" 
        />
        {activeFile && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded backdrop-blur font-mono opacity-50 hover:opacity-100 pointer-events-none">
                Preview: {activeFile.file_name}
            </div>
        )}
    </div>
  );
};