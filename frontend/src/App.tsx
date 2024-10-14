import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserRegistration from './components/UserRegistration';
import Login from './components/Login';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
function App() {
  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<UserRegistration/>}/>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/dashboard'} element={<Dashboard/>}/>

      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
