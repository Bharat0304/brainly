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
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
function abc() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb+srv://kbharat84265:SjgpL1UbSskmfFBO@cluster0.tfyruuc.mongodb.net/brainlydb");
    });
}
abc();
console.log("Mongodb is connected ");
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requirebody = zod_1.default.object({
        email: zod_1.default.string().email().min(5).max(100),
        password: zod_1.default.string().email().max(50).min(4)
    });
    const parsedatasuccess = requirebody.safeParse(req.body);
    if (!parsedatasuccess) {
        res.status(411).json({
            msg: "Incorrect format "
        });
    }
    const username = req.body.username;
    const password = req.body.password;
    const hashedpassword = yield bcrypt_1.default.hash(password, 5);
    try {
        yield db_1.UserSchema.create({
            username: username,
            password: hashedpassword
        });
    }
    catch (e) {
        res.status(411).json({
            msg: "Use already exist "
        });
    }
    res.json({
        msg: "YOU are signed up "
    });
}));
app.post("api/v1/content", (req, res) => {
});
app.post("api/v1/content", (req, res) => {
});
app.get("api/v1/content", (req, res) => {
});
app.delete("api/v1/content", (req, res) => {
});
app.listen(3000);
