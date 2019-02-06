import { loadQueue } from './utils/schedule';
import * as Messaging from "./utils/messaging";
import { AddressInfo } from "net";
import { createAppToRun } from "./create-app";

const server = createAppToRun().listen(80, function () {
    const port = server.address() as AddressInfo;
    console.log("Express server listening on port " + port.port);
    loadQueue().then(() => {
        console.log("Successfully load schedules");
    });

    Messaging.init();
});
