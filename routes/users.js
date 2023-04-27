const router = require('express').Router();

const { getCurrentUser, updateUser, getUsers } = require('../controllers/user');


router.get("/", getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser);

module.exports = router;