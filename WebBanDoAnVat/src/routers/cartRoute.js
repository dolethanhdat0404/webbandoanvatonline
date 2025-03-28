const router = require('express').Router();
const CartController = require('../controllers/CartController');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/',authMiddleware, CartController.getCart);

router.post('/add', authMiddleware, CartController.addToCart);

router.delete('/remove/:foodId',authMiddleware, CartController.removeFromCart);

router.delete('/clear', authMiddleware,CartController.clearCart);

module.exports = router;
