const mongoose = require('mongoose');
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['guest','user', 'admin', 'moderator'],
    default: 'guest'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    name: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 300
    },
    avatarUrl: {
      type: String,
      default: 'https://default-avatar-url.com'
    },
    batch:{
      type: String,
    },
    roll: {
      type: Number,
    },
    department: {
      type: String, 
    },
    cpc_id:{
      type: String
    },
    contact:{
      type: Number
    }
  },
  payment:{
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid'
    },
    transactionId: {
      type: String,
    }
  }

});



userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
