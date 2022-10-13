export interface ConfigInterface {
  userName: string;
  cycleDurationMinutes: number;
  breakCycleDurationMinutes: number;
  stepDurationMinutes: number;
  maximumCycleDurationMinutes: number;
  isExpectedVsActualEnabled: boolean;
}

export interface SessionInterface {
  startingDateTime: Date;
  numberOfCyclesCompleted: number;
  cycleArray: Array<CycleData>;
  expectedCycleArray: Array<CycleData>;
  isRunning: boolean;
  endingDateTime: Date | null;
}
export interface PomoHubLocalStorageInterface {
  userName: string;
  storedSessions: Array<SessionInterface>;
}

export interface Tasks {
  taskName: string;
  taskId: number;
  taskState: string;
  dateChanged: Date;
}

export interface CycleData {
  tasks: Array<Tasks>;
  cycleStart: Date | null;
  cycleEnd: Date | null;
  cycleSecDur: number | null;
}
