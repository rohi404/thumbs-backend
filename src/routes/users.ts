import * as createError from "http-errors";
import { Router, Request, Response } from 'express';
const router = Router({ mergeParams: true });

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 */
router.post('/', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {get} /users/:userId Get User
 * @apiName GetUser
 * @apiGroup User
 */
router.get('/:userId', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {put} /users/:userId Modify User
 * @apiName ModifyUser
 * @apiGroup User
 */
router.put('/:userId', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

/**
 * @api {delete} /users/:userId Delete User
 * @apiName DeleteUser
 * @apiGroup User
 */
router.delete('/:userId', function (req: Request, res: Response, next) {
    next(createError(500, 'Not Yet Implemented'));
});

export const UserController: Router = router;