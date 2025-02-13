const mongoose = require('mongoose');
const pkmnModel = require('./pokemon.model');

const trainerSchema = new mongoose.Schema({
    username: String,
    imagePath: String,
    trainerName: String,
    creationDate: Date,
    pkmnSeen: [pkmnModel.schema],
    pkmnCatch: [pkmnModel.schema]
});

trainerSchema.pre('save', function (next) {
    console.log('Fonction exec avant save');
    this.trainerName = this.trainerName[0].toUpperCase() + this.trainerName.slice(1).toLowerCase();
    next();
});


const trainerModel = mongoose.model('Trainer', trainerSchema);

module.exports = trainerModel
