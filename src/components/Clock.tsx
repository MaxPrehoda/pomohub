import React, { useEffect, useState } from 'react';

import PomoSessionHandler from '../backend/session';

import { writeSessionToPomoHubData, readPomoHubData } from '../App';

import { ConfigInterface, Tasks, CycleData, PomoHubLocalStorageInterface, SessionInterface } from '../entities';

function formatDisplayTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const displayTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  return displayTime;
}

function Clock({ cycleDurationMinutes, stepDurationMinutes, maximumCycleDurationMinutes }: ConfigInterface) {
  const cycleDurationSeconds = cycleDurationMinutes * 60;
  const stepDurationSeconds = stepDurationMinutes * 60;
  const maximumCycleDurationSeconds = maximumCycleDurationMinutes * 60;

  const ding = new Audio('../assets/Drop.mp3');

  const [time, setTime] = useState(cycleDurationSeconds);
  const [isRunning, setIsRunning] = useState(false); // used for the start and pause functionality
  // const [isBreak, setBreak] = useState(false);
  const [isStarted, setStart] = useState(false);
  const isBreak = false;

  const startOrPauseTimer = () => {
    // if this is the first time the timer has been started, create a new session
    if (!isRunning && time === cycleDurationSeconds) {
      const sessionHandler = new PomoSessionHandler();
      const newSession: SessionInterface = sessionHandler.startSession();
      writeSessionToPomoHubData(newSession);
    }
    if (!isRunning && !isStarted) {
      const sessionsList = readPomoHubData().storedSessions;
      const currSession: SessionInterface = sessionsList[sessionsList.length - 1];
      const sessionHandler = new PomoSessionHandler(currSession);
      // if there is a session with cycles in progress, start a new cycle with the leftover tasks of the latest cycle
      if (currSession.cycleArray.length !== 0) {
        const updatedSession = sessionHandler.cycleStart(
          currSession.cycleArray[currSession.cycleArray.length - 1].tasks
        );
        writeSessionToPomoHubData(updatedSession);

        // if there are no cycles in the current session, check for a previous session
      } else if (readPomoHubData().storedSessions.length >= 2) {
        const currentLocalSessions = readPomoHubData().storedSessions;
        const previousSession = currentLocalSessions[currentLocalSessions.length - 2];

        // if there is a previous session, check if that session has cycles
        if (previousSession.cycleArray.length !== 0) {
          const previousSessionTasks = previousSession.cycleArray[previousSession.cycleArray.length - 1].tasks;
          const updatedSession = sessionHandler.cycleStart(previousSessionTasks);
          writeSessionToPomoHubData(updatedSession);

          // in the edge case that the previous session has no cycles, but there is a session from two sessions ago,
          // check if that "two sessions ago" session has cycles
        } else if (currentLocalSessions[currentLocalSessions.length - 2].cycleArray.length !== 0) {
          const twoSessionsAgoSession = currentLocalSessions[currentLocalSessions.length - 2];
          const twoSessionsAgoSessionTasks =
            twoSessionsAgoSession.cycleArray[twoSessionsAgoSession.cycleArray.length - 1].tasks;
          const updatedSession = sessionHandler.cycleStart(twoSessionsAgoSessionTasks);
          writeSessionToPomoHubData(updatedSession);
        }

        // otherwise, start a new session with no tasks
        const updatedSession = sessionHandler.cycleStart([]);
        writeSessionToPomoHubData(updatedSession);

        // if there are no previous sessions, start a new session with no tasks
      } else {
        const updatedSession = sessionHandler.cycleStart([]);
        writeSessionToPomoHubData(updatedSession);
      }

      // writeSessionToPomoHubData(updatedSession);
    }
    setIsRunning(!isRunning);
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

  useEffect(() => {
    if (!(isRunning && time > 0)) {
      if (time === 0) {
        setIsRunning(false);
        // call endCycle logic here
        ding.play(); // play 'done with cycle' sound notification
        // ask user if they want to start a new cycle or end the current session
      }
    } else {
      const interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, time]);

  const displayTime = formatDisplayTime(time);

  return (
    <div className="h-[230px]">
      <div className="h-[300px] w-[500px] md:w-[375px] md:h-[200px] lg:w-[450px] lg:h-[230px] lg:mb-12 bg-zinc-700 rounded-md text-center">
        <h1 className=" pt-16 md:pt-2 text-9xl lg:text-9xl font-semibold text-white pt-8">{displayTime}</h1>
        <div className="flex-row mt-3">
          <button className="bg-red-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2" onClick={decrementTimerByStep}>
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
