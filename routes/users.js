const router = require('express').Router();
const {
  getAllUsers,
  getUser,
  createUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
