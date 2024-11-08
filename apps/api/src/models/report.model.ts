import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

export enum ReportType {
  SALES = 'sales',
  EMPLOYEE_PERFORMANCE = 'employee_performance',
}

const reportSchema = new Schema({
  reportType: {
    type: String,
    enum: Object.values(ReportType),
    required: true,
  },
  outletId: {
    type: ObjectId,
    required: true,
    ref: 'Outlet',
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: Object,
    required: true,
  },
});

const Report = model('Report', reportSchema);

export default Report;
