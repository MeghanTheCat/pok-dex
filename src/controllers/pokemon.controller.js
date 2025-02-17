const PkmnService = require('../services/pokemon.service');
const pkmnService = new PkmnService();
const UserService = require('../services/user.service');
const userService = new UserService();

exports.getTypes = (req, res) => {
    const types = pkmnService.getTypes();
    const count = types.length;
    return res.status(200).json({
        data: types,
        count: count
    });
}

exports.getPkmns = async (req, res) => {
    const pokemons = await pkmnService.getPkmns();
    const count = pokemons.length;
    return res.status(200).json({
        data: pokemons,
        count: count
    });
}

exports.getPkmn = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const name = req.query.name;
    const id = req.query.id;
    if (name) {
        const pokemon = await pkmnService.getPkmnByName(name);
        return res.status(200).json({
            data: pokemon
        });
    } else if (id) {
        const pokemon = await pkmnService.getPkmnById(id);
        return res.status(200).json({
            data: pokemon
        });
    } else {
        return res.status(400).json({
            error: "Vous devez spécifier un nom ou un identifiant"
        });
    }
}

exports.getByRegion = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const pokemons = await pkmnService.getByRegion(req.params.region);
    const count = pokemons.length;
    return res.status(200).json({
        data: pokemons,
        count: count
    });
}

exports.searchPokemon = async (req, res) => {
    const partialName = req.query.partialName;
    const typeOne = req.query.typeOne;
    const typeTwo = req.query.typeTwo;
    const page = req.query.page;
    const size = req.query.size;
    const pokemons = await pkmnService.searchPokemon(partialName, typeOne, typeTwo, page, size);
    const count = pokemons.length;
    return res.status(200).json({
        data: pokemons,
        count: count
    });
}

exports.addPkmn = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    const { globalId, name, types, description, region, imagePath, heigth, weight, soundPath } = req.body;
    const result = await pkmnService.addPkmn(globalId, name, types, description, region, imagePath, heigth, weight, soundPath);
    return res.status(200).json({
        data: result
    });
}

exports.updatePokemon = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role != "admin") {
        return res.status(403).json({
            error: "Vous devez être administrateur"
        });
    }
    const { name, types, description, region, imagePath, heigth, weight, soundPath, typeOne, typeTwo } = req.query;
    if (!req.query.id) {
        return res.status(400).json({
            error: "Vous devez spéricier un identifiant"
        });
    }
    const result = await pkmnService.updatePkmn(req.query.id, name, types, description, region, imagePath, heigth, weight, soundPath, typeOne, typeTwo);
    return res.status(200).json({
        data: result
    });
}

exports.deletePkmn = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role != "admin") {
        return res.status(403).json({
            error: "Vous devez être administrateur"
        });
    }
    const result = await pkmnService.deletePkmn(req.query.id);
    return res.status(200).json({
        data: result
    });
}

exports.addRegion = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role != "admin") {
        return res.status(403).json({
            error: "Vous devez être administrateur"
        });
    }
    const region = req.body;
    const result = await pkmnService.addRegion(req.query.id, region);
    return res.status(200).json({
        data: result
    });
}

exports.deleteRegion = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role != "admin") {
        return res.status(403).json({
            error: "Vous devez être administrateur"
        });
    }
    const region = req.body;
    const result = await pkmnService.deleteRegion(req.query.id, req.query.regionName);
    return res.status(200).json({
        data: result
    });
}

async function getRole(userId) {
    return await userService.getRole(userId);
}