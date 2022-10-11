import { PomoHubLocalStorageInterface, SessionInterface } from './entities';

const currentDateTime = new Date();

const defaultSession: SessionInterface = {
  startingDateTime: currentDateTime,
  numberOfCyclesCompleted: 0,
  isRunning: false,
  cycleArray: [],
  expectedCycleArray: [],
  endingDateTime: null
};

const defaultPomoHubData: PomoHubLocalStorageInterface = {
  userName: 'PomoHub User',
  storedSessions: [defaultSession]
};

export default defaultPomoHubData;
