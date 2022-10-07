import { Input } from 'postcss';
import React, { useEffect, useState } from 'react';
import AppBar from '../src/components/AppBar';
import Clock from '../src/components/Clock';

function App() {

  return (
    <div className="flex flex-col h-screen transition-opacity duration-75">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto">
        <div className=" flex flex-col justify-center items-center h-full bg-zinc-900 space-y-4">
          <Clock />
        </div></div>
    </div >
  );
}

export default App;
