const Food = require('../models/foodModel');

class FoodController {
    // Lấy danh sách sản phẩm (Trả về đầy đủ dữ liệu)
    async getAllFoods(req, res) {
        try {
            const foods = await Food.find();
            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Thêm sản phẩm (Chỉ Admin)
    async createFood(req, res) {
        try {
            const { name, price, description, category, stock, imageUrl } = req.body;
    
            if (!name || !price || !stock || !category) {
                return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc: name, price, stock, category" });
            }
    
            const existingFood = await Food.findOne({ name: name });
    
            if (existingFood) {
                return res.status(400).json({ error: "Sản phẩm đã tồn tại!" });
            }
    
            const food = new Food({
                name,
                price,
                description,
                category,
                stock,
                imageUrl: imageUrl || ""
            });
    
            await food.save();
            res.status(2000).json({ message: "Sản phẩm đã được thêm thành công!", food });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    
    

    // Cập nhật sản phẩm (Chỉ Admin)
    async updateFood(req, res) {
        try {
            const { id } = req.params;
            const updatedFood = await Food.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedFood) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            res.status(200).json(updatedFood);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xóa sản phẩm (Chỉ Admin)
    async deleteFood(req, res) {
        try {
            const { id } = req.params;
            const deletedFood = await Food.findByIdAndDelete(id);
            if (!deletedFood) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
            res.status(200).json({ message: 'Sản phẩm đã bị xóa' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Tìm kiếm sản phẩm
    async searchFoods(req, res) {
        try {
            const { keyword } = req.query;
            const query = {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                ]
            };

            const foods = await Food.find(query);
            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new FoodController();
