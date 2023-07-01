const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUser,
  getCurrentUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    avatar: Joi.string().optional(),
    about: Joi.string().min(2).max(30),
  })
    .or('name', 'avatar', 'about')
    .unknown(true),
}), patchUser);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }).unknown(true),
}), patchUserAvatar);

module.exports = router;
