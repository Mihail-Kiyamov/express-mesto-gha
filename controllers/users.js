const User = require('../models/users');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .populate('user')
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'DocumentNotFoundError') return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные создания профиля пользователя' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные обновления профиля пользовател' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(avatar);

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные обновления аватара пользователя' });
      return res.status(500).send({ message: err.name });
    });
};