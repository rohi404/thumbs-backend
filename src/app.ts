import * as express from "express";
import * as logger from "morgan";
import createError from "http-errors";
import { AddressInfo } from "net";

// Routes
import { UserController } from "./routes/users";
import { ThumbController } from "./routes/thumbs";
import { EventController } from "./routes/events";
import { TestController } from "./routes/test";
import { loadQueue } from './schedule/schedule';
import * as Messaging from "./messaging/messaging";

// App Settings
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", express.static("./apidoc"));
app.use("/users", UserController);
app.use("/thumbs/", ThumbController);
app.use("/test/", TestController);
app.use("/thumbs/:thumbId/event", EventController);
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    err.status = err.status || 500;
    res.status(err.status);
    res.json({
        "message": err.message,
        "status": err.status,
        "stack": err.stack
    });
});

const server = app.listen(3000, function () {
    const port = server.address() as AddressInfo;
    console.log("Express server listening on port " + port.port);
    loadQueue().then(() => {
        console.log("Successfully load schedules");
    });

    Messaging.init();
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
