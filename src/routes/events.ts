import { Router, Request, Response } from 'express';
const router = Router({ mergeParams: true });

import * as eventHandler from '../utils/event-handler';

/**
 * @api {post} /thumbs/:thumbId/event Post User Event
 * @apiName PostUserEvent
 * @apiGroup Event
 *
 * @apiParam {Number} thumbId Thumb Id.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "requestId": 12345678,
 *     "event": "TOUCH | CURE | CLEAN | EAT | UNDO_TOUCH | UNDO_CURE | UNDO_CLEAN | UNDO_EAT",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "requestId": 12345678,
 *     "thumbId": 1,
 *     "name": "귀요미",
 *     "condition": {
 *         "affection": {
 *             "label": "normal",
 *             "value": 30
 *         },
 *         "health": {
 *             "label": "low",
 *             "value": 0
 *         },
 *         "hygiene": {
 *             "label": "high",
 *             "value": 70
 *         },
 *         "satiety": {
 *             "label": "low",
 *             "value": 0
 *         }
 *     }
 * }
 */
router.post('/', function (req: Request, res: Response, next) {
    const thumbId = parseInt(req.params['thumbId']);
    const event = req.body;
    eventHandler.handleEvent(thumbId, event).then((payload) => {
        payload['requestId'] = req.body['requestId'];
        res.status(200).json(payload);
    }).catch((error) => {
        next(error);
    });
});

export const EventController: Router = router;