const router = require('express').Router();

const { getCurrentUser, updateUserProfile, getUsers } = require('../controllers/user');


router.get("/", getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', updateUserProfile);

module.exports = router;