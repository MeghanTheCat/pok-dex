const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const userService = new UserService();

exports.createUser = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (await !isAdmin(req.auth.userId)) {
        return res.status(403).json({ error: 'You are not allowed to create a user' });
    }
    const { username, firstname, lastname, role, email, password } = req.body;
    const result = await userService.createUser(username, firstname, lastname, role, email, password);
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(201).json(result);
}

exports.createAdmin = async (req, res) => {
    // if (req.auth.role != "admin") {
    //     return res.status(403).json({ error: 'You are not allowed to create an admin' });
    // }
    const { username, firstname, lastname, email, password } = req.body;
    const result = await userService.createUser(username, firstname, lastname, 'admin', email, password);
    console.log(result);
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(201).json(result);
}

exports.getAllUsers = async (req, res) => {
    req.auth.role = await getRole(req.auth.userId);
    if (req.auth.role != "admin") {
        return res.status(403).json({ error: 'You are not allowed to get all users' });
    }
    const result = await userService.getAllUsers();
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}

exports.getUserByIdOrMail = async (req, res) => {
    const id_or_mail = req.params.id_or_mail;
    let result;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id_or_mail)) {
        result = await userService.getUserByMail(id_or_mail);
    } else {
        result = await userService.getUserById(id_or_mail);
    }
    if (result.error) {
        return res.status(500).json(result);
    }
    req.auth.role = await getRole(req.auth.userId);
    if (result._id !== req.auth.userId && req.auth.role != "admin") {
        //Ne pas envoyer les données sensibles
        return res.status(200).json({
            'firstname': result.firstname,
            'lastname': result.lastname,
        });
    }
    return res.status(200).json(result);
}

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    req.auth.role = await getRole(req.auth.userId);
    if (id !== req.auth.userId && req.auth.role != "admin") {
        return res.status(403).json({ error: 'You are not allowed to update this user' });
    }
    const { username, firstname, lastname, role, email, password } = req.body;
    const result = await userService.updateUser(id, username, firstname, lastname, role, email, password);
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    req.auth.role = await getRole(req.auth.userId);
    if (id !== req.auth.userId && req.auth.role != "admin") {
        return res.status(403).json({ error: 'You are not allowed to delete this user' });
    }
    const result = await userService.deleteUser(id);
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}

exports.register = async (req, res) => {
    const { username, firstname, lastname, email, password } = req.body;
    const result = await userService.createUser(username, firstname, lastname, 'user', email, password);
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(201).json(result);
}

exports.login = async (req,res)=> {
    const result = await userService.login(req.body.email, req.body.password)
    console.log(result);
    if (result.error) {
        return res.status(400).send(result);
    }
    return res.status(200).send({
        message: result.message,
        userId: result.userId,
        token: jwt.sign(
            { userId: result.userId },
            process.env.TOKEN_SECRET,
            { expiresIn: '4h' }
        )
    });
}

async function getRole(userId) {
    return await userService.getRole(userId);
}