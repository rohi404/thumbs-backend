import { Router, Request, Response } from "express";

const router = Router({ mergeParams: true });
import { getThumb, modifyThumb, deleteThumb } from "../database/thumbs";

/**
 * @api {get} /thumbs/:thumbId Get Thumb
 * @apiName getThumb
 * @apiGroup Thumb
 *
 * @apiParam (path) {Number} thumbId thumbId.
 *
 * @apiUse Thumb
 */
router.get("/", function (req: Request, res: Response, next) {
    const thumbId = req.params["thumbId"];

    getThumb(thumbId)
        .then((thumb) => {
            res.status(200).json(thumb);
        })
        .catch((err) => {
            next(err);
        })
});

/**
 * @api {put} /thumbs/:thumbId Modify Thumb
 * @apiName modifyThumb
 * @apiGroup Thumb
 *
 * @apiParam (path) {Number} thumbId thumbId.
 *
 * @apiUse Thumb
 */
router.put("/", function (req: Request, res: Response, next) {
    const thumbId = req.params["thumbId"];

    modifyThumb(thumbId, req.body["name"])
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @api {delete} /thumbs/:thumbId Delete Thumb
 * @apiName deleteThumb
 * @apiGroup Thumb
 *
 * @apiParam (path) {Number} thumbId thumbId.
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
router.delete("/", function (req: Request, res: Response, next) {
    const thumbId = req.params["thumbId"];

    deleteThumb(thumbId)
        .then((result) => {
            res.status(204).end();
        })
        .catch((err) => {
            next(err);
        });
});

export const ThumbController: Router = router;