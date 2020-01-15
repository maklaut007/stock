const express = require('express');
const router = express.Router();
const multer = require('multer');




const checkAuth = require('../middleware/check-auth');

const Item = require('../controllers/item');
const User = require('../controllers/user');
const Image = require('../controllers/upload-image');

router.post('/login', User.user_login);
router.post('/register', User.user_registration);
router.get('/me',checkAuth, User.get_curent_user_information);
router.get('/user-items/:id', User.get_user_items);

router.get('/items', Item.get_all_items);
router.get('/items/:id', Item.get_one_item);
router.post('/items', checkAuth, Item.create_item);
router.put('/items/:id',checkAuth, Item.update_item);
router.delete('/items/:id', checkAuth, Item.delete_item);
router.post('/items/:id/images',checkAuth, Image.imageUpload );



module.exports = router;
