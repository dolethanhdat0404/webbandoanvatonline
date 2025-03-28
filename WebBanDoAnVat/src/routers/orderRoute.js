const router = require('express').Router();
const OrderController = require('../controllers/OrderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/checkout', authMiddleware, OrderController.checkout);

router.get('/', authMiddleware, OrderController.getUserOrders);

module.exports = router;
