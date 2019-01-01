import createError from 'http-errors';
import { Router, Request, Response } from 'express';
const router = Router({ mergeParams: true });

/**
 * @api {post} /thumbs Create Thumb
 * @apiName CreateThumb
 * @apiGroup Thumb
 */
router.post('/', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {get} /thumbs Get Thumb List
 * @apiName listThumb
 * @apiGroup Thumb
 */
router.get('/', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {get} /thumbs/:thumbId Get Thumb
 * @apiName getThumb
 * @apiGroup Thumb
 */
router.get('/:thumbId', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {put} /thumbs/:thumbId Modify Thumb
 * @apiName modifyThumb
 * @apiGroup Thumb
 */
router.put('/:thumbId', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {delete} /thumbs/:thumbId Delete Thumb
 * @apiName deleteThumb
 * @apiGroup Thumb
 */
router.delete('/:thumbId', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

export const ThumbController: Router = router;