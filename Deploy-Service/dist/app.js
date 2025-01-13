"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
const queueGetter = new client_sqs_1.SQS({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
function getQueueUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting queue url");
        const queueUrl = yield queueGetter.getQueueUrl({ QueueName: "test" });
        console.log(queueUrl);
        yield new Promise((resolve) => setTimeout(resolve, 1000));
    });
}
// while (1) {
for (let i = 0; i < 10; i++) {
    getQueueUrl();
}
