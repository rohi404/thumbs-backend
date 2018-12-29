const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');

// Routes
const userRouter = require('./routes/users.js');
const thumbRouter = require('./routes/thumbs.js');
const eventRouter = require('./routes/events.js');

// App Settings
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', express.static('./apidoc'));
app.use('/users', userRouter);
app.use('/thumbs/', thumbRouter);
app.use('/thumbs/:thumbId/event', eventRouter);
app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    err.status = err.status || 500;

    res.status(err.status);
    res.json({
        'message': err.message,
        'status': err.status,
        'stack': err.stack
    });
});

const server = app.listen(3000, function() {
    console.log('Express server listening on port ' + server.address().port);
    require('./src/schedule/schedule.js').loadQueue().then(() => {
        console.log('Successfully load schedules');
    });
});

/**
 * @apiDefine ThumbState
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *   "requestId": 123456789
 *   "character": {
 *     "attires": [],
 *     "characterImageUrl": ""
 *   },
 *   "condition": {
 *     "affection": {
 *       "label": "normal",
 *       "value": 50
 *     },
 *     "health": {
 *       "label": "normal",
 *       "value": 50
 *     },
 *     "hygiene": {
 *       "label": "normal",
 *       "value": 50
 *     },
 *     "satiety": {
 *       "label": "normal",
 *       "value": 50
 *     }
 *   }
 * }
 */
