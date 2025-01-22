import { Schema, type Document } from 'mongoose';


export interface OTSMachineDocument extends Document {
  machine: string;
  machineStatus: string;
  partsMade: number;
  comments?: string;
  lotNumber: number;
}


const OTSMachineSchema = new Schema<OTSMachineDocument>({
  machine: { type: String, required: true },
  machineStatus: { type: String, required: true },
  partsMade: { type: Number, required: true },
  comments: { type: String,  trim: true},
  lotNumber: {type: Number, required: true},
});

export default OTSMachineSchema;