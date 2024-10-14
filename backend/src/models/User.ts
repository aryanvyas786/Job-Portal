import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {

  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public gender!: 'Male' | 'Female' | 'Other';
  public userType!: '1' | '2';
  public hobbies?: string[];
  public profileImage?: string;
  public password!: string;
  public resumeFile?: string;
  public agencyId?: number;



}

User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM('1', '2'), // 1 for Job Seeker, 2 for Agency
    allowNull: false,
  },
  hobbies: {
    type: DataTypes.JSON, // Store hobbies as an array of strings
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING, // Store the path or URL of the uploaded image
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING, // Store the path or URL of the uploaded image
    allowNull: true,
  },
  resumeFile: {
    type: DataTypes.STRING, // Path for uploaded resume file
    allowNull: true,
  },
  agencyId: {
    type: DataTypes.INTEGER, // Foreign key for selected agency
    allowNull: true,
    // autoIncrement:true,
    // unique:true
  },
}, {
  sequelize,
  modelName: 'user',
  tableName: "user"
});

export default User;
