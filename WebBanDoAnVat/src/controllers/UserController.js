const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
    // Lấy danh sách tất cả người dùng (chỉ Admin)
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Đăng ký
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được đăng ký!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ username, email, password: hashedPassword, role: 'customer' });
            await newUser.save();

            res.status(2000).json({ message: 'Đăng ký thành công!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Đăng nhập
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
            }

            const payload = { id: user._id, username: user.username, role: user.role };
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

            res.status(200).json({ message: 'Đăng nhập thành công', accessToken, refreshToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Làm mới token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(403).json({ message: 'Không có refresh token' });

            const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if (!verified) return res.status(403).json({ message: 'Refresh token không hợp lệ' });

            const newAccessToken = jwt.sign({ id: verified.id, username: verified.username, role: verified.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Đăng xuất
    async logout(req, res) {
        res.status(200).json({ message: 'Đăng xuất thành công' });
    }
}

module.exports = new UserController();
