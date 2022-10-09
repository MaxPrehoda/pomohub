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

  constructor(sessionData: SessionInterface = defaultPomoSessionData) {
    this.sessionData = sessionData;
  }

  startSession(): SessionInterface {
    this.sessionData.isRunning = true;
    this.sessionData.startingDateTime = new Date();
    return this.sessionData;
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

  cycleModify(currTask: Tasks): SessionInterface {
    // initialize new timestamp & locate the current cycle in the cycle array
    const currDate = new Date();
    const cycleIndex = this.sessionData.cycleArray.length - 1;
    // initialize a new task copy to modify the date stamp of
    const modifyTask: Tasks = currTask;
    modifyTask.dateChanged = currDate;
    // filter for the specific task if existing, otherwise will get -1 index error
    const taskIdentifier = (task: { taskId: number }) => task.taskId === currTask.taskId;
    const taskIndex = this.sessionData.cycleArray[cycleIndex].tasks.findIndex(taskIdentifier);
    // if the identifier doesnt return a valid index, push the current task to the end, otherwise replace at index
    if (taskIndex === -1) {
      this.sessionData.cycleArray[cycleIndex].tasks.push(modifyTask);
    } else {
      this.sessionData.cycleArray[cycleIndex].tasks[taskIndex] = modifyTask;
    }
    return this.sessionData;
  }

  stopSession(): SessionInterface {
    this.sessionData.isRunning = false;
    return this.sessionData;
  }

  endSession(nextCycle: CycleData): [SessionInterface, SessionInterface] {
    this.sessionData.numberOfCyclesCompleted += 1;
    this.sessionData.cycleArray[-1].cycleEnd = new Date();

    const lastSessionData = this.sessionData;
    const newSession = new PomoSessionHandler();
    newSession.sessionData.cycleArray.push(nextCycle);
    newSession.sessionData.expectedCycleArray.push(nextCycle);

    const remainingTasks = lastSessionData.cycleArray[-1].tasks.filter((task) => task.taskState === 'incomplete');
    const missingTasks = remainingTasks.filter((tasks) => !nextCycle.tasks.includes(tasks));
    newSession.sessionData.cycleArray[-1].tasks = [...remainingTasks, ...missingTasks];

    return [lastSessionData, newSession.sessionData];
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
