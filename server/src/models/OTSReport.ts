import { Schema, model, type Document } from 'mongoose';
import OTSMachineSchema from './OTSMachine.js';
import type { OTSMachineDocument } from './OTSMachine';


//Defines the OTSReport document
export interface OTSReportDocument extends Document {
  _id: Schema.Types.ObjectId;
  shiftNumber: string;
  date: Date;
  assignedUserId: string;                    //assignedUserId of supervisor approving report to OTS
  savedMachines: OTSMachineDocument[];       //savedMachines are of type OTSMachineDocument
}  


//Defines the schema for the OTS Report
const OTSReportSchema = new Schema<OTSReportDocument>({
    shiftNumber: { type: String, required: true },   
    date: { type: Date, required: true },              
    assignedUserId: { type: String, required: true },  
    savedMachines: [OTSMachineSchema],
  });


//Creates the OTSReport model/collection in MongoDB
  const OTSReport = model<OTSReportDocument>('OTSReport', OTSReportSchema);
  
  export default OTSReport;