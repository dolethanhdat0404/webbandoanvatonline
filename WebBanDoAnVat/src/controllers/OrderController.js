const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Food = require('../models/foodModel');
const mongoose = require('mongoose');

class OrderController {
    async checkout(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Vui lòng đăng nhập để thanh toán' });
            }

            let cart = await Cart.findOne({ userId: req.user.id })
                .populate('items.foodId');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Giỏ hàng trống, không thể thanh toán' });
            }

            let totalPrice = 0;
            const orderItems = [];

            // Kiểm tra và cập nhật số lượng tồn kho
            for (let item of cart.items) {
                const food = await Food.findById(item.foodId._id);
                
                if (!food) {
                    return res.status(400).json({ message: `Sản phẩm không tồn tại trong hệ thống` });
                }

                if (typeof food.stock !== 'number' || isNaN(food.stock)) {
                    return res.status(400).json({ 
                        message: `Lỗi dữ liệu: Số lượng tồn kho không hợp lệ cho ${food.name}` 
                    });
                }

                if (food.stock < item.quantity) {
                    return res.status(400).json({ 
                        message: `Sản phẩm ${food.name} chỉ còn ${food.stock} trong kho` 
                    });
                }

                // Cập nhật số lượng tồn kho
                food.stock = food.stock - item.quantity;
                await food.save();

                orderItems.push({
                    foodId: food._id,
                    quantity: item.quantity,
                    price: food.price
                });

                totalPrice += food.price * item.quantity;
            }

            // Tạo đơn hàng mới
            const order = new Order({
                userId: req.user.id,
                items: orderItems,
                totalPrice,
                status: 'pending'
            });

            await order.save();
            await Cart.findOneAndDelete({ userId: req.user.id });
            
            res.status(200).json({ 
                message: 'Thanh toán thành công', 
                order 
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserOrders(req, res) {
        try {
            const orders = await Order.find({ userId: req.user.id }).populate('items.foodId');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new OrderController();