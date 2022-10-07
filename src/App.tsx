import React, { useState } from 'react';
import AppBar from './components/AppBar';
import Clock from './components/Clock';
import TaskList from './components/TaskList';

import defaultConfig from './defaultConfigs';
import defaultPomoHubData from './defaultPomoHubData';

import { PomoHubLocalStorageInterface, ConfigInterface } from './entities';

const loadOrCreateConfig = (): ConfigInterface => {
  const config = localStorage.getItem('config');
  if (!config) {
    localStorage.setItem('config', JSON.stringify(defaultConfig));
    console.warn('Config not found in localStorage, using default config');
  }

  if (!config) {
    throw new Error('Config not found in localStorage');
  }

  const configFromLocalStorage = JSON.parse(config) as ConfigInterface;
  const newConfig: ConfigInterface = {
    cycleDurationMinutes: configFromLocalStorage.cycleDurationMinutes
      ? configFromLocalStorage.cycleDurationMinutes
      : defaultConfig.cycleDurationMinutes,
    stepDurationMinutes: configFromLocalStorage.stepDurationMinutes
      ? configFromLocalStorage.stepDurationMinutes
      : defaultConfig.stepDurationMinutes,
    maximumCycleDurationMinutes: configFromLocalStorage.maximumCycleDurationMinutes
      ? configFromLocalStorage.maximumCycleDurationMinutes
      : defaultConfig.maximumCycleDurationMinutes,
    isExpectedVsActualEnabled: configFromLocalStorage.isExpectedVsActualEnabled
      ? configFromLocalStorage.isExpectedVsActualEnabled
      : defaultConfig.isExpectedVsActualEnabled
  };

  localStorage.setItem('config', JSON.stringify(newConfig));

  return newConfig;
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

export const readPomoHubData = () => {
  const pomoHubData = localStorage.getItem('PomoHubData');
  if (pomoHubData) {
    return JSON.parse(pomoHubData);
  }
  throw new Error('PomoHubData not found in localStorage');
};

export const writeToLocalConfig = (config: ConfigInterface) => {
  localStorage.setItem('config', JSON.stringify(config));
};

export const readLocalConfig = () => {
  const config = localStorage.getItem('config');
  if (config) {
    return JSON.parse(config);
  }
  throw new Error('Config not found in localStorage');
};

export const writeUsernameToPomoHubData = (username: string) => {
  const pomoHubData = readPomoHubData();
  pomoHubData.username = username;
  localStorage.setItem('PomoHubData', JSON.stringify(pomoHubData));
};

const logPomoHubData = (pomoHubData: PomoHubLocalStorageInterface) => {
  console.log('Username:', pomoHubData.username);
  console.log('Stored Sessions:', pomoHubData.storedSessions);
};

const logLocalConfigs = (config: ConfigInterface) => {
  console.log(`Local Configs:\n${JSON.stringify(config, null, 2)}`);
};

function App() {
  const [config, setConfig] = useState(loadOrCreateConfig());
  const [pomoHubData, setPomoHubData] = useState(loadOrCreatePomoHubData());
  logPomoHubData(pomoHubData);
  logLocalConfigs(readLocalConfig());
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
