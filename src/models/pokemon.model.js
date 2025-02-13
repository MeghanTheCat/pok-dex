const mongoose = require('mongoose');

const pkmnSchema = new mongoose.Schema({
    name: String,
    types: [String],
    description: String,
    region: [{
        regionName: String,
        regionPokedexNumber: Number
    }],
    imagePath: String,
    heigth: Number,
    weight: Number,
    soundPath: String
});

pkmnSchema.pre('save', function (next) {
    console.log('Fonction exec avant save');
    this.name = this.name[0].toUpperCase() + this.name.slice(1).toLowerCase();
    this.region.forEach(e => {
        e.regionName = e.regionName[0].toUpperCase() + e.regionName.slice(1).toLowerCase();
    });
    next();
});


const pkmnModel = mongoose.model('Pokemon', pkmnSchema);

module.exports = pkmnModel
