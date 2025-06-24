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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
function abc() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(config_1.mongodburl);
    });
}
abc()
    .then(() => {
    console.log("MongoDB connected");
})
    .catch(err => {
    console.error("MongoDB connection failed", err);
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requirebody = zod_1.default.object({
        email: zod_1.default.string().email().min(5).max(100),
        password: zod_1.default.string().max(50).min(4),
        username: zod_1.default.string().max(25)
    });
    const parsedatasuccess = requirebody.safeParse(req.body);
    if (!parsedatasuccess) {
        res.status(411).json({
            msg: "Incorrect format "
        });
    }
    const username = req.body.username;
    const password = req.body.password;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedpassword = yield bcrypt_1.default.hash(password, salt);
    try {
        yield db_1.UserModel.create({
            username: username,
            password: hashedpassword
        });
    }
    catch (e) {
        res.status(411).json({
            msg: "User already exist "
        });
    }
    console.log(req.body);
    res.json({
        msg: "YOU are signed up "
    });
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            res.status(400).json("Username and password are required");
            return;
        }
        const existinguser = yield db_1.UserModel.findOne({ username });
        if (!existinguser) {
            res.status(403).json({
                msg: "User not found"
            });
            return;
        }
        const ispasswordcorrect = yield bcrypt_1.default.compare(password, existinguser.password || '');
        if (!ispasswordcorrect) {
            res.status(400).json({
                msg: "Incorrect password"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: existinguser._id
        }, config_1.JWT_SECRET);
        res.json({
            token
        });
        return;
    }
    catch (e) {
        res.status(500).json({
            msg: "Error sigining in "
        });
        return;
    }
}));
app.post("/api/v1/content", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, link, type } = req.body;
    try {
        const Content = yield db_1.ContentModel.create({
            title: title,
            content: content,
            link: link,
            type: type,
            Userid: req.Userid
        });
        res.status(200).json({
            msg: "Content was added"
        });
        return;
    }
    catch (e) {
        res.status(400).json({
            msg: "There was a error adding a content "
        });
        return;
    }
}));
app.get("/api/v1/content", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.ContentModel.findOne({
        Userid: req.Userid
    }).populate("Userid", "username");
    res.status(200).json({
        data
    });
    console.log("HI there");
}));
app.delete("/api/v1/content", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Contentid = req.body.Contentid;
    yield db_1.ContentModel.deleteMany({
        Contentid,
        Userid: req.Userid
    });
}));
app.post("/api/v1/brain/share", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    try {
        if (share) {
            const existing = yield db_1.LinkModel.findOne({
                Userid: req.Userid
            });
            if (existing) {
                res.json({
                    hash: existing.hash
                });
            }
            const correcthash = (0, utils_1.randomhash)(10);
            const existingLink = yield db_1.LinkModel.create({
                Userid: req.Userid,
                hash: correcthash
            });
            console.log(existingLink);
            res.json({
                correcthash
            });
            return;
        }
        const existinglink = yield db_1.LinkModel.deleteOne({
            Userid: req.Userid
        });
        res.json({
            msg: 'link delted succesfully '
        });
        return;
    }
    catch (eror) {
        res.json({
            msg: "link already exist"
        });
    }
}));
app.get("/api/v1/brain/:sharelink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.sharelink;
    const link = yield db_1.LinkModel.findOne({
        hash: hash
    });
    if (!link) {
        res.json({
            msg: "Link does not exist "
        });
        return;
    }
    const User = yield db_1.UserModel.findOne({
        _id: link.Userid
    });
    const content = yield db_1.ContentModel.findOne({
        Userid: link.Userid
    });
    res.json({
        content,
        User: {
            username: User === null || User === void 0 ? void 0 : User.username,
            id: User === null || User === void 0 ? void 0 : User._id
        }
    });
}));
app.listen(3000);
