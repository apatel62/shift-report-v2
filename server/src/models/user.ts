import { Schema, model, type Document } from 'mongoose';
import bcrypt from "bcrypt";

//Defines the User document
export interface UserDocument extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  role: string;
  savedReports: Schema.Types.ObjectId[];          //if user created report, then its id will be stored in savedReports array
  savedOTSReports: Schema.Types.ObjectId[];      //if user supervisor, then approved OTS reports' id will be listed here
  isCorrectPassword(password: string): Promise<boolean>;
}

// Define the schema for the User
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    savedReports: [{
      type: Schema.Types.ObjectId,
      ref: 'Report',
    }],
    savedOTSReports: [{
      type: Schema.Types.ObjectId,
      ref: 'OTSReport',
    }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

//hash user password before storing it in MongoDB
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

//Method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

//Creates the User model/collection in MongoDB
const User = model<UserDocument>('User', userSchema);

export default User;

