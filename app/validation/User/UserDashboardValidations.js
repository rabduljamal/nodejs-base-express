const { check, validationResult } = require('express-validator');

const create = [
    check('username').isLength({ min: 1 }).withMessage('Not empty'),
    check('email').isLength({ min: 1 }).withMessage('Not empty'),
    check('first_name').isLength({ min: 1 }).withMessage('Not empty'),
    check('last_name').isLength({ min: 1 }).withMessage('Not empty'),
    check('phone').isLength({ min: 1 }).withMessage('Not empty'),
    check('type').isIn(['internal', 'external']).withMessage('Not empty ex: internal / external'),
    check('status').isIn(['active', 'inactive']).withMessage('Not empty ex: active / inactive'),
];

module.exports = {
  create
}