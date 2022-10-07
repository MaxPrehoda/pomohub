import React, { useEffect, useState } from 'react';

function Clock() {
  const defaultStartingMinutes = 45;
  const [time, setTime] = useState(defaultStartingMinutes * 60);
  useEffect(() => {
    if (time > 0) {
      const interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const displayTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <div className="h-[230px]">
      <div className="h-[200px] w-[300px] md:w-[375px] lg:w-[450px] lg:h-[230px] lg:mb-12 bg-zinc-700 rounded-md text-center">
        <h1 className="text-8xl lg:text-9xl font-semibold text-white pt-8">{displayTime}</h1>
        <div className="flex-row mt-3">
          <button className="bg-red-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#fff"
              className="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="bg-zinc-500 rounded-md pl-2 pt-2 pb-2 mr-2 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#fff"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
              />
            </svg>
          </button>
          <button className=" bg-green-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#fff"
              className="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Clock;
