const router = require('express').Router();
const { getAllCards, deleteCard, createCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getAllCards);
router.delete('/:id', deleteCard);
router.post('/', createCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;