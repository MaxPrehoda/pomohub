import { Input } from 'postcss';
import React, { useEffect, useState } from 'react';
import AppBar from '../src/components/AppBar';

function App() {

  return (
    <div className="flex flex-col h-screen transition-opacity duration-75">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
    </div >
  );
}

export default App;
