const express = require('express');
const router = express.Router();

const quote_controller = require('../controllers/quote.controller');

router.post('/', quote_controller.quote_create);
router.get('/', quote_controller.quote_all);
router.get('/:id', quote_controller.quote_details);
router.put('/:id', quote_controller.quote_update);
router.delete('/:id', quote_controller.quote_delete);

module.exports = router;