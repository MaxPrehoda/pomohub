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
    // console.log(`userName changing from '${userName}' to '${event.target.value}`);
    setuserName(event.target.value);
    writeuserNameToPomoHubData(userName);
  };

  const [cycleDurationMinutes, setCycleDurationMinutes] = useState(readLocalConfig().cycleDurationMinutes);
  const [breakCycleDurationMinutes, setBreakCycleDurationMinutes] = useState(
    readLocalConfig().breakCycleDurationMinutes
  );
  const [stepDurationMinutes, setStepDurationMinutes] = useState(readLocalConfig().stepDurationMinutes);
  const [maximumCycleDurationMinutes, setMaximumCycleDurationMinutes] = useState(
    readLocalConfig().maximumCycleDurationMinutes
  );
  const [isExpectedVsActualEnabled, setIsExpectedVsActualEnabled] = useState(
    readLocalConfig().isExpectedVsActualEnabled
  );

  const [sliderParentVal, setsliderParentVal] = useState(10);
  const [breakSliderParentVal, setbreakSliderParentVal] = useState(5);
  const [workSliderParentVal, setWorkSliderParentVal] = useState(25);

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
      case 'breakCycleDurationMinutes':
        if (Number.isInteger(event.target.value)) {
          setBreakCycleDurationMinutes(event.target.value);
        } else {
          console.log('breakCycleDurationMinutes must be a number');
        }
        break;
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
      breakCycleDurationMinutes,
      cycleDurationMinutes,
      stepDurationMinutes,
      maximumCycleDurationMinutes,
      isExpectedVsActualEnabled,
      userName: ''
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

  const sliderValueChanged = useCallback((val,text) => {
    console.log(`sliderValueChanged: ${val} ${text}`);
    if (text === 'Step Duration (minutes)') {
      console.log('NEW VALUE', val);
      setsliderParentVal(val);
      writeToLocalConfig({
        stepDurationMinutes: val,
        cycleDurationMinutes: readLocalConfig().cycleDurationMinutes,
        maximumCycleDurationMinutes: readLocalConfig().maximumCycleDurationMinutes,
        isExpectedVsActualEnabled: false,
        userName: '',
        breakCycleDurationMinutes: 0
      });
    } else if (text === 'Break Session Duration (minutes)') {
      setbreakSliderParentVal(val);
      writeToLocalConfig({
        breakCycleDurationMinutes: val,
        cycleDurationMinutes: readLocalConfig().cycleDurationMinutes,
        maximumCycleDurationMinutes: readLocalConfig().maximumCycleDurationMinutes,
        isExpectedVsActualEnabled: false,
        stepDurationMinutes: readLocalConfig().stepDurationMinutes,
        userName: ''
      }); // console.log(readLocalConfig());
    } else if (text === 'Work Session Duration (minutes)') {
      setWorkSliderParentVal(val);
      writeToLocalConfig({
        breakCycleDurationMinutes: readLocalConfig().breakCycleDurationMinutes,
        cycleDurationMinutes: val,
        maximumCycleDurationMinutes: readLocalConfig().maximumCycleDurationMinutes,
        isExpectedVsActualEnabled: false,
        stepDurationMinutes: readLocalConfig().stepDurationMinutes,
        userName: ''
      });
    }
  });

  const sliderProps = useMemo(
    () => ({
      min: 0,
      max: 100,
      label: 'Step Duration (minutes)',
      value: sliderParentVal,
      step: 1,
      onChange: (e) => sliderValueChanged(e,'Step Duration (minutes)')
    }),
    [sliderParentVal]
  );

  const breakSliderProps = useMemo(
    () => ({
      min: 0,
      max: 100,
      label: 'Break Session Duration (minutes)',
      value: breakSliderParentVal,
      step: 1,
      onChange: (e) => sliderValueChanged(e, 'Break Session Duration (minutes)')
    }),
    [breakSliderParentVal]
  );

  const workSliderProps = useMemo(
    () => ({
      min: 0,
      max: 100,
      label: 'Work Session Duration (minutes)',
      value: workSliderParentVal,
      step: 1,
      onChange: (e) => sliderValueChanged(e, 'Work Session Duration (minutes)')
    }),
    [workSliderParentVal]
  );

  return (
    <div className="z-20 fixed h-full w-full flex items-center justify-center transition-all pb-10">
      <div className="w-[750px] h-[650px] text-center bg-zinc-700 rounded-lg text-white">
        <div className="flex flex-col pl-[110px] gap-8 w-[500px] pt-24 font-semibold">
          <div className="flex flex-row w-[700px]">
            <div className="flex-col w-26 gap-4 space-y-10">
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
            </div>
            <div />
            <div className="flex-col w-26 gap-4 space-y-10 ml-20 mt-12">
              <div>
                <RangeSlider {...sliderProps} classes="additional-css-classes" />
              </div>
              <div>
                <RangeSlider {...workSliderProps} classes="additional-css-classes" />
              </div>
              <div>
                <RangeSlider {...breakSliderProps} classes="additional-css-classes" />
              </div>
            </div>
          </div>
          <button
                onClick={settingsHandler2}
                className="bg-red-400 hover:bg-red-300 text-white font-semibold py-2 px-4 rounded ml-[200px] mt-8"
              >
                Close Settings
              </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
