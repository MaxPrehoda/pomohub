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

  constructor(startingDate: Date) {
    this.startingDate = startingDate;
    this.numberOfCyclesCompleted = 0;
    this.isRunning = false;
    this.cycleArray = [];
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
    if (taskIndex !== -1) {
      this.cycleArray[cycleIndex].tasks.push(modifyTask);
    } else {
      this.cycleArray[cycleIndex].tasks[taskIndex] = modifyTask;
    }
  }

  stopSession() {
    this.isRunning = false;
  }
}
