const Cart = require('../models/cartModel');
const Food = require('../models/foodModel');

class CartController {
    // Lấy giỏ hàng của người dùng hoặc khách
    async getCart(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Vui lòng đăng nhập để xem giỏ hàng' });
            }

            let cart = await Cart.findOne({ userId: req.user.id })
                .populate('items.foodId', '_id name description price');

            if (!cart) {
                return res.status(200).json({ items: [] });
            }

            return res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy giỏ hàng", detail: error.message });
        }
    }

    // Thêm sản phẩm vào giỏ hàng
async addToCart(req, res) {
    try {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' });
        }

        const { foodId, quantity } = req.body;
        if (!foodId || quantity <= 0) {
            return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
        }

        const food = await Food.findById(foodId);
        if (!food) return res.status(404).json({ message: 'Món ăn không tồn tại' });

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ foodId, quantity });
        }

        await cart.save();
        console.log("Giỏ hàng sau khi thêm:", cart);

        res.status(200).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng' });
            }

            const { foodId } = req.params;
            let cart = await Cart.findOne({ userId: req.user.id });

            if (!cart) return res.status(404).json({ message: 'Giỏ hàng trống' });

            cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
            await cart.save();

            res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng', cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Vui lòng đăng nhập để xóa giỏ hàng' });
            }

            await Cart.findOneAndDelete({ userId: req.user.id });
            res.status(200).json({ message: 'Giỏ hàng đã được xóa hoàn toàn' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CartController();
