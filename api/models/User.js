const { Schema, model } = require('mongoose');
const bcryptService = require('../services/bcrypt.service');

const schema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
      required: true
    },
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

schema.pre('save', async function(next) {
  try {
    this.password = await bcryptService().hashPassword(this);
    next();
  } catch (err) {
    next(err);
  }
});

schema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = model('user', schema);
