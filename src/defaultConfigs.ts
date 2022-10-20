import { ConfigInterface } from './entities';

const defaultConfig: ConfigInterface = {
  userName: 'default',
  breakCycleDurationMinutes: 10,
  cycleDurationMinutes: 30,
  stepDurationMinutes: 5,
  maximumCycleDurationMinutes: 180,
  isExpectedVsActualEnabled: false
};

export default defaultConfig;
