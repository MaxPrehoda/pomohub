import { PomoHubLocalStorageInterface, SessionInterface } from './entities';

const currentDateTime = new Date();

const defaultSession: SessionInterface = { sessionTimestamp: currentDateTime };

const defaultPomoHubData: PomoHubLocalStorageInterface = {
  username: 'PomoHub User',
  storedSessions: [defaultSession]
};

export default defaultPomoHubData;
