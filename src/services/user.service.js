const bcrypt = require('bcrypt');

class userService {
    constructor() {
        this.userModel = require('../models/user.model');
    }

    async getUserById(id) {
        let result;
        try {
            result = this.userModel.findById(id)
        } catch (error) {
            result = { error: error }
        }
        return result;
    }

    async getUserByMail(email) {
        let result;
        try {
            result = await this.userModel.findOne({ email: email });
        } catch (error) {
            result = { error: error };
        }
        return result;
    }

    async getRole(id) {
        let result;
        try {
            result = await this.userModel.findById(id);
            result = result.role;
        } catch (error) {
            result = { error: error };
        }
        return result;
    }

    async updateUser(id, username = null, firstname = null, lastname = null, role = null, email = null, password = null) {
        let user = {};
        if (username) user.username = username;
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hashSync(password, 10);
        if (role) user.role = role;

        try {
            let result = await this.userModel.findByIdAndUpdate(id, user);
            return result;
        } catch (e) {
            return { error: e };
        }
    }

    async deleteUser(id) {
        try {
            const result = this.userModel.findByIdAndDelete(id);
            return result;
        } catch (e) {
            return { error: e };
        }
    }

    async createUser(username, firstname, lastname, role, email, password) {
        const hashedPassword = await bcrypt.hashSync(password, 10);
        try {
            const result = await this.userModel.create
            ({ 
                username: username,
                firstname: firstname, 
                lastname: lastname, 
                role: role,
                email: email, 
                password: hashedPassword 
            });
            return result;
        } catch (e) {
            return { error: e };
        }
    }

    async login(email, password) {
        const user = await this.getUserByMail(email);
        if (!user || user.error) {
            return { error: 'Utilisateur non trouvé' };
        }
        if (bcrypt.compareSync(password, user.password)) {
            return { 
                message: 'Connexion réussie',
                userId: user._id
            };
        }
        return { error: 'Mot de passe incorrect' };
    }

    async getAllUsers() {
        let result;
        try {
            result = await this.userModel.find({});
        } catch (error) {
            result = { error: error };
        }
        return result;
    }
}

module.exports = userService;