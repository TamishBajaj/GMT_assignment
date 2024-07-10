const express = require('express');
const { register, login , logout} = require('../controllers/authController');
const router = express.Router();


router.route("/logout").get(logout)
router.post('/register', register);
router.post('/login', login);

module.exports = router;