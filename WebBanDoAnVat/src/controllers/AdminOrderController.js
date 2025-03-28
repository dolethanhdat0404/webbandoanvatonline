const Order = require('../models/orderModel');

class AdminOrderController {
    // Lấy danh sách tất cả đơn hàng
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find()
                .populate('userId', 'username email')
                .populate('items.foodId', 'name price');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xem chi tiết một đơn hàng
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findById(id)
                .populate('userId', 'username email')
                .populate('items.foodId', 'name price');
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['pending', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
            }
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            )
            .populate('userId', 'username email')
            .populate('items.foodId', 'name price');
            if (!updatedOrder) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            res.status(200).json({
                message: 'Cập nhật trạng thái thành công',
                updatedOrder
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    

    // Xóa đơn hàng
    async deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            if (order.status === 'completed') {
                return res.status(400).json({ message: 'Không thể xóa đơn hàng đã hoàn thành' });
            }
            await Order.findByIdAndDelete(id);
            res.status(200).json({ message: 'Xóa đơn hàng thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }        
}

module.exports = new AdminOrderController();
