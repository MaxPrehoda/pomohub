import React, { useState } from 'react';
import AppBar from './components/AppBar';
import Clock from './components/Clock';
import TaskList from './components/TaskList';

import defaultConfig from './defaultConfigs';
import defaultPomoHubData from './defaultPomoHubData';

import { PomoHubLocalStorageInterface } from './entities';

const loadOrCreateConfig = () => {

  const config = localStorage.getItem('config');
  if (config) {
    if (Object.keys(config).length === Object.keys(defaultConfig).length) {
      return JSON.parse(config);
    }
  }
  localStorage.setItem('config', JSON.stringify(defaultConfig));
  return defaultConfig;
};

const loadOrCreatePomoHubData = () => {
  const pomoHubData = localStorage.getItem('PomoHubData');
  if (pomoHubData) {
    if (
      Object.keys(pomoHubData).length === Object.keys(defaultPomoHubData).length &&
      Object.keys(pomoHubData).every((key) => Object.keys(defaultPomoHubData).includes(key))
    ) {
      return JSON.parse(pomoHubData);
    }
  }
  localStorage.setItem('PomoHubData', JSON.stringify(defaultPomoHubData));
  return defaultPomoHubData;
};

const logPomoHubData = (pomoHubData: PomoHubLocalStorageInterface) => {
  console.log('Username:', pomoHubData.username);
  console.log('Stored Sessions:', pomoHubData.storedSessions);
};

function App() {
  const [config, setConfig] = useState(loadOrCreateConfig());
  const [pomoHubData, setPomoHubData] = useState(loadOrCreatePomoHubData());
  logPomoHubData(pomoHubData);
  const clock = Clock(config, pomoHubData);
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
          <span className="invisible md:visible ">
            <TaskList />
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
