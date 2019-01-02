import createError from 'http-errors';
import { Router, Request, Response } from 'express';
import * as Messaging from '../messaging/messaging';
const router = Router({ mergeParams: true });

/**
 * @api {post} /test/messaging Messaging Test
 * @apiName TestMessaging
 * @apiGroup Test
 *
 * @apiParam {String} token Device Firebase Token.
 * @apiParam {object} data (optional) data to send.
 * @apiParam {object} notification (optional) noti to send.
 *
 * @apiParamExample {json} User Action:
 * {
 *   "token": "1q2w3e4r",
 *   "data": {
 *      T
 *   },
 *   "notification": {
 *      "title": "string",
 *      "body": "string",
 *   }
 * }
 */
router.post('/messaging', function (req: Request, res: Response, next) {
    const token: string = req.body['token'];
    const data: any | null = req.body['data'];
    const noti: Notification | null = req.body['notification'];

    Messaging.send(token, data, noti)
        .then((msgRes) => {
            const payload = {
                "result": msgRes
            };

            res.status(200).json(payload);
        })
        .catch((err) => {
            next(err);
        });
});

export const TestController: Router = router;