import { Tasks, SessionInterface, CycleData } from '../entities';

const defaultPomoSessionData: SessionInterface = {
  startingDateTime: new Date(),
  numberOfCyclesCompleted: 0,
  isRunning: false,
  cycleArray: [],
  expectedCycleArray: [],
  endingDateTime: null
};

export default class PomoSessionHandler {
  sessionData: SessionInterface;

  lastCycle: CycleData;

  constructor(sessionData: SessionInterface = defaultPomoSessionData) {
    this.sessionData = sessionData;
    this.lastCycle = this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1];
  }

  startSession(): SessionInterface {
    this.sessionData.isRunning = true;
    this.sessionData.startingDateTime = new Date();
    return this.sessionData;
  }

  cycleEnd(): SessionInterface {
    this.forceDateTimesToBeDateTimes();
    const currDate = new Date();
    const currCycle = this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1];
    if (currCycle.cycleStart === null) {
      throw new Error('cycleStart cannot be null.');
    }
    const cycleDurationSeconds = (currDate.getTime() - currCycle.cycleStart.getTime()) / 1000;
    const originalCycleStart = currCycle.cycleStart;
    if (typeof originalCycleStart === 'string') {
      throw new Error('cycleStart cannot be a string.');
    }
    const updatedCycle: CycleData = {
      tasks: currCycle.tasks,
      cycleStart: currCycle.cycleStart,
      cycleEnd: currDate,
      cycleSecDur: cycleDurationSeconds
    };
    this.updateExistingCycle(updatedCycle);
    return this.sessionData;
  }

  updateExistingCycle(cycleContents: CycleData): SessionInterface {
    this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1] = cycleContents;
    return this.sessionData;
  }

  private forceDateTimesToBeDateTimes() {
    this.sessionData.cycleArray.forEach((cycle) => {
      if (cycle.cycleStart !== null && !(cycle.cycleStart instanceof Date)) {
        // eslint-disable-next-line no-param-reassign
        cycle.cycleStart = new Date(cycle.cycleStart);
      }
      if (cycle.cycleEnd !== null && !(cycle.cycleEnd instanceof Date)) {
        // eslint-disable-next-line no-param-reassign
        cycle.cycleEnd = new Date(cycle.cycleEnd);
      }
    });
  }

  cycleStart(savedTasks: Tasks[]): SessionInterface {
    const unfinishedTasks = savedTasks.filter((task) => task.taskState === 'incomplete');
    const currCycle: CycleData = {
      tasks: unfinishedTasks,
      cycleStart: new Date(),
      cycleEnd: null,
      cycleSecDur: null
    };
    this.sessionData.cycleArray.push(currCycle);
    this.sessionData.expectedCycleArray.push(currCycle);
    return this.sessionData;
  }

  // come back
  updateCycle(currTask: Tasks): SessionInterface {
    // initialize new timestamp & locate the current cycle in the cycle array
    if (this.sessionData.cycleArray.length !== 0) {
      throw new Error('cycleArray cannot be empty.');
    }
    const currDate = new Date();
    // initialize a new task copy to modify the date stamp of
    const modifyTask: Tasks = currTask;
    modifyTask.dateChanged = currDate;
    // filter for the specific task if existing, otherwise will get -1 index error
    // const taskIdentifier = (task: { taskId: number }) => task.taskId === currTask.taskId;
    const originaltask = this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1].tasks.filter(
      (tasks) => tasks.taskId === currTask.taskId
    );
    const taskIndex = this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1].tasks.indexOf(
      originaltask[0]
    );
    // if the identifier doesnt return a valid index, push the current task to the end, otherwise replace at index
    if (taskIndex === -1) {
      this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1].tasks.push(modifyTask);
    } else {
      this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1].tasks[taskIndex] = modifyTask;
    }
    return this.sessionData;
  }

  stopSession(): SessionInterface {
    this.sessionData.isRunning = false;
    return this.sessionData;
  }

  endSession(nextCycle: CycleData): [SessionInterface, SessionInterface] {
    this.sessionData.numberOfCyclesCompleted += 1;

    const lastSessionData = this.sessionData;
    const newSession = new PomoSessionHandler();
    newSession.sessionData.cycleArray.push(nextCycle);
    newSession.sessionData.expectedCycleArray.push(nextCycle);

    const remainingTasks = lastSessionData.cycleArray[lastSessionData.cycleArray.length - 1].tasks.filter(
      (task) => task.taskState === 'incomplete'
    );
    const missingTasks = remainingTasks.filter((tasks) => !nextCycle.tasks.includes(tasks));
    newSession.sessionData.cycleArray[newSession.sessionData.cycleArray.length - 1].tasks = [
      ...remainingTasks,
      ...missingTasks
    ];
    return [lastSessionData, newSession.sessionData];
  }

  updateSession(cycleContents: CycleData): SessionInterface {
    this.sessionData.cycleArray[this.sessionData.cycleArray.length - 1] = cycleContents;
    return this.sessionData;
  }

  getSessionSummary(): [Date, number, CycleData[], CycleData[]] {
    return [
      this.sessionData.startingDateTime,
      this.sessionData.numberOfCyclesCompleted,
      this.sessionData.cycleArray,
      this.sessionData.expectedCycleArray
    ];
  }

  getPercentageOfCompletedTasksInCycle(cycleIndex: number): number {
    const actualCycleData = this.sessionData.cycleArray[cycleIndex];
    const expectedCycleData = this.sessionData.expectedCycleArray[cycleIndex];

    const numberOfExpectedTasks = expectedCycleData.tasks.length;
    const numberOfActualTasksCompleted = actualCycleData.tasks.filter((task) => {
      const expectedTaskIdentifier = (expectedTask: { taskId: number }) => expectedTask.taskId === task.taskId;
      const expectedTaskIndex = expectedCycleData.tasks.findIndex(expectedTaskIdentifier);
      return expectedTaskIndex !== -1 && task.taskState === 'complete';
    }).length;
    const roundedPercentage = Math.round((numberOfActualTasksCompleted / numberOfExpectedTasks) * 100);
    return roundedPercentage;
  }
}
