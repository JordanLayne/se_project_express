const router = require('express').Router();

const { getCurrentUser, updateUserProfile, getUsers } = require('../controllers/user');

const auth = require('../middlewares/auth');

router.get("/", getUsers);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUserProfile);

module.exports = router;