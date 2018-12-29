const express = require('express');
const createError = require('http-errors');
const router = express.Router({ mergeParams: true });

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 */
router.post('/', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {get} /users/:userId Get User
 * @apiName GetUser
 * @apiGroup User
 */
router.get('/:userId', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {put} /users/:userId Modify User
 * @apiName ModifyUser
 * @apiGroup User
 */
router.put('/:userId', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {delete} /users/:userId Delete User
 * @apiName DeleteUser
 * @apiGroup User
 */
router.delete('/:userId', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

module.exports = router;