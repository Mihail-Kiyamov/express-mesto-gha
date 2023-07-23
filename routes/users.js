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
router.get('/me', getCurrentUser);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
    .or('name', 'avatar', 'about'),
}), patchUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-z.\-_~:/?#[\]@!$&'()*+,;=]+\.[0-9a-z.\-_~:/?#[\]@!$&'()*+,;=]+#?$/).required(),
  }),
}), patchUserAvatar);

module.exports = router;
