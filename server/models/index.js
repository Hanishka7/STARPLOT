import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const User = model('User', new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}, { timestamps: true }));

export const Profile = model('Profile', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  fullName: String, phone: String, address: String, education: String, skills: String,
  aadhaar: String, pan: String, passport: String, voterId: String, // encrypted
  links: { github: String, linkedin: String, leetcode: String, hackerrank: String, portfolio: String },
  resumePath: String, photoPath: String, idImagePath: String,
}, { timestamps: true }));

export const Application = model('Application', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  jobUrl: String,
  status: { type: String, enum: ['pending', 'submitted', 'needs_human', 'failed'], default: 'pending' },
  note: String,
}, { timestamps: true }));

export const Notification = model('Notification', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
}, { timestamps: true }));