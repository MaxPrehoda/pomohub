import React, { useState, useMemo, useCallback } from 'react';
import { ConfigInterface } from '../entities';
import ExportLocalStorageButton from './ExportLocalStorageButton';
import ExportSessionButton from './ExportSessionButton';

import { writeuserNameToPomoHubData, readPomoHubData, writeToLocalConfig, readLocalConfig } from '../App';
import RangeSlider from './RangeSlider';

type Props = {
  settingsHandler2: () => void;
};

function SettingsModal({ settingsHandler2 }: Props) {
  const [userName, setuserName] = useState(readPomoHubData().userName);
  const handleuserNameChange = (event: any) => {
    //console.log(`userName changing from '${userName}' to '${event.target.value}`);
    setuserName(event.target.value);
    writeuserNameToPomoHubData(userName);
  };

  const [cycleDurationMinutes, setCycleDurationMinutes] = useState(readLocalConfig().cycleDurationMinutes);
  const [stepDurationMinutes, setStepDurationMinutes] = useState(readLocalConfig().stepDurationMinutes);
  const [maximumCycleDurationMinutes, setMaximumCycleDurationMinutes] = useState(
    readLocalConfig().maximumCycleDurationMinutes
  );
  const [isExpectedVsActualEnabled, setIsExpectedVsActualEnabled] = useState(
    readLocalConfig().isExpectedVsActualEnabled
  );

  const [sliderParentVal, setsliderParentVal] = useState(10);

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

  const userNameInput = (
    <div className="flex flex-col">
      <label htmlFor="userName" className="text-sm font-medium text-gray-700">
        userName
        <div className="mt-1">
          <input
            type="text"
            name="userName"
            id="userName"
            className="block  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={userName}
            onChange={handleuserNameChange}
          />
        </div>
      </label>
    </div>
  );

  const sliderValueChanged = useCallback((val) => {
    //console.log('NEW VALUE', val);
    setsliderParentVal(val);
    writeToLocalConfig({
      stepDurationMinutes: val,
      cycleDurationMinutes: readLocalConfig().cycleDurationMinutes,
      maximumCycleDurationMinutes: readLocalConfig().maximumCycleDurationMinutes,
      isExpectedVsActualEnabled: false
    });
    //console.log(readLocalConfig());
  });

  const sliderProps = useMemo(
    () => ({
      min: 0,
      max: 100,
      value: sliderParentVal,
      step: 2,
      onChange: (e) => sliderValueChanged(e)
    }),
    [sliderParentVal]
  );

  return (
    <div className="z-20 fixed h-full w-full flex items-center justify-center transition-all pb-10">
      <div className="w-[700px] h-[650px] text-center bg-zinc-700 rounded-lg text-white">
        <div className="flex flex-col pl-[210px] pt-28 gap-8 w-[500px] font-semibold pt-10">
          {userNameInput}
          <button
            /* onClick={sessionHandler} */
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
          <div>
            <RangeSlider {...sliderProps} classes="additional-css-classes" />
          </div>
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
