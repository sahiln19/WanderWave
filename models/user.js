let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
