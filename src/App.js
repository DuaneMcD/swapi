import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header';
import { SwapiTable } from './components/Table';

function App() {
  return (
    <div className='App'>
      <Header />
      <SwapiTable />
    </div>
  );
}

export default App;
