const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-err');
const AccessError = require('../errors/access-err');
const WrongDataError = require('../errors/wrong-data-err');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send( cards ))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send( card ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new AccessError('Вы не являетесь хозяином карточки');
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params.id)
        .then((card) => {
          res.send( card );
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Запрашиваемая карточка не найдена');
      return res.send( card );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Запрашиваемая карточка не найдена');
      return res.send( card );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
