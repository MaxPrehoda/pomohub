import Task from '../components/Task';

interface cycleData {
  tasks: Array<typeof Task>;
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
    this.cycleArray.push();
  }

  stop() {
    this.isRunning = false;
  }
}
