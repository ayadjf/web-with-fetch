import React from 'react';

import Dashboard from './components/Dashboard'; 
import './App.css';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard--content">
        <Dashboard/>
      </div>
    </div>
  );
};

export default App;
