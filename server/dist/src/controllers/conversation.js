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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const conversation_model_1 = __importDefault(require("../models/conversation_model"));
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    try {
        let isExist = yield conversation_model_1.default.findOne({
            members: [senderId, receiverId],
        });
        if (!isExist) {
            isExist = yield conversation_model_1.default.findOne({
                members: [receiverId, senderId],
            });
        }
        //new conversation
        if (!isExist) {
            const newConversation = yield new conversation_model_1.default({
                members: [senderId, receiverId],
            });
            const savedConversation = yield newConversation.save();
            res.status(200).send(savedConversation);
        }
        else {
            //exist conversation
            console.log("conversation exists in db");
            res.status(200).send(isExist);
        }
    }
    catch (err) {
        res.status(400).send({ error: "Failed " });
    }
});
module.exports = {
    getConversation,
};
//# sourceMappingURL=conversation.js.map