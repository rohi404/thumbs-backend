import * as express from "express";
import * as logger from "morgan";
import * as createError from "http-errors";
import { AddressInfo } from "net";

// Routes
import { UserController } from "./routes/users";
import { UserThumbController } from "./routes/user-thumbs";
import { ThumbController } from "./routes/thumbs";
import { EventController } from "./routes/events";
import { TestController } from "./routes/test";
import { loadQueue } from './utils/schedule';
import * as Messaging from "./utils/messaging";

// App Settings
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", express.static("./apidoc"));
app.use("/users", UserController);
app.use("/users/:userId/thumbs", UserThumbController);
app.use("/thumbs/:thumbId", ThumbController);
app.use("/thumbs/:thumbId/event", EventController);
app.use("/test/", TestController);
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    err.status = err.status || 500;
    res.status(err.status);
    res.json({
        "message": err.message,
        "status": err.status,
        "stack": err.stack.split(/\n\s*/)
    });
});

const server = app.listen(3456, function () {
    const port = server.address() as AddressInfo;
    console.log("Express server listening on port " + port.port);
    loadQueue().then(() => {
        console.log("Successfully load schedules");
    });

    Messaging.init();
});
