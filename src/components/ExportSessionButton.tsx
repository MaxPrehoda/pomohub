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
      className="bg-indigo-500 hover:bg-indigo-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50 font-semibold"
      onClick={exportSessionSummary}
      disabled={isButtonDisabled}
    >
      Export Session Summary
    </button>
  );
}

export default ExportSessionButton;
