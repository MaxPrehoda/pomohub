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
    <div className="flex flex-row">
      <button className="inline w-[50px] h-[50px] rounded-md bg-pink-400 hover:bg-pink-300 mt-4 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline w-6 h-6">
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <label htmlFor="userName" className="text-sm font-medium text-gray-700">
        userName
        <div className="mt-1">
          <input
            type="text"
            name="userName"
            id="userName"
            className="block text-white w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 sm:text-sm"
            placeholder={userName}
            onChange={handleuserNameChange}
          />
        </div>
      </label>
    </div>
  );

  const sliderValueChanged = useCallback((val, text) => {
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
      onChange: (e) => sliderValueChanged(e, 'Step Duration (minutes)')
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
    <div className="z-20 fixed h-full w-full flex items-center justify-center transition-all pb-10 mt-9">
      <div className="w-[750px] h-[600px] lg:h-[650px] text-center bg-zinc-700 rounded-lg text-white ">
        <div className="flex flex-col pl-[110px] gap-8 w-[500px] pt-32 font-semibold -ml-6">
          <div className="flex flex-row w-[700px]">
            <div className="flex-col w-26 gap-8 space-y-16">
              {userNameInput}
              <button
                /* onClick={sessionHandler} */
                className="bg-pink-400 hover:bg-pink-300 text-white font-semibold py-2 px-4 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-2 inline w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
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
            <div className="flex-col w-26 gap-2 space-y-12 ml-20 mt-2">
              <div>
                <RangeSlider {...sliderProps} classes="additional-css-classes" />
              </div>
              <div>
                <RangeSlider {...workSliderProps} classes="additional-css-classes" />
              </div>
              <div>
                <RangeSlider {...breakSliderProps} classes="additional-css-classes" />
              </div>
              <div className="">
                <button
                  onClick={settingsHandler2}
                  className="bg-zinc-50 bg-opacity-20 hover:bg-zinc-50 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded ml-[200px] -ml-0 border-2 border-emerald-400 "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
</svg>

                  End Session
                </button>
              </div>
              <div className="">
                <button
                  onClick={settingsHandler2}
                  className="bg-zinc-50 bg-opacity-20 hover:bg-zinc-50 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded ml-[200px] -ml-0 border-2 border-pink-400 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 inline"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
