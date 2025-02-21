class TrainerService {
    constructor() {
        this.trainerModel = require('../models/trainer.model');
        const PkmnService = require('../services/pokemon.service');
        this.pkmnService = new PkmnService;
    }

    async addTrainer(trainer) {
        let result;
        console.log(trainer);
        try {
            result = await this.trainerModel.create(trainer);
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async getTrainers() {
        let result;
        try {
            result = await this.trainerModel.find({});
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async getTrainer(id) {
        let result;
        try {
            result = await this.trainerModel.findById(id);
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async getTrainerByUsername(username) {
        let result;
        try {
            result = await this.trainerModel.findOne({ username: username });
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async updateTrainer(id, trainer) {
        let result;
        try {
            result = await this.trainerModel.findByIdAndUpdate(id, trainer);
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async deleteTrainer(id) {
        let result;
        try {
            result = await this.trainerModel.findByIdAndDelete(id);
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async catchPokemon(id, idPokemon) {
        let result;
        try {
            const pokemon = await this.pkmnService.getPkmnById(idPokemon);
            const trainer = await this.getTrainer(id);
            trainer.pkmnCatch.forEach(p => {
                if (p.name == pokemon.name) {
                    throw new Error("Ce dresseur à déjà capturer ce pokémon !");
                }
            });
            let seen = false;
            trainer.pkmnSeen.forEach(p => {
                if (p.name == pokemon.name) {
                    seen = true
                }
            })
            if (!seen) {
                await this.seePokemon(id, idPokemon);
            }
            result = await this.trainerModel.findByIdAndUpdate(id, { $push: { pkmnCatch: pokemon } });
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }

    async seePokemon(id, idPokemon) {
        let result;
        try {
            const pokemon = await this.pkmnService.getPkmnById(idPokemon);
            const trainer = await this.getTrainer(id);
            trainer.pkmnSeen.forEach(p => {
                if (p.name == pokemon.name) {
                    throw new Error("Ce dresseur à déjà vu ce pokémon !");
                }
            });
            result = await this.trainerModel.findByIdAndUpdate(id, { $push: { pkmnSeen: pokemon } });
        } catch (error) {
            result = { error: error.message };
        }
        return result;
    }
}

module.exports = TrainerService;