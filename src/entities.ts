export interface ConfigInterface {
  cycleDurationMinutes: number;
  stepDurationMinutes: number;
  maximumCycleDurationMinutes: number;
  isExpectedVsActualEnabled: boolean;
}

export interface SessionInterface {
  startingDateTime: Date | null;
  numberOfCyclesCompleted: number;
  cycleArray: CycleData[];
  expectedCycleArray: CycleData[];
  isRunning: boolean;
  endingDateTime: Date | null;
}
export interface PomoHubLocalStorageInterface {
  username: string;
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
