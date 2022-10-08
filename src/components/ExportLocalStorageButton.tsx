import React from 'react';

import { readPomoHubData } from '../App';

function ExportLocalStorageButton() {
  const exportLocalStorage = () => {
    const pomoHubData = readPomoHubData();
    const pomoHubDataString = JSON.stringify(pomoHubData);
    const blob = new Blob([pomoHubDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'pomo-hub-data.json';
    link.href = url;
    link.click();
  };

  return (
    <button
      className="bg-purple-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50"
      onClick={exportLocalStorage}
    >
      Export Local Storage (This works, this button can be moved/re-UI'd)
    </button>
  );
}

export default ExportLocalStorageButton;
