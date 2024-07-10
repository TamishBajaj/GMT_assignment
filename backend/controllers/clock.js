const Config=require('../models/ClockConfig')


exports.saveConfig = async (req, res) => {
    try {
      const { speed, timestamp } = req.body;
      const config = new Config({ speed, timestamp });
      await config.save();
      res.json(config._id);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.loadConfig = async (req, res) => {
    try {
      const config = await Config.findById(req.params.id);
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  