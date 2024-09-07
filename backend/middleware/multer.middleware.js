import multer from "multer";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      const dir = path.join(__dirname, '../../public/temp');
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({
    
    storage ,
}) 