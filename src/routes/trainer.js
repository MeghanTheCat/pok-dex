const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const authM = require('../middlewares/auth.middleware');

router.get('/', authM, trainerController.getTrainers);
router.post('/', authM, trainerController.addTrainer);
router.get('/search', authM, trainerController.getTrainerByUsername);
router.get('/:id', authM, trainerController.getTrainer);
router.put('/:id', authM, trainerController.updateTrainer);
router.delete('/:id', authM, trainerController.deleteTrainer);

router.post('/mark', authM, trainerController.catchPkmn);
router.post('/see', authM, trainerController.seePkmn);

module.exports = router;