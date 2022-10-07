import { Input } from 'postcss';
import React, { useEffect, useState } from 'react';
import AppBar from './components/AppBar';
import Clock from './components/Clock';
import TaskList from './components/TaskList';

import defaultConfig from './defaultConfigs';

const loadOrCreateConfig = () => {
  // Looks for a file called config.json in the same directory as the executable
  // if it exists, checks it to ensure that is has the correct format based on the Config interface
  // if it doesn't exist, or if it doesn't have the correct format, it creates a new config file with the default values
  // otherwise, it returns the config file for use by the app

  const config = localStorage.getItem('config');
  if (config) {
    if (Object.keys(config).length === Object.keys(defaultConfig).length) {
      return JSON.parse(config);
    }
  }
  localStorage.setItem('config', JSON.stringify(defaultConfig));
  return defaultConfig;
};

function App() {
  const [config, setConfig] = useState(loadOrCreateConfig());
  console.log('config', config);
  const clock = Clock(config.cycle_duration_minutes, config.step_duration_minutes);
  return (
    <div className="flex flex-col h-screen transition-opacity duration-75">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto">
        <div className=" flex flex-col justify-center items-center h-full bg-zinc-900 space-y-4">
          {clock}
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App;
