import { Schema, type Document } from 'mongoose';

//Defines the OTSMachine document which is a sub-document of the OTSReport model
export interface OTSMachineDocument extends Document {
  machine: string;
  machineStatus: string;
  partsMade: number;
  comments?: string;
  lotNumber: number;         //lotNumber is the key difference between OTSMachine & Machine documents as supervisors will be entering this info
}

//Defines the schema for OTSMachine that defines the structure of the OTSMachine document
const OTSMachineSchema = new Schema<OTSMachineDocument>({
  machine: { type: String, required: true },
  machineStatus: { type: String, required: true },
  partsMade: { type: Number, required: true },
  comments: { type: String,  trim: true},
  lotNumber: {type: Number, required: true},
});

export default OTSMachineSchema;