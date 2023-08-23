const { check, validationResult } = require('express-validator');

const create = [
    check('name').isLength({ min: 1 }).withMessage('Not empty'),
    check('description').isLength({ min: 1 }).withMessage('Not empty'),
    check('type').isIn(['home', 'page']).withMessage('Not empty ex: home / page'),
    check('url').isLength({ min: 1 }).withMessage('Not empty'),
    check('image').isLength({ min: 1 }).withMessage('Not empty'),
];

module.exports = {
  create
}