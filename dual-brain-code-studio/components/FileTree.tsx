import React, { useState } from 'react';
import { Icons } from './Icons';
import { Task } from '../types';

interface FileTreeProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: Record<string, TreeNode>;
  taskId?: string; // Only files have taskIds
  status?: Task['status'];
}

export const FileTree: React.FC<FileTreeProps> = ({ tasks, activeTaskId, onSelectTask }) => {
  
  // Convert tasks list to tree structure
  const buildTree = (tasks: Task[]) => {
    const root: TreeNode = { name: 'root', path: '', type: 'folder', children: {} };

    tasks.forEach(task => {
        // Default to just the filename if path parsing fails or is empty
        const safePath = task.file_name || task.title || 'Untitled.tsx';
        const parts = safePath.split('/').filter(p => p); // Remove empty strings
        
        let current = root;
        
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            
            if (!current.children[part]) {
                current.children[part] = {
                    name: part,
                    path: parts.slice(0, index + 1).join('/'),
                    type: isFile ? 'file' : 'folder',
                    children: {},
                    taskId: isFile ? task.id : undefined,
                    status: isFile ? task.status : undefined
                };
            }
            current = current.children[part];
        });
    });

    return root;
  };

  const root = buildTree(tasks);

  return (
    <div className="flex flex-col gap-1 select-none animate-fade-in pl-2">
      {Object.values(root.children).map((node) => (
        <FileTreeNode 
          key={node.path} 
          node={node} 
          activeTaskId={activeTaskId} 
          onSelectTask={onSelectTask}
          level={0}
        />
      ))}
    </div>
  );
};

const FileTreeNode: React.FC<{ 
  node: TreeNode; 
  activeTaskId: string | null; 
  onSelectTask: (id: string) => void;
  level: number;
}> = ({ node, activeTaskId, onSelectTask, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = node.taskId === activeTaskId;
  
  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else if (node.taskId) {
      onSelectTask(node.taskId);
    }
  };

  // Determine icon
  const getIcon = () => {
    if (node.type === 'folder') {
      return isOpen ? <Icons.FolderOpen size={14} className="text-purple-400" /> : <Icons.Folder size={14} className="text-gray-500" />;
    }
    // File icons based on extension
    if (node.name.endsWith('tsx') || node.name.endsWith('ts')) return <Icons.FileCode size={14} className={isActive ? 'text-cyan-300' : 'text-cyan-600'} />;
    if (node.name.endsWith('css')) return <Icons.Layout size={14} className="text-blue-500" />;
    if (node.name.endsWith('json')) return <Icons.Braces size={14} className="text-yellow-500" />;
    return <Icons.FileCode size={14} className="text-gray-500" />;
  };

  return (
    <div>
      <div 
        onClick={handleClick}
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-xs font-mono
          ${isActive 
            ? 'bg-purple-500/20 text-white' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <span className="flex-shrink-0 opacity-80">{getIcon()}</span>
        <span className={`truncate ${isActive ? 'font-semibold' : ''}`}>{node.name}</span>
        
        {/* Status Dot for Files */}
        {node.type === 'file' && node.status && (
          <div className="ml-auto pl-2">
             {node.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />}
             {node.status === 'running' && <Icons.Loader2 size={10} className="text-cyan-400 animate-spin" />}
             {node.status === 'completed' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
             {node.status === 'error' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
          </div>
        )}
      </div>

      {/* Render Children */}
      {node.type === 'folder' && isOpen && (
        <div className="flex flex-col border-l border-gray-800 ml-3">
          {Object.values(node.children).map((child) => (
            <FileTreeNode 
              key={child.path} 
              node={child} 
              activeTaskId={activeTaskId} 
              onSelectTask={onSelectTask}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
