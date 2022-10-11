import { ConfigInterface } from './entities';

const defaultConfig: ConfigInterface = {
  userName: 'default',
  cycleDurationMinutes: 30,
  stepDurationMinutes: 5,
  maximumCycleDurationMinutes: 180,
  isExpectedVsActualEnabled: false
};

export default defaultConfig;
