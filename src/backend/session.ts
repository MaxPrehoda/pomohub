import { useState } from 'react';
import { Tasks, SessionInterface, CycleData } from '../entities';

const defaultPomoSessionData: SessionInterface = {
  startingDateTime: new Date(),
  numberOfCyclesCompleted: 0,
  isRunning: false,
  cycleArray: [],
  expectedCycleArray: [],
  endingDateTime: null
};

export default function usePomoSession(defaultData = defaultPomoSessionData) {
  const [pomoSessionData, setPomoSessionData] = useState(defaultData);

  const startSession = () => {
    console.log('startSession ran');
    setPomoSessionData((data) => ({
      ...data,
      isRunning: true,
      startingDateTime: new Date()
    }));
  };

  const cycleStart = (savedTasks: Tasks[]) => {
    const unfinishedTasks = savedTasks.filter((task) => task.taskState === 'incomplete');
    const currCycle: CycleData = {
      tasks: unfinishedTasks,
      cycleStart: new Date(),
      cycleEnd: null,
      cycleSecDur: null
    };
    setPomoSessionData((data) => ({
      ...data,
      cycleArray: [...data.cycleArray, currCycle],
      expectedCycleArray: [...data.expectedCycleArray, currCycle]
    }));

    // if reference to the current cycle is needed
    return currCycle.cycleStart;
  };

  const cycleModify = (currTask: Tasks) => {
    // initialize new timestamp & locate the current cycle in the cycle array
    const currDate = new Date();
    setPomoSessionData((data) => {
      const cycleIndex = data.cycleArray.length - 1;
      // initialize a new task copy to modify the date stamp of
      const modifyTask: Tasks = currTask;
      modifyTask.dateChanged = currDate;
      // filter for the specific task if existing, otherwise will get -1 index error
      const taskIdentifier = (task: { taskId: number }) => task.taskId === currTask.taskId;
      const taskIndex = data.cycleArray[cycleIndex].tasks.findIndex(taskIdentifier);

      // if the identifier doesnt return a valid index, push the current task to the end, otherwise replace at index
      const newCycleArray: CycleData[] = [];
      // for each cycle, if the cycleIndex is the current cycle, modify the task
      data.cycleArray.forEach((currentCycle, index) => {
        const updatedCycle: CycleData = currentCycle;
        if (index === cycleIndex) {
          if (taskIndex === -1) {
            updatedCycle.tasks.push(modifyTask);
          } else {
            updatedCycle.tasks[taskIndex] = modifyTask;
          }
        }
        newCycleArray.push(updatedCycle);
      });
      return {
        ...data,
        cycleArray: newCycleArray
      };
    });
  };

  const stopSession = () => {
    setPomoSessionData((data) => ({
      ...data,
      isRunning: false
    }));
  };

  const endSession = (nextCycle: CycleData) => {
    setPomoSessionData((data) => {
      const newData = data;
      newData.numberOfCyclesCompleted += 1;
      newData.cycleArray[-1].cycleEnd = new Date();
      const remainingTasks = newData.cycleArray[-1].tasks.filter((task) => task.taskState === 'incomplete');
      const missingTasks = remainingTasks.filter((tasks) => !nextCycle.tasks.includes(tasks));
      const revisedCycle = nextCycle;
      revisedCycle.tasks = [...revisedCycle.tasks, ...missingTasks];

      return {
        ...newData
      };
    });
  };

  const getSessionSummary = () => {
    return {
      startingDateTime: pomoSessionData.startingDateTime,
      numberOfCyclesCompleted: pomoSessionData.numberOfCyclesCompleted,
      cycleArray: pomoSessionData.cycleArray,
      expectedCycleArray: pomoSessionData.expectedCycleArray,
      isRunning: pomoSessionData.isRunning,
      endingDateTime: pomoSessionData.cycleArray[pomoSessionData.cycleArray.length - 1].cycleEnd
    };
  };

  const getPercentageOfCompletedTasksInCycle = (cycleIndex: number) => {
    const actualCycleData = pomoSessionData.cycleArray[cycleIndex];
    const expectedCycleData = pomoSessionData.expectedCycleArray[cycleIndex];

    const numberOfExpectedTasks = expectedCycleData.tasks.length;
    const numberOfActualTasksCompleted = actualCycleData.tasks.filter((task) => {
      const expectedTaskIdentifier = (expectedTask: { taskId: number }) => expectedTask.taskId === task.taskId;
      const expectedTaskIndex = expectedCycleData.tasks.findIndex(expectedTaskIdentifier);
      return expectedTaskIndex !== -1 && task.taskState === 'complete';
    }).length;
    const roundedPercentage = Math.round((numberOfActualTasksCompleted / numberOfExpectedTasks) * 100);
    return roundedPercentage;
  };

  return {
    pomoSessionData,
    startSession,
    cycleStart,
    cycleModify,
    endSession,
    stopSession,
    getSessionSummary,
    getPercentageOfCompletedTasksInCycle
  };
}
