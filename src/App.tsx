import React, { useState } from 'react';
import AppBar from './components/AppBar';
import Clock from './components/Clock';
import TaskList from './components/TaskList';
import SettingsModal from './components/Settings';
import defaultConfig from './defaultConfigs';
import defaultPomoHubData from './defaultPomoHubData';

import { PomoHubLocalStorageInterface, ConfigInterface, SessionInterface } from './entities';

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
  // console.log('loadOrCreatePomoHubData WORKS ONLY ONCE');
  // console.log(pomoHubData);
  if (pomoHubData) {
    if (
      Object.keys(pomoHubData).length === Object.keys(defaultPomoHubData).length &&
      Object.keys(pomoHubData).every((key) => Object.keys(defaultPomoHubData).includes(key))
    ) {
      return JSON.parse(pomoHubData);
    }
  } else {
    console.log('holy fuck does this happen every time');
    // THIS IS A HUGE BUG
    localStorage.setItem('PomoHubData', JSON.stringify(defaultPomoHubData));
    return defaultPomoHubData;
  }
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

export const writeuserNameToPomoHubData = (userName: string) => {
  const pomoHubData = readPomoHubData();
  pomoHubData.userName = userName;
  localStorage.setItem('PomoHubData', JSON.stringify(pomoHubData));
};

export const writeSessionToPomoHubData = (session: SessionInterface) => {
  const pomoHubData = readPomoHubData();
  // check through all sessions to see if there is a session with the same date
  if (pomoHubData && pomoHubData.storedSessions && pomoHubData.storedSessions.length > 0) {
    const sessionIndex = pomoHubData.storedSessions.findIndex(
      (s: SessionInterface) => s.startingDateTime === session.startingDateTime
    );
    if (sessionIndex > -1) {
      pomoHubData.storedSessions[sessionIndex] = session;
    } else {
      pomoHubData.storedSessions.push(session);
    }
  } else {
    pomoHubData.storedSessions.push(session);
  }
  localStorage.setItem('PomoHubData', JSON.stringify(pomoHubData));
};

const logPomoHubData = (pomoHubData: PomoHubLocalStorageInterface) => {
  console.log('PomoHubData:');
  console.log(pomoHubData);
  // console.log('userName:', pomoHubData.userName);
  // console.log('Stored Sessions:', pomoHubData.storedSessions);
};

const logLocalConfigs = (config: ConfigInterface) => {
  console.log(`Local Configs:\n${JSON.stringify(config, null, 2)}`);
};

function App() {
  const [config, setConfig] = useState(loadOrCreateConfig());
  const [pomoHubData, setPomoHubData] = useState(loadOrCreatePomoHubData());
  const [showModal, setShowModal] = useState(false);

  const showLogs = true;
  if (showLogs) {
    logPomoHubData(pomoHubData);
    logLocalConfigs(config);
  }
  const clock = Clock(config);

  const handleSettingsModal = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col h-screen transition-opacity duration-75">
      {window.Main && (
        <div className="flex-none display:none visiblility:none">
          <AppBar settingsHandler={handleSettingsModal} />
        </div>
      )}
      <div className="flex-auto overflow-hidden">
        {showModal ? <SettingsModal settingsHandler2={handleSettingsModal} /> : <div />}
        <div className=" flex flex-col justify-center items-center h-full bg-zinc-900 space-y-4 pt-44 pb-80 md:pb-0">
          {clock}
          <span className="hidden md:block md:pt-0 pb-20">
            <TaskList />
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
