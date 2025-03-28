const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.post('/logout', authMiddleware, UserController.logout);

router.get('/users', authMiddleware, adminMiddleware, UserController.getAllUsers);

module.exports = router;
