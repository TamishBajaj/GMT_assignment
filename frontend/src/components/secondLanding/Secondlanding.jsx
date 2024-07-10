import React from 'react'
import './Secondlanding.css'
import { IoIosArrowRoundForward } from "react-icons/io";
import {Navigate, useNavigate} from 'react-router-dom';

const Secondlanding = () => {

  const navigate = useNavigate();

  const moven=()=>{
      navigate('/nextly')
  }


  const back=()=>[
    navigate('/register')
  ]
  return (
    <div className='landing_mains'>

        <div className='landing_box'>

            <h2 className='main_head'>We serve</h2>
            <h2>incomparable</h2>
            <h2>delicacies</h2>


            <p className='details dtl'>All the best restaurants with their top</p>
            <p className='details'>menu waiting for you, they cant’t wait</p>
            <p className='details'>for your order!!</p>

            <div className='active_light'>

                <div className='light_lines1 line'></div>

                <div className='light_lines2 line'></div>

                <div className='light_lines3 line'></div>

            </div>

            <div className='landing_footer'>
             <p onClick={back}>Skip</p>

             <div className='icnns'>
             <p onClick={moven} className='move_bn'>Next</p>
             <IoIosArrowRoundForward className='icn'/>

             </div>

             
            

             

             

            </div>



        </div>

        <div className='big_line'>

        </div>

    </div>
  )
}

export default Secondlanding
