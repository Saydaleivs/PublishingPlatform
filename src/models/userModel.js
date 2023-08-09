import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Please provide your full name'] },
  address: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default:
      process.env.PICS_URL +
      '8d721e18f6754c9732c30c4f66a3bee2illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please provide a username'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  // forgotPasswordToken: String,
  // forgotPasswordTokenExpiry: Date,
})

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User
