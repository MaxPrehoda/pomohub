import React from 'react';

import { readPomoHubData } from '../App';

function ExportLocalStorageButton() {
  const exportLocalStorage = () => {
    const pomoHubData = readPomoHubData();
    //console.log('READ', pomoHubData);
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
      className="bg-pink-400 hover:bg-pink-300 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50 font-semibold"
      onClick={exportLocalStorage}
    ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline mr-2 -mt-1.5">
    <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
  </svg>
  
      Export Local Storage
    </button>
  );
}

export default ExportLocalStorageButton;
