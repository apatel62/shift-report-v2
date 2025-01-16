import { Schema, type Document } from 'mongoose';


export interface MachineDocument extends Document {
  machine: string;
  machineStatus: string;
  partsMade: number;
  comments?: string;
}


const machineSchema = new Schema<MachineDocument>({
  machine: { type: String, required: true },
  machineStatus: { type: String, required: true },
  partsMade: { type: Number, required: true },
  comments: { type: String,  trim: true},
});


export default machineSchema;