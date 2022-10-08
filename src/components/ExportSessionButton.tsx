import React from 'react';
import usePomoSession from '../backend/session';

function ExportSessionButton() {
  const { getSessionSummary } = usePomoSession();

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
    <button className="bg-green-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2" onClick={exportSessionSummary}>
      Export Session Summary  (This does not work, Max make this UI better)
    </button>
  );
}

export default ExportSessionButton;
