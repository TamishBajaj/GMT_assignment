import React from 'react'
import './Loginsucess.css'
import {Navigate, useNavigate} from 'react-router-dom';

import congrats from '../../assets/congrats.png'

const Loginsucess = () => {


  const navigate = useNavigate();

  const mainpage=()=>{
      navigate('/clock')
  }

  const ret=()=>{
    navigate('/login')
  }
  return (
    <div className='sucess_main'>

    <div className='inner_bx'>

    <div className='grey_line'></div>

    <img src={congrats} className='congo_img'/>

    <h1>Login Successful</h1>

    <button className='mainscreen_btn' onClick={mainpage}>Go to tracking screen</button>

    <p onClick={ret} className='logout_lnk'>Logout</p>


    <div className='black_line'></div>

    </div>
      
    </div>
  )
}

export default Loginsucess
