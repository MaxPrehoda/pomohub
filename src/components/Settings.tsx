import React, { useState } from 'react';

import { ConfigInterface } from '../entities';

import { writeUsernameToPomoHubData, readPomoHubData, writeToLocalConfig, readLocalConfig } from '../App';

function Modal({ setOpenModal }) {
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
      maximumCycleDurationMinutes
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
      </label>
    </div>
  );

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>title</h1>
        </div>
        <div className="body">
          <p>The next page!</p>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
