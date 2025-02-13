class pokemonService {
    constructor() {
        this.pkmnTypes = require('../models/pokemontype.model');
        this.pkmnModel = require('../models/pokemon.model');
    }

    getTypes() {
        return this.pkmnTypes
    }

    async getPkmns() {
        let result;
        try {
            result = await this.pkmnModel.find({});
        } catch (error) {
            result = { error: error };
        }
        return result;
    }

    async getPkmnById(id) {
        let result;
        try {
            result = await this.pkmnModel.findById(id)
        } catch (error) {
            result = { error: error }
        }
        return result;
    }

    async getPkmnByName(name) {
        let result;
        name = name[0].toUpperCase() + name.slice(1).toLowerCase();
        try {
            result = await this.pkmnModel.findOne({ name: name });
        } catch (error) {
            result = { error: error }
        }
        return result;
    }

    async getByType(type) {
        let result;
        try {
            result = await this.pkmnModel.find({ types: { $in: [type] } });
        } catch (error) {
            result = { error: error }
        }
    }

    async getByRegion(region) {
        let result;
        try {
            result = await this.pkmnModel.find({ region: { $elemMatch: { regionName: region } } });
        } catch (error) {
            result = { error: error }
        }
    }

    async searchPokemon(partialName, typeOne, typeTwo, page, size) {
        let query = {};
        if (partialName) {
            query.name = { $regex: partialName, $options: 'i' };
        }
        if (typeOne || typeTwo) {
            query.types = { $all: [] };
            if (typeOne) query.types.$all.push(typeOne);
            if (typeTwo) query.types.$all.push(typeTwo);
        }
        if (!page) page = 1;
        if (!size) size = 20;
        let result;
        try {
            result = await this.pkmnModel.find(query)
                .skip((page - 1) * size)
                .limit(size);
        } catch (error) {
            result = { error: error }
            console.log(error);
        }
        return result;
    }

    async addPkmn(name, types, description, region, imagePath, heigth, weight, soundPath) {
        try {
            const result = await this.pkmnModel.create({
                name: name,
                types: types,
                description: description,
                region: region,
                imagePath: imagePath,
                heigth: heigth,
                weight: weight,
                soundPath: soundPath
            });
            return result;
        } catch (error) {
            console.log(error)
            return { error: error }
        }
    }

    async updatePkmn(id, name = null, types = null, description = null, region = null, imagePath = null, heigth = null, weight = null, soundPath = null, typeOne = null, typeTwo = null) {
        let pkmn = {};
        if (name) pkmn.name = name;
        if (types) pkmn.types = types;
        if (description) pkmn.description = description;
        if (region) pkmn.region = region;
        if (imagePath) pkmn.imagePath = imagePath;
        if (heigth) pkmn.heigth = heigth;
        if (weight) pkmn.weight = weight;
        if (soundPath) pkmn.soundPath = soundPath;
        if (typeOne) {
            pkmn.types = [typeOne];
        }
        if (typeTwo) {
            if (!pkmn.types) {
                pkmn.types = [typeTwo];
            } else {
            pkmn.types.push(typeTwo);
            }
        }
        try {
            let result = await this.pkmnModel.findByIdAndUpdate(id, pkmn);
            return result;
        } catch (error) {
            return { error: error }
        }
    }

    async addRegion(id, region) {
        let result;
        try {
            result = this.pkmnModel.findByIdAndUpdate(id, { $push: { region: region } })
        } catch (error) {
            return { error: error }
        }
        return result;
    }

    async deleteRegion(id, regionName) {
        let result;
        try {
            result = this.pkmnModel.findByIdAndUpdate(id, { $pull: { region: { regionName: regionName } } })
        } catch (error) {
            return { error: error }
        }
        return result;
    }

    async deletePkmn(id) {
        try {
            const result = this.pkmnModel.findByIdAndDelete(id);
            return result;
        } catch (e) {
            return { error: e };
        }
    }
}

module.exports = pokemonService;