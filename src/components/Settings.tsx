import React, { useState } from 'react';

import { writeUsernameToPomoHubData, readPomoHubData } from '../App';

function settingsDropdown() {
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
    <label>
      {label}
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export default settingsDropdown;
