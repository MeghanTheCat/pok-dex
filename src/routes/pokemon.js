const express = require('express');
const router = express.Router();
const pkmnController = require('../controllers/pokemon.controller');
const authM = require('../middlewares/auth.middleware');

router.get('/types', pkmnController.getTypes);
router.post('/', authM, pkmnController.addPkmn);
router.get('/all', authM, pkmnController.getPkmns);
router.get('/region/:region', authM, pkmnController.getByRegion);
router.post('/region', authM, pkmnController.addRegion);
router.put('/', authM, pkmnController.updatePokemon);
router.delete('/', authM, pkmnController.deletePkmn);
router.get('/search', authM, pkmnController.searchPokemon);
router.get('/', authM, pkmnController.getPkmn);
router.delete('/region', authM, pkmnController.deleteRegion);
module.exports = router;