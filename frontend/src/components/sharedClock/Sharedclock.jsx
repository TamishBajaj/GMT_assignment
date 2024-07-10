import React, { useState, useEffect, useRef } from 'react';
import './Sharedclock.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Clock from '../clock/Clock';

const Sharedclock = () => {
    const { id } = useParams();
    const [config, setConfig] = useState(null);
  
    useEffect(() => {
      const fetchConfig = async () => {
        const response = await axios.get(`http://localhost:3000/api/v1/config/load-config/${id}`);
        setConfig(response.data);
      };
      fetchConfig();
    }, [id]);
  
    if (!config) return <div>Loading...</div>;
  
    return <Clock speed={config.speed} initialTime={new Date(config.timestamp)} />;
  };

export default Sharedclock
