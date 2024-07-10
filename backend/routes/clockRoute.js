const express = require('express');
const { saveConfig, loadConfig } = require('../controllers/clock')



const router = express.Router();

router.post('/save-config', saveConfig);
router.get('/load-config/:id', loadConfig);

module.exports = router;