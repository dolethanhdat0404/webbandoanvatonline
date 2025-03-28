const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser'); 
const path = require('path');

const morgan = require('morgan');

// Load biến môi trường từ file `.env`
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình view engine
app.set('view engine', 'pug');
app.set('views', './src/views');

// Sử dụng middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(express.json());

// Kết nối MongoDB
const connectDB = require('./src/utils/connectDB');
connectDB();

app.use('/user', require('./src/routers/userRoute'));
app.use('/foods', require('./src/routers/foodRoute'));
app.use('/cart', require('./src/routers/cartRoute'));
app.use('/orders', require('./src/routers/orderRoute'));
app.use('/admin/orders', require('./src/routers/adminOrderRoute'));

// Route mặc định
app.get('/', (req, res) => {
    res.render('index.pug');
});

// Middleware xử lý lỗi 404
app.use((req, res, next) => {
    console.log('404 middleware hit');
    res.status(404).render('error404');
});

// Lắng nghe cổng
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
