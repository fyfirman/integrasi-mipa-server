import path from 'path';
import multer from 'multer';

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `/../../public/uploads/${req.body.purpose}`));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.currentUser.npm}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export default diskStorage;
