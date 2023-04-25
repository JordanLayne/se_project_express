const router = require('express').Router();
const { getCurrentUser, updateUserProfile } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUserProfile);

module.exports = router;