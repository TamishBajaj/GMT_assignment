import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route,Routes,Link} from 'react-router-dom';


import Home from './pages/Home';
import Second from './pages/Second';
import Third from './pages/Third';
import Loginpage from './pages/Loginpage';
import RegisterPage from './pages/RegisterPage';
import Sucess from './pages/Sucess';
import Clock from './components/clock/Clock';
import Sharedclock from './components/sharedClock/Sharedclock';
import Mainclock from './components/mainClock/Mainclock';



function App() {

  
  return (
    <>

    
    

    <Router>
      <div className='App'>
      
      
        <Routes>

        
      

        
          <Route index element={<Home />} />
          <Route path="/clock" element={<Mainclock />} />
        <Route path="/clock/:id" element={<Sharedclock />} />
          <Route path='/next' element={<Second/>} />
          <Route path='/nextly' element={<Third/>} /> 
          <Route path='/login' element={<Loginpage/>} /> 
          <Route path='/register' element={<RegisterPage/>} /> 
          <Route path='/congrats' element={<Sucess/>} /> 
          </Routes>
          </div>
    </Router>
    

    
    

    </>
  );
}

export default App;
