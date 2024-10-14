import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only certain types of files
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === 'profileImage') {
    // Only allow PNG and JPEG for profile images
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG images are allowed'), false);
    }
  } else if (file.fieldname === 'resume') {
    // Only allow PDF and DOCX for resumes
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed for resumes'), false);
    }
  } else {
    cb(null, true);
  }
};


  export const upload = multer({ storage: storage , fileFilter: fileFilter,}).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 },
  ]);

  

// console.log(upload);

