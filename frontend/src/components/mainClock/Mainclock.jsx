import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Clock from '../clock/Clock';
import './Mainclock.css'
import timer from '../../assets/timer1.gif'

// require('dotenv').config()


const Mainclock = () => {

    const [speed, setSpeed] = useState(1);
  const [configId, setConfigId] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const initialTime = new Date(new Date().getTime() - 120 * 60 * 1000);


  const fetchQuotes = async () => {
    try {
        const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
            headers: { 'X-Api-Key': process.env.REACT_APP_API_KEY}
          });
          const randomQuotes = response.data.sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuotes(randomQuotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const intervalId = setInterval(fetchQuotes, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const saveConfig = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/config/save-config', { speed, timestamp: initialTime });
      setConfigId(response.data);
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };
  return (
    <div className='heads'>

    

    
    <div className='outr_bx'>

    

   
   
    <div className='clock_outlook'>
    <img src={timer} className='timer_img'/>
    <Clock speed={speed} initialTime={initialTime}/>
    
    <input
      type="range"
      min="0.1"
      max="2"
      step="0.1"
      value={speed}
      onChange={(e) => setSpeed(parseFloat(e.target.value))}
      className='inpt_rng'
    />
    <button onClick={saveConfig} className='btn'>Share</button>
    {configId && <Link to={`/${configId}`} className='link_share'>Shareable Link</Link>}
  </div>
  <div className='quotes_div'>
  <h1>Random jokes</h1>
        
        {quotes.map((quote, index) => (

          <div key={index}>
            <p>"{quote.quote}" - {quote.author}</p>
          </div>
        ))}
      </div>
  </div>

  </div>
  )
}

export default Mainclock

