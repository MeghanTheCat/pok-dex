const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authM = require('../middlewares/auth.middleware');
const permM = require('../middlewares/permission.middleware');

router.post('/', authM, permM, userController.createUser);
router.post('/admin', userController.createAdmin);
router.get('/', authM, permM, userController.getAllUsers);
router.get('/:id_or_mail', authM, permM, userController.getUserByIdOrMail);
router.put('/:id', authM, permM, userController.updateUser);
router.delete('/:id', authM, permM, userController.deleteUser);
router.post('/register', userController.register);
router.post('/login', userController.login);
module.exports = router;
