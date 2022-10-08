import { Tasks } from '../entities';

interface cycleData {
  tasks: Array<Tasks>;
  cycleStart: Date | null;
  cycleEnd: Date | null;
  cycleSecDur: number | null;
}

export default class PomoSession {
  startingDate: Date;

  numberOfCyclesCompleted: number;

  isRunning: boolean;

  cycleArray: Array<cycleData>;

  expectedCycleArray: Array<cycleData>;

  constructor(startingDate: Date) {
    this.startingDate = startingDate;
    this.numberOfCyclesCompleted = 0;
    this.isRunning = false;
    this.cycleArray = [];
    this.expectedCycleArray = [];
  }

  startSession() {
    this.isRunning = true;
    this.startingDate = new Date();
  }

  cycleStart(savedTasks: Tasks[]) {
    const unfinishedTasks = savedTasks.filter((task) => task.taskState === 'incomplete');
    const currCycle: cycleData = {
      tasks: unfinishedTasks,
      cycleStart: new Date(),
      cycleEnd: null,
      cycleSecDur: null
    };
    this.cycleArray.push(currCycle);
    this.expectedCycleArray.push(currCycle);
    // if reference to the current cycle is needed
    return currCycle.cycleStart;
  }

  cycleModify(currTask: Tasks) {
    // initialize new timestamp & locate the current cycle in the cycle array
    const currDate = new Date();
    const cycleIndex = this.cycleArray.length - 1;
    // initialize a new task copy to modify the date stamp of
    const modifyTask: Tasks = currTask;
    modifyTask.dateChanged = currDate;
    // filter for the specific task if existing, otherwise will get -1 index error
    const taskIdentifier = (task: { taskId: number }) => task.taskId === currTask.taskId;
    const taskIndex = this.cycleArray[cycleIndex].tasks.findIndex(taskIdentifier);
    // if the identifier doesnt return a valid index, push the current task to the end, otherwise replace at index
    if (taskIndex === -1) {
      this.cycleArray[cycleIndex].tasks.push(modifyTask);
    } else {
      this.cycleArray[cycleIndex].tasks[taskIndex] = modifyTask;
    }
  }

  stopSession() {
    this.isRunning = false;
  }

  endSession(nextCycle: cycleData) {
    this.numberOfCyclesCompleted += 1;
    this.cycleArray[-1].cycleEnd = new Date();
    const remainingTasks = this.cycleArray[-1].tasks.filter((task) => task.taskState === 'incomplete');
    const missingTasks = remainingTasks.filter((tasks) => !nextCycle.tasks.includes(tasks));
    const revisedCycle = nextCycle;
    revisedCycle.tasks = [...revisedCycle.tasks, ...missingTasks];
    return revisedCycle;
  }

  getSessionSummary() {
    return [this.startingDate, this.numberOfCyclesCompleted, this.cycleArray, this.expectedCycleArray];
  }

  getPercentageOfCompletedTasksInCycle(cycleIndex: number): number {
    const actualCycleData = this.cycleArray[cycleIndex];
    const expectedCycleData = this.expectedCycleArray[cycleIndex];

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
