import React from 'react';
import usePomoSession from '../backend/session';

function ExportSessionButton() {
  const { pomoSessionData, getSessionSummary } = usePomoSession();

  const isButtonDisabled = Object.keys(pomoSessionData).length === 0;

  const exportSessionSummary = () => {
    const summary = getSessionSummary();
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
      className="bg-purple-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50"
      onClick={exportSessionSummary}
      disabled={isButtonDisabled}
    >
      Export Session Summary (this does not work yet)
    </button>
  );
}

export default ExportSessionButton;
