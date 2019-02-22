import * as createError from "http-errors";
import { Router, Request, Response } from 'express';
import { createUser, modifyUser, deleteUser, getUser } from "../database/users";
import { deleteThumb} from "../database/thumbs";

const router = Router({ mergeParams: true });

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "id": "user1",
 *     "pw": "qwerty",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "user_id": 1,
 *     "id": "user1",
 *     "pw": "qwerty",
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */

router.post('/', function (req: Request, res: Response, next) {
    const userId = req.body["id"];
    const userPassword = req.body["pw"];

    createUser(userId, userPassword)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            next(err);
        })
});

/**
 * @api {get} /users/:userId Get User
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam (path) {Number} userId userId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "user_id": 1,
 *     "id": "user1",
 *     "pw": "qwerty",
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.get('/:userId', function (req: Request, res: Response, next) {
    const userId = req.params["userId"];

    getUser(userId)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            next(err);
        })
});

/**
 * @api {put} /users/:userId Modify User
 * @apiName ModifyUser
 * @apiGroup User
 *
 * @apiParam (path) {Number} userId userId.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "pw": "qwe",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "user_id": 1,
 *     "id": "user1",
 *     "pw": "qwe",
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.put('/:userId', function (req: Request, res: Response, next) {
    const userId = req.params["userId"];

    modifyUser(userId, req.body["pw"])
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @api {delete} /users/:userId Delete User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam (path) {Number} userId userId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
router.delete('/:userId', function (req: Request, res: Response, next) {
    const userId = req.params["userId"];

    deleteUser(userId)
        .then((result) => {
            res.status(204).end();
        })
        .catch((err) => {
            next(err);
        });
});

export const UserController: Router = router;