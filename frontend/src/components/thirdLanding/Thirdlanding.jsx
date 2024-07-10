import React from 'react'
import './Thirdlanding.css'
import { IoIosArrowRoundForward } from "react-icons/io";
import {Navigate, useNavigate} from 'react-router-dom';

const Thirdlanding = () => {

  const navigate = useNavigate();

  const moven=()=>{
      navigate('/login')
  }
  return (
    <div className='landing_mainss'>

        <div className='landing_box'>

            <h2 className='main_head'>We serve</h2>
            <h2>incomparable</h2>
            <h2>delicacies</h2>


            <p className='details dtl'>All the best restaurants with their top</p>
            <p className='details'>menu waiting for you, they cant’t wait</p>
            <p className='details'>for your order!!</p>

            <div className='active_light'>

                <div className='light_liness1 line'></div>

                <div className='light_liness2 line'></div>

                <div className='light_liness3 line'></div>

            </div>

            <div className='outer_ring'>

           

            <div className='landing_footers'>
            <IoIosArrowRoundForward className='icns' onClick={moven}/>

            </div>

            </div>



        </div>

        <div className='big_line'>

        </div>

    </div>
  )
}

export default Thirdlanding
