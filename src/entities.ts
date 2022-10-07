export interface ConfigInterface {
  cycleDurationMinutes: number;
  stepDurationMinutes: number;
  maximumCycleDurationMinutes: number;
  isExpectedVsActualEnabled: boolean;
}

export interface SessionInterface {
  sessionTimestamp: Date;
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
