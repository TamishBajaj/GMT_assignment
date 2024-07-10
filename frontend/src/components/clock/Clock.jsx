import React, { useState, useEffect, useRef } from 'react';
import './Clock.css'

const Clock = ({ speed, initialTime }) => {

    const [time, setTime] = useState(initialTime);
    const intervalRef = useRef(null);
  
    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setTime((prev) => new Date(prev.getTime() - 1000 * speed));
      }, 1000);
  
      return () => clearInterval(intervalRef.current);
    }, [speed]);
  
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    
  return (
    <div className='clock_main'>
      {formatTime(time)}
    </div>
  )
}

export default Clock
