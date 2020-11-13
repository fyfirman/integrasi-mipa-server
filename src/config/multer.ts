import path from 'path';
import multer from 'multer';

const verification = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `/../../public/uploads/verification/${req.body.purpose}`));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.currentUser.npm}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const candidateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/../../public/uploads/candidate/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.number}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const diskStorage = { verification, candidateStorage };
export default diskStorage;
