import { Request, Response } from 'express';
import User from '../models/User';
import { upload } from '../middeware/multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import generatePassword from '../services/PasswordGenertor';
import { sendRegistrationEmail } from '../services/emailService';
import sequelize from '../config/db';
import { log, profile } from 'console';
const JWT_SECRET = '12345'; 




export const registerUser = async (req: any, res: any) => {
  try {
    const { firstName, lastName, email, phone, gender, hobbies, userType, agencyId } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !gender || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("typeof agencyId", typeof agencyId);

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate random password and hash it
    const password = generatePassword();  // You should have a method to generate a random password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Access files
    const filesData = req.files as {
      profileImage?: Express.Multer.File[];
      resumeFile?: Express.Multer.File[];
    };

    console.log(filesData.profileImage)
    console.log(filesData.resumeFile);

    const profileImage = userType === '1' && filesData.profileImage ? filesData.profileImage[0].filename : null;
    const resumeFile = userType === '1' && filesData.resumeFile ? filesData.resumeFile[0].filename : null;

    console.log("profileImage{{{{", profileImage);

    // Create user record
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      gender,
      userType,
      hobbies: Array.isArray(hobbies) ? hobbies : [hobbies], // Ensure hobbies is an array
      profileImage,
      password: hashedPassword,
      resumeFile,
      agencyId: userType === '1' ? agencyId : null // Set agencyId only if Job Seeker
    });

    console.log("AgencyId", user.agencyId);
  
    // Send registration email
    await sendRegistrationEmail(email, firstName, password);
  
    // Send success response
    return res.status(201).json({ message: "User Registered Successfully", user });
  } catch (error) {
    console.error("Error message", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



  export const loginUser = async (req: Request, res: any) => {
    const { email, password } = req.body;

    try {
      const user:any = await User.findOne({ where: {email} });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user.id, userType: user.userType }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      
      res.json({ message: 'Login successful', token , user});
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  };
  

export const jobSeeker = async (req: any , res:any )=>{

  // const userId = req.userType; // assuming JWT middleware adds userId to the request

  // const user:any = await User.findByPk(userId);
  // // console.log("user", user);
  // if (user.userType !== '2') {
  //   return res.status(403).json({ message: 'Unauthorized UserType' });
  // }

  // // Fetch job seekers who selected this agency
  // const jobSeekers:any = await User.findAll({
  //   where: { agencyId: user.userType, userType: '2' },
  // });

  // console.log(jobSeekers);

  // res.json(jobSeekers);
  // res.json(jobSeekers);
}

 // Adjust the path as necessary

export const dashboard = async (req: any, res: any) => {
 // try {
    // Extract the JWT from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    // Verify and decode the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string); // Make sure to set your JWT_SECRET in the environment variables

    // Extract userType from decoded token
    const userType = decoded.userType; // Assuming userType is stored in the token
    const userId = decoded.userId;
    // Fetch job seekers (userType === 1) who selected this agency
    const userList = await User.findAll({
      where: {
        userType: userType,id:userId // Job Seeker userType
      },
      attributes: ['id', 'firstName', 'lastName','gender','phone','email','usertype', 'profileImage','resumeFile'], // Fetch only necessary fields
    });


    // console.log("userList",userList);


    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const updatedUserList = userList.map(user => ({
      ...user.toJSON(),
      profileImage: user.profileImage ? `${baseUrl}${user.profileImage}` : null,  // Construct full URL for profileImage
      resumeFile: user.resumeFile ? `${baseUrl}${user.resumeFile}` : null,        // Construct full URL for resumeFile
    }));

    // console.log("updatedUserList",updatedUserList)

    // Return the result
    return res.status(200).json({ updatedUserList });
  // } catch (error) {
  //   console.error('Error fetching job seekers:', error);
  //   return res.status(500).json({ message: 'Internal server error.' });
  // }
};


export const getJobSeekers = async (req: any, res: any) => {

  try {
    const agencyId = req.user; // Assuming agencyId is stored in the logged-in user's token
    console.log(agencyId)
    console.log('Id',agencyId);
    if (!agencyId) {
      return res.status(403).json({ message: 'You must be logged in as an Agency.' });
    }

    // Find job seekers associated with this agency
    const jobSeekers = await User.findAll({
      where: {
        userType: '1', // Job Seeker type
        agencyId,
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
    });
    console.log(jobSeeker)

    return res.json(jobSeekers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getAgencyDetails = async (req: any, res: any) => {
  try {
    const jobSeekerId = req.user?.id; // Assuming user ID is stored in the token


    if (!jobSeekerId) {
      return res.status(403).json({ message: 'You must be logged in as a Job Seeker.' });
    }

    // Find the job seeker's associated agency
    const jobSeeker = await User.findOne({
      where: { id: jobSeekerId, userType: '1' }, // Ensure it's a Job Seeker
    });

    if (!jobSeeker || !jobSeeker.agencyId) {
      return res.status(404).json({ message: 'No agency associated with this job seeker.' });
    }

    const agency = await User.findOne({
      where: { id: jobSeeker.agencyId, userType: '2' }, // Ensure it's an Agency
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
    });

    return res.json(agency);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const getAgency = async (req: any, res: any) => {
  try {


    // Fetch job seekers (userType === 1) who selected this agency
    const agencies = await User.findAll({
      where: {
        userType: 2, 
      },
      attributes: ['id', 'firstName', 'lastName'], // Fetch only necessary fields
    });

    // Return the result
    return res.status(200).json({ agencies });
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

