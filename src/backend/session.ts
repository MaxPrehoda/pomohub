export default class PomoSession {
  startingDate: Date;

  numberOfCyclesCompleted: number;

  isRunning: boolean;

  cycleArray: Array<object>;

  constructor(startingDate: Date) {
    this.startingDate = startingDate;
    this.numberOfCyclesCompleted = 0;
    this.isRunning = false;
    this.cycleArray = [];
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }
}
