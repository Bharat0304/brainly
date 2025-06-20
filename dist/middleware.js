"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const Usermiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).json({
            msg: "Unauthorized"
        });
        return;
    }
    const tokens = token.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (decoded) {
            req.Userid = decoded.id;
            next();
        }
    }
    catch (e) {
        res.status(400).json({
            msg: "Invalid token "
        });
        return;
    }
};
exports.Usermiddleware = Usermiddleware;
