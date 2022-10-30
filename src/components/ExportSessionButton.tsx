import React from 'react';
import PomoSessionHandler from '../backend/session';
import { readPomoHubData } from '../App';

function ExportSessionButton() {
  const isButtonDisabled = readPomoHubData().storedSessions.length === 0;

  const exportSessionSummary = () => {
    const currentSession =
      readPomoHubData().storedSessions.length > 0
        ? readPomoHubData().storedSessions[-1]
        : new PomoSessionHandler().startSession();

    const sessionHandler = new PomoSessionHandler(currentSession);
    const summary = sessionHandler.getSessionSummary();
    const summaryString = JSON.stringify(summary);
    const blob = new Blob([summaryString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'pomo-session-summary.json';
    link.href = url;
    link.click();
  };

  return (
    <button
      className="bg-pink-400 hover:bg-pink-300 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50 font-semibold"
      onClick={exportSessionSummary}
      disabled={isButtonDisabled}
    ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline mr-2 -mt-1">
    <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6.905 9.97a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72V18a.75.75 0 001.5 0v-4.19l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clip-rule="evenodd" />
    <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
  </svg>
  
      Export Session Summary
    </button>
  );
}

export default ExportSessionButton;
