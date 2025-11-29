import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Workspace } from './components/Workspace';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-purple-500/30 selection:text-white">
      {hasStarted ? (
        <Workspace onBack={() => setHasStarted(false)} />
      ) : (
        <WelcomeScreen onStart={handleStart} />
      )}
    </div>
  );
};

export default App;