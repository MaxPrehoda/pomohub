import { PomoHubLocalStorageInterface } from '../entities';
import { readPomoHubData } from '../App';

class PomoHubAPI {
  locallyStoredPomoHubData: PomoHubLocalStorageInterface;

  constructor() {
    this.locallyStoredPomoHubData = readPomoHubData();
  }

  postLocallyStoredPomoHubData = async () => {
    const response = await fetch('https://pomohub.com/api/v1/pomohubdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.locallyStoredPomoHubData)
    });
    return response.json();
  };
}

export default new PomoHubAPI();
