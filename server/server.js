import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import profile from './routes/profile.js';
import applications from './routes/applications.js';
import notifications from './routes/notifications.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/applications', applications);
app.use('/api/notifications', notifications);

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT, () => console.log(`StarPlot API on ${process.env.PORT}`));