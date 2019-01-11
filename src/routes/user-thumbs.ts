import * as createError from "http-errors";
import {Router, Request, Response} from "express";

const router = Router({mergeParams: true});
import {createThumb, getThumbList} from "../database/thumbs";
import {initialSchedule} from "../utils/schedule";

/**
 * @api {post} /users/:userId/thumbs Create Thumb
 * @apiName CreateThumb
 * @apiGroup Thumb
 *
 * @apiParam (path) {Number} userId userId.
 * @apiParam (body) {String} name name.
 * @apiParamExample {json} User Action:
 * {
 *   "name": "고양이"
 * }
 *
 * @apiUse Thumb
 */
export const createThumbRoute = async function (req: Request, res: Response, next) {
    const userId = req.params["userId"];

    if (!req.body.hasOwnProperty("name")) {
        next(createError(400, "There is no 'name' field in body"));
    }
    const name = req.body["name"];

    let thumb = await createThumb(userId, name);
    await initialSchedule(thumb['thumbId']);
    return thumb;
};

router.post("/", function (req: Request, res: Response, next) {
    createThumbRoute(req, res, next)
        .then((thumb) => {
            res.status(200).json(thumb);
        })
        .catch((err) => {
            next(err);
        })
});

/**
 * @api {get} /users/:userId/thumbs Get Thumb List
 * @apiName listThumb
 * @apiGroup Thumb
 *
 * @apiParam (path) {Number} userId userId.
 *
 * @apiUse ThumbList
 */
router.get("/", function (req: Request, res: Response, next) {
    const userId = req.params["userId"];

    getThumbList(userId)
        .then((thumbList) => {
            res.status(200).json(thumbList);
        })
        .catch((err) => {
            next(err);
        })
});

export const UserThumbController: Router = router;