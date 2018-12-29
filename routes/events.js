const express = require('express');
const createError = require('http-errors');
const router = express.Router({ mergeParams: true });

const eventHandler = require('../src/event/event-handler.js');

/**
 * @api {post} /thumbs/:thumbId/event Post User Event
 * @apiName PostUserEvent
 * @apiGroup Event
 *
 * @apiParam {Number} thumbId Thumb Id.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *   "requestId": 12345678,
 *   "event": "TOUCH | CURE | CLEAN | EAT",
 *   "payload": {}
 * }
 * @apiParamExample {json} App Changed Action:
 * {
 *   "requestId": 12345678,
 *   "event": "$CHANGE_APP",
 *   "payload": {
 *     "appName": "youtube"
 *   }
 * }
 *
 * @apiUse ThumbState
 */
router.post('/', function (req, res, next) {
    const thumbId = req.params['thumbId'];
    const event = req.body;

    eventHandler.handleEvent(thumbId, event).then((payload) => {
        payload['requestId'] = req.body['requestId'];
        res.status(200).json(payload);
    }).catch((error) => {
        next(error);
    });
});

module.exports = router;