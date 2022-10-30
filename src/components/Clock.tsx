import React, { useEffect, useState } from 'react';

import PomoSessionHandler from '../backend/session';

import {
  writeuserNameToPomoHubData,
  writeSessionToPomoHubData,
  readPomoHubData,
  writeToLocalConfig,
  readLocalConfig
} from '../App';

import { ConfigInterface } from '../entities';

function formatDisplayTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const displayTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  return displayTime;
}

function Clock({ cycleDurationMinutes, stepDurationMinutes, maximumCycleDurationMinutes }: ConfigInterface) {
  const breakCycleDurationSeconds = readLocalConfig().breakCycleDurationMinutes * 60;
  const cycleDurationSeconds = readLocalConfig().cycleDurationMinutes * 60;
  const stepDurationSeconds = readLocalConfig().stepDurationMinutes * 60;
  const maximumCycleDurationSeconds = readLocalConfig().maximumCycleDurationMinutes * 60;

  const ding = new Audio('../assets/Drop.mp3');
  const dong = new Audio('../assets/Unlock.mp3');

  const [time, setTime] = useState(cycleDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false); // used for the start and pause functionality
  const [isBreak, setBreak] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const startSession = () => {
    // console.log('FIST LINE');
    const sessionsList = readPomoHubData().storedSessions;
    // console.log(sessionsList[sessionsList.length - 1]);
    const currSession = sessionsList[sessionsList.length - 1];
    const sessionHandler = new PomoSessionHandler(currSession);
    // console.log(sessionHandler.lastCycle);
    // if there is a session with cycles in progress, start a new cycle with the leftover tasks of the latest cycle
    if (currSession.cycleArray.length !== 0) {
      // console.log("There's a cycle in progress");
      // console.log(currSession);
      const updatedSession = sessionHandler.cycleStart(currSession.cycleArray[currSession.cycleArray.length - 1].tasks);
      writeSessionToPomoHubData(updatedSession);
      // console.log(updatedSession);

      // if there are no cycles in the current session, check for a previous session
    } else if (readPomoHubData().storedSessions.length >= 2) {
      // console.log('There are no cycles in the current session');
      const currentLocalSessions = readPomoHubData().storedSessions;
      const previousSession = currentLocalSessions[currentLocalSessions.length - 2];

      // if there is a previous session, check if that session has cycles
      if (previousSession.cycleArray.length !== 0) {
        // console.log('There are cycles in the previous session');
        const previousSessionTasks = previousSession.cycleArray[previousSession.cycleArray.length - 1].tasks;
        const updatedSession = sessionHandler.cycleStart(previousSessionTasks);
        writeSessionToPomoHubData(updatedSession);

        // in the edge case that the previous session has no cycles, but there is a session from two sessions ago,
        // check if that "two sessions ago" session has cycles
      } else if (currentLocalSessions[currentLocalSessions.length - 2].cycleArray.length !== 0) {
        // console.log('There are no cycles in the previous session');
        const twoSessionsAgoSession = currentLocalSessions[currentLocalSessions.length - 2];
        const twoSessionsAgoSessionTasks =
          twoSessionsAgoSession.cycleArray[twoSessionsAgoSession.cycleArray.length - 1].tasks;
        const updatedSession = sessionHandler.cycleStart(twoSessionsAgoSessionTasks);
        writeSessionToPomoHubData(updatedSession);
      } else {
        // console.log('There are no cycles in the previous session');
        // otherwise, start a new session with no tasks
        const updatedSession = sessionHandler.cycleStart([]);
        writeSessionToPomoHubData(updatedSession);
      }

      // if there are no previous sessions, start a new session with no tasks
    } else {
      // console.log('There are no previous sessions');
      const updatedSession = sessionHandler.cycleStart([]);
      writeSessionToPomoHubData(updatedSession);
    }
    setIsSessionStarted(true);
  };

  const startOrPauseTimer = () => {
    // if this is the first time the timer has been started, create a new session
    console.log(
      'Current session data is',
      readPomoHubData().storedSessions[readPomoHubData().storedSessions.length - 1]
    );
    setIsTimerRunning(!isTimerRunning);
  };

  // dont touch
  const decrementTimerByStep = () => {
    if (time > stepDurationSeconds) {
      setTime(time - stepDurationSeconds);
    } else {
      setTime(0);
    }
  };

  // dont touch
  const incrementTimerByStep = () => {
    if (time < maximumCycleDurationSeconds - stepDurationSeconds) {
      setTime(time + stepDurationSeconds);
    } else {
      setTime(maximumCycleDurationSeconds);
    }
  };

  const resetTimer = () => {
    if (isBreak) {
      setTime(breakCycleDurationSeconds);
    } else {
      setTime(cycleDurationSeconds);
      setIsTimerRunning(false);
    }
  };

  const checkIfUserEndedCycle = () => {
    // console.log(time);
    if (time <= 0) {
      console.log('--------- cycle ended');
      setBreak(!isBreak);
      if (!isBreak) {
        ding.play();
      } else {
        dong.play();
      }
      const currentLocalSessions = readPomoHubData().storedSessions;
      const currentSession = currentLocalSessions[currentLocalSessions.length - 1];
      const sessionHandler = new PomoSessionHandler(currentSession);
      const updatedSession = sessionHandler.cycleEnd();
      writeSessionToPomoHubData(updatedSession);
      console.log(cycleDurationSeconds);
      console.log(breakCycleDurationSeconds);
      if (isBreak) {
        setTime(cycleDurationSeconds);
      } else {
        setTime(breakCycleDurationSeconds);
      }
    }
  };

  useEffect(() => {
    if (isTimerRunning && !isSessionStarted) {
      startSession();
    }
    if (!(isTimerRunning && time > 0)) {
      checkIfUserEndedCycle();
      console.log(isBreak);
    } else {
      const interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, time]);

  const displayTime = formatDisplayTime(time);

  return (
    <div className="h-[230px]">
      <div className="h-[300px] w-[500px] md:w-[400px] md:h-[245px] lg:w-[450px] lg:h-[230px] lg:mb-12 bg-zinc-700 rounded-md text-center">
        <div className="flex">
          {isBreak ? (
            <div className="text-medium text-zinc-100 m-auto pl-12">Break</div>
          ) : (
            <div className="text-medium text-zinc-100 m-auto pl-12">Work</div>
          )}
          <button id="reset_button" onClick={resetTimer} className="pl-2 pt-2 mr-2 pr-2 bg-transparent left-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <h1 className=" pt-16 md:pt-2 text-9xl lg:text-9xl font-semibold text-white pt-8">{displayTime}</h1>
        <div className="flex-row mt-3">
          <button
            className="bg-red-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2"
            onClick={() => {
              decrementTimerByStep();
              checkIfUserEndedCycle();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            id="start_pause_button"
            onClick={startOrPauseTimer}
            className="bg-zinc-500 rounded-md pl-2 pt-2 pb-2 mr-2 pr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
              />
            </svg>
          </button>
          <button className=" bg-emerald-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2" onClick={incrementTimerByStep}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Clock;
