const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../middlewares/validateRegister');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
