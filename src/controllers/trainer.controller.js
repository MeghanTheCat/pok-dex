const TrainerService = require('../services/trainer.service');
const trainerService = new TrainerService();

const UserService = require('../services/user.service');
const userService = new UserService();

exports.getTrainers = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const trainers = await trainerService.getTrainers();
    const count = trainers.length;
    return res.status(200).json({
        data: trainers,
        count: count
    });
}

exports.getTrainer = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const id = req.query.id;
    if (id) {
        const trainer = await trainerService.getTrainer(id);
        return res.status(200).json({
            data: trainer
        });
    } else {
        return res.status(400).json({
            error: 'Vous devez spécifier un identifiant de dresseur'
        });
    }
}

exports.getTrainerByUsername = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const username = req.query.username;
    if (username) {
        const trainer = await trainerService.getTrainerByUsername(username);
        return res.status(200).json({
            data: trainer
        });
    } else {
        return res.status(400).json({
            error: 'Vous devez spécifier un nom d\'utilisateur de dresseur'
        });
    }
}

exports.addTrainer = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const trainer = req.body;
    const result = await trainerService.addTrainer(trainer);
    return res.status(200).json({
        data: result
    });
}

exports.updateTrainer = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role !== 'admin') {
        return res.status(403).json({
            error: 'Vous n\'avez pas les permissions pour accéder à cette ressource'
        });
    }
    const id = req.params.id;
    const trainer = req.body;
    if (id) {
        const result = await trainerService.updateTrainer(id, trainer);
        return res.status(200).json({
            data: result
        });
    } else {
        return res.status(400).json({
            error: 'Vous devez spécifier un identifiant de dresseur'
        });
    }
}

exports.deleteTrainer = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role !== 'admin') {
        return res.status(403).json({
            error: 'Vous n\'avez pas les permissions pour accéder à cette ressource'
        });
    }
    const id = req.params.id;
    if (id) {
        const result = await trainerService.deleteTrainer(id);
        return res.status(200).json({
            data: result
        });
    } else {
        return res.status(400).json({
            error: 'Vous devez spécifier un identifiant de dresseur'
        });
    }
}

exports.catchPkmn = async (req, res) => {
    const result = await trainerService.catchPokemon(req.body.trainerId, req.body.pokemonId);
    return res.status(200).json({
        data: result
    });
}

exports.seePkmn = async (req, res) => {
    const result = await trainerService.seePokemon(req.body.trainerId, req.body.pokemonId);
    return res.status(200).json({
        data: result
    });
}

async function getRole(userId) {
    return await userService.getRole(userId);
}