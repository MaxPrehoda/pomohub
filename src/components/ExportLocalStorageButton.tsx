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
      className="bg-indigo-500 hover:bg-indigo-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50 font-semibold"
      onClick={exportLocalStorage}
    >
      Export Local Storage
    </button>
  );
}

export default ExportLocalStorageButton;
