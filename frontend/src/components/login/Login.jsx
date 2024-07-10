import {React,useState} from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import {Navigate, useNavigate} from 'react-router-dom';

import axios from 'axios';
import './Login.css'

import google from '../../assets/google.png'
import eye from '../../assets/eye.png'

const Login = () => {

  const { loginWithRedirect } = useAuth0();

  const navigate = useNavigate();

    const [formData,setFormData]=useState({
        email:'',
        password:''
    });

    const {email,password}=formData

    const onChange=e=>setFormData({...formData,[e.target.name]:e.target.value})

    const onSubmit=async e=>{
      console.log("yes hitting")
   //    console.log(BASE_URL)
      // console.log(process.env.REACT_APP_BASE_URL)
       e.preventDefault();
       try{
           const res=await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`,{email,password});
           console.log("submitted")
           console.log(res.data)
           const { token } = res.data; // Assuming the token is returned in the response data

           // Store the token in local storage
           localStorage.setItem('token', token);
           
               navigate('/congrats')
           
       }catch(err){
           console.error(err.response.data)
       }
   };


  return (
    <div className='login_main'>

        <div className='login_head'>
         <h1>Login to your account.</h1>
         <h3>Please sign in to your account </h3>

        </div>

        <form className='login_form' onSubmit={onSubmit}>
        <div className='inpp'>
        <label for="email" className='lbl'>Email Address:</label>
        <input type="text" id="email" name="email" className='inpt_fld' placeholder='Enter Email'  value={email} onChange={onChange}/>
        </div>

        <div className='inpp'>

        <label for="password" className='lbl'>Password:</label>

        <div className='eye_special'>

        
        <input type="password" id="password" name="password" className='inpt_fld' placeholder='Password' value={password} onChange={onChange} />
        <img src={eye} className='eye-icon'/>
        </div>
        </div>


        <a className='forgot_link' href=''>Forgot Password?</a>

        <button className='signin_btn' type="submit">Sign In</button>
        </form>

        <div className='fancy_style'>
            <div className='lines'>

            </div>

            <p>Or sign in with</p>

            <div className='lines'>

            </div>



        </div>

        <img className='google_icn' src={google}  onClick={() => loginWithRedirect()}/>


        <p className='regis'>Don't have an account?<a href='/register' className='register_link'>Register</a></p>
    </div>
  )
}

export default Login;