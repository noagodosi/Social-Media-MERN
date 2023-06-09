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
const post_model_1 = __importDefault(require("../models/post_model"));
const getAllPostsEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("");
    try {
        const posts = yield post_model_1.default.find();
        return { status: "OK", data: posts };
    }
    catch (err) {
        return { status: "FAIL", data: "" };
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req.query.sender == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ sender: req.query.sender });
        }
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send({ error: "Failed to get posts from DB" });
    }
});
const getPostsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.find({ sender: req.params.id });
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send({ error: "Failed to get post from DB" });
    }
});
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.avatarUrl) {
        console.log("avatarUrl is required!");
        return res.status(400).send({ error: "avatarUrl is required!" });
    }
    let fixStr = req.body.avatarUrl.toString();
    let result = fixStr.replace("\\", "/");
    const post = new post_model_1.default({
        message: req.body.message,
        sender: req.body.sender,
        avatarUrl: result,
    });
    try {
        console.log('post', post);
        const newPost = yield post.save();
        console.log("post saved in DB");
        res.status(200).send(newPost);
    }
    catch (err) {
        console.log("failed to save post in DB");
        res.status(400).send({ error: "Failed add post to DB" });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.body.message;
    const id = req.body.id;
    try {
        const post = yield post_model_1.default.findByIdAndUpdate(id, {
            $set: {
                message,
            },
        });
        yield post.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const P = yield post_model_1.default.findByIdAndDelete({ _id: id });
        res.status(200).send({ msg: "delete succes", status: 200 });
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
module.exports = {
    getAllPosts,
    addNewPost,
    getPostsById,
    getAllPostsEvent,
    updatePost,
    deletePost,
};
//# sourceMappingURL=post.js.map