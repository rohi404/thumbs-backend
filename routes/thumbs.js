const express = require('express');
const createError = require('http-errors');
const router = express.Router({ mergeParams: true });

/**
 * @api {post} /thumbs Create Thumb
 * @apiName CreateThumb
 * @apiGroup Thumb
 */
router.post('/', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {get} /thumbs Get Thumb List
 * @apiName listThumb
 * @apiGroup Thumb
 */
router.get('/', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {get} /thumbs/:thumbId Get Thumb
 * @apiName getThumb
 * @apiGroup Thumb
 */
router.get('/:thumbId', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {put} /thumbs/:thumbId Modify Thumb
 * @apiName modifyThumb
 * @apiGroup Thumb
 */
router.put('/:thumbId', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {delete} /thumbs/:thumbId Delete Thumb
 * @apiName deleteThumb
 * @apiGroup Thumb
 */
router.delete('/:thumbId', function (req, res, next) {
    next(createError(500, 'Not Yet Implemented'));
});

module.exports = router;