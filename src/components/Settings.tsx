import React, { useState } from 'react';

import { writeUsernameToPomoHubData, readPomoHubData } from '../App';

function Modal({ setOpenModal }) {
  const [username, setUsername] = useState(readPomoHubData().username);
  const handleUsernameChange = (event: any) => {
    console.log(`Username changing from '${username}' to '${event.target.value}`);
    setUsername(event.target.value);
    writeUsernameToPomoHubData(username);
  };

  const usernameInput = (
    <div className="flex flex-col">
      <label htmlFor="username" className="text-sm font-medium text-gray-700">
        Username
        <div className="mt-1">
          <input
            type="text"
            name="username"
            id="username"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
      </label>
    </div>
  );

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>title</h1>
        </div>
        <div className="body">
          <p>The next page!</p>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
