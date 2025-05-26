"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const Usermodel = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: { type: String },
});
exports.UserSchema = (0, mongoose_1.model)("User", Usermodel);
