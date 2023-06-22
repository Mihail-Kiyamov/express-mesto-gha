const Card = require('../models/cards');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      return res.status(500).send({ message: err.message });
    });
};
