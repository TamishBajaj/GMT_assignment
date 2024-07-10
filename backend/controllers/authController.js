const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User=require('../models/User')
// require('dotenv').config()


exports.register = async (req, res) => {
    const { username,email, password } = req.body;
  
    try {
      const user = new User({ username,email, password: bcrypt.hashSync(password, 10) });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    const {email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  //logout user

exports.logout=catchAsyncErrors(async(req,res,next)=>{

    
    
  res.cookie('token',null,{
   expires: new Date(Date.now()),
   httpOnly:true,
   });
res.status(200).json({
   sucess:true,
   message:"Logged Out"
})
})