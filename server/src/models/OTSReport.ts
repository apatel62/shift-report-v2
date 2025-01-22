import { Schema, model, type Document } from 'mongoose';
import OTSMachineSchema from './OTSMachine';
import type { OTSMachineDocument } from './OTSMachine';


export interface OTSReportDocument extends Document {
  _id: Schema.Types.ObjectId;
  shiftNumber: string;
  date: Date;
  assignedUserId: string;                    //assignedUserId of supervisor approving report to OTS
  savedMachines: OTSMachineDocument[];
}


// Define the schema for the OTS Report
const OTSReportSchema = new Schema<OTSReportDocument>({
    shiftNumber: { type: String, required: true },   
    date: { type: Date, required: true },              
    assignedUserId: { type: String, required: true },  
    savedMachines: [OTSMachineSchema],
  });



  const OTSReport = model<OTSReportDocument>('OTSReport', OTSReportSchema);
  
  export default OTSReport;