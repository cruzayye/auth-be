const mongoose = require('mongoose');
const { hash, compare } = require('../utils/hash');
const { tokenize, untokenize } = require('../utils/token');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true
  },
  passwordHash: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.passwordHash;
    }
  }
});

//cant use arrow because we use this method.
//the param in function(password) refers to the users pw
userSchema.virtual('password').set(function(password) {
  this._tempPassword = password;
});

userSchema.pre('save', function(next){
  hash(this._tempPassword)
    .then(hashedPassword => {
      this.passwordHash = hashedPassword;
      next();
    });
  
});

//schema method
userSchema.methods.compare = function(pw) {
  compare(pw, this.passwordHash);
};

//find by token
userSchema.statics.findByToken = function(token) {
  return untokenize(token);
};


module.exports = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);