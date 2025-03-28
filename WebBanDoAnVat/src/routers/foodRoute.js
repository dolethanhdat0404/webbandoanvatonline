const router = require('express').Router();
const FoodController = require('../controllers/FoodController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', FoodController.getAllFoods);

router.get('/search', FoodController.searchFoods);

router.post('/', authMiddleware, adminMiddleware, FoodController.createFood);

router.put('/:id', authMiddleware, adminMiddleware, FoodController.updateFood);

router.delete('/:id', authMiddleware, adminMiddleware, FoodController.deleteFood);

module.exports = router;
