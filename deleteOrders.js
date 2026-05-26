import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PipelineOrder from './backend/models/PipelineOrder.js';

dotenv.config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const res = await PipelineOrder.deleteMany({});
    console.log('Deleted PipelineOrders:', res.deletedCount);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
