import React, { useState } from 'react';

import Icon from '../assets/icons/clock.svg';

function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.Maximize();
  };

  return (
    <>
      <div className='pb-6 draggable'>
        <div className="py-0.5 flex justify-between draggable bg-transparent text-zinc-400">
          <div className="inline-flex">
            <img className="w-6 mr-1 ml-1" src={Icon} alt="Icon of pomo" />
            <p className="text-xs font-semibold pt-1">Pomo Hub</p>
          </div>
          <div className="inline-flex -mt-1">
            MIN ICON | MAX ICON | CLOSE ICON
          </div>
        </div>
      </div>
    </>
  );
}

export default AppBar;