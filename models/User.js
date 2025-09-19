const moongoose = require('mongoose');
const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
}