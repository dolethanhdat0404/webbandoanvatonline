const router = require('express').Router();
const AdminOrderController = require('../controllers/AdminOrderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, adminMiddleware, AdminOrderController.getAllOrders);

router.get('/:id', authMiddleware, adminMiddleware, AdminOrderController.getOrderById);

router.put('/:id/status', authMiddleware, adminMiddleware, AdminOrderController.updateOrderStatus);

router.delete('/:id', authMiddleware, adminMiddleware, AdminOrderController.deleteOrder);

module.exports = router;
