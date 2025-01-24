import { Schema, model, type Document } from 'mongoose';
import machineSchema from './machine.js';
import type { MachineDocument } from './machine.js';

//Defines the Report document
export interface ReportDocument extends Document {
  _id: Schema.Types.ObjectId;
  shiftNumber: string;
  date: Date;
  assignedUserId: string;
  savedMachines: MachineDocument[];    //savedMachines are of MachineDocument type
}

// Define the schema for the Report
const reportSchema = new Schema<ReportDocument>({
  shiftNumber: { type: String, required: true },   
  date: { type: Date, required: true },              
  assignedUserId: { type: String, required: true },  
  savedMachines: [machineSchema],
});

//Creates the Report model/collection in MongoDB
const Report = model<ReportDocument>('Report', reportSchema);

export default Report;
