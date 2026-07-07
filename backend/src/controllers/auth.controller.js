const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.register(
            email,
            password
        );

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    register
};