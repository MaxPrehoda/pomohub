import React, { useState } from 'react';
import { ConfigInterface } from '../entities';
import ExportLocalStorageButton from './ExportLocalStorageButton';
import ExportSessionButton from './ExportSessionButton';

import { writeUsernameToPomoHubData, readPomoHubData, writeToLocalConfig, readLocalConfig } from '../App';

type Props = {
  settingsHandler2: () => void;
};

function SettingsModal({ settingsHandler2 }: Props) {
  const [username, setUsername] = useState(readPomoHubData().username);
  const handleUsernameChange = (event: any) => {
    console.log(`Username changing from '${username}' to '${event.target.value}`);
    setUsername(event.target.value);
    writeUsernameToPomoHubData(username);
  };

  const [cycleDurationMinutes, setCycleDurationMinutes] = useState(readLocalConfig().cycleDurationMinutes);
  const [stepDurationMinutes, setStepDurationMinutes] = useState(readLocalConfig().stepDurationMinutes);
  const [maximumCycleDurationMinutes, setMaximumCycleDurationMinutes] = useState(
    readLocalConfig().maximumCycleDurationMinutes
  );
  const [isExpectedVsActualEnabled, setIsExpectedVsActualEnabled] = useState(
    readLocalConfig().isExpectedVsActualEnabled
  );

  const handleLocalConfigChange = (event: any) => {
    console.log(
      `Local Config for ${event.target.name} changing from '${event.target.value}' to '${event.target.value}`
    );
    switch (event.target.name) {
      case 'cycleDurationMinutes':
        if (Number.isInteger(event.target.value)) {
          setCycleDurationMinutes(event.target.value);
          break;
        } else {
          throw new Error('cycleDurationMinutes must be a number');
        }
      case 'stepDurationMinutes':
        if (Number.isInteger(event.target.value)) {
          setStepDurationMinutes(event.target.value);
          break;
        } else {
          throw new Error('setStepDurationMinutes must be a number');
        }
      case 'maximumCycleDurationMinutes':
        if (Number.isInteger(event.target.value)) {
          setMaximumCycleDurationMinutes(event.target.value);
          break;
        } else {
          throw new Error('setMaximumCycleDurationMinutes must be a number');
        }
      default:
        break;
    }
    const newConfig: ConfigInterface = {
      cycleDurationMinutes,
      stepDurationMinutes,
      maximumCycleDurationMinutes,
      isExpectedVsActualEnabled
    };

    writeToLocalConfig(newConfig);
  };

  const localConfigNumericalInputField = (readablePropertyName: string, variableName: string, value: number) => {
    return (
      <div>
        <label htmlFor={variableName} className="text-sm font-medium text-gray-700">
          {readablePropertyName}
          <input type="number" name={variableName} value={value} onChange={handleLocalConfigChange} />
        </label>
      </div>
    );
  };

  // example
  // localConfigNumericalInputField('Cycle Duration (minutes)', 'cycleDurationMinutes', cycleDurationMinutes);
  // localConfigNumericalInputField('Step Duration (minutes)', 'stepDurationMinutes', stepDurationMinutes);
  // localConfigNumericalInputField(
  //   'Maximum Cycle Duration (minutes)',
  //   'maximumCycleDurationMinutes',
  //   maximumCycleDurationMinutes
  // );

  const usernameInput = (
    <div className="flex flex-col">
      <label htmlFor="username" className="text-sm font-medium text-gray-700">
        Username
        <div className="mt-1">
          <input
            type="text"
            name="username"
            id="username"
            className="block  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={username}
            onChange={handleUsernameChange}
          />
        </div>
      </label>
    </div>
  );

  return (
    <div className="z-20 fixed h-full w-full flex items-center justify-center transition-all pb-10">
      <div className="w-[700px] h-[650px] text-center bg-zinc-700 rounded-lg text-white">
        <div className="flex flex-col pl-[210px] pt-28 gap-8 w-[500px] font-semibold pt-10">
          {usernameInput}
          <button
            /*onClick={sessionHandler}*/
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2 px-4 rounded"
          >
            View session summary
          </button>
          <div className="w-18">
            <ExportSessionButton />
          </div>
          <div className="w-18">
            <ExportLocalStorageButton />
          </div>
          Time chunk
          <input type="range" min="1" max="60" step="5" className="w-18" />
          <button
            onClick={settingsHandler2}
            className="bg-red-400 hover:bg-red-300 text-white font-semibold py-2 px-4 rounded"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
