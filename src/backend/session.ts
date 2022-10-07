import Task from '../components/Task';
import { Tasks } from '../entities';
import TaskList from '../components/TaskList';

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

  start() {
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
  }

  stop() {
    this.isRunning = false;
  }
}
