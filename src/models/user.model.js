const mongoose = require('mongoose');

let validateEmail = function(email){
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

let validateLastname = function(lastname){
    let re = /^[A-Za-z]{2,40}$/;
    return re.test(lastname);
}

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: {
        type: String,
        required: true,
        validate: [validateLastname, 'Invalid lastname']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Invalid email']
    },
    role: String,
    password: String
});

userSchema.pre('save', function(next) {
    console.log('Fonction exec avant save');
    if (this.firstname[0] !== this.firstname[0].toUpperCase()) {
        this.firstname = this.firstname[0].toUpperCase() + this.firstname.slice(1);
    }
    this.lastname = this.lastname.toUpperCase();
    next();
});


const userModel = mongoose.model('Users', userSchema);

module.exports = userModel
