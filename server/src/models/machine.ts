import { Schema, type Document } from 'mongoose';

//Defines the Machine document which is a sub-document of the Report model
export interface MachineDocument extends Document {
  machine: string;
  machineStatus: string;
  partsMade: number;
  comments?: string;
}

//Defines the schema for Machine that defines the structure of the Machine document
const machineSchema = new Schema<MachineDocument>({
  machine: { type: String, required: true },
  machineStatus: { type: String, required: true },
  partsMade: { type: Number, required: true },
  comments: { type: String,  trim: true},
});


export default machineSchema;