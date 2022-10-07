export interface ConfigInterface {
  cycleDurationMinutes: number;
  stepDurationMinutes: number;
  maximumCycleDurationMinutes: number;
}

export interface SessionInterface {
  sessionTimestamp: Date;
}
export interface PomoHubLocalStorageInterface {
  username: string;
  storedSessions: Array<SessionInterface>;
}
