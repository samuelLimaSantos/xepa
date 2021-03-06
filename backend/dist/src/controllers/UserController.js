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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var connections_1 = __importDefault(require("../database/connections"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.createUser = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, password, category, isEmailAlreadyRegistered, cryptoHash, idUser, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, name = _a.name, email = _a.email, password = _a.password, category = _a.category;
                        if (email === '' || password === '' || category === '') {
                            return [2 /*return*/, response.json({ error: 'Any field are missing!' })];
                        }
                        return [4 /*yield*/, connections_1.default('users')
                                .select('users.*')
                                .where('users.email', '=', email)];
                    case 1:
                        isEmailAlreadyRegistered = _b.sent();
                        if (isEmailAlreadyRegistered.length > 0) {
                            return [2 /*return*/, response.json({ error: 'Email is already registered' })];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 8)];
                    case 3:
                        cryptoHash = _b.sent();
                        return [4 /*yield*/, connections_1.default('users').insert({
                                name: name,
                                email: email,
                                password: cryptoHash,
                                category: category,
                            })];
                    case 4:
                        idUser = (_b.sent())[0];
                        return [2 /*return*/, response.status(201).json({ idUser: idUser, email: email })];
                    case 5:
                        err_1 = _b.sent();
                        return [2 /*return*/, response.status(400).json({ error: 'Error' })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.loginUser = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, userData, isPasswordOk, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, connections_1.default('users')
                                .select('users.*')
                                .where('users.email', '=', email)];
                    case 1:
                        userData = _b.sent();
                        if (userData.length < 1) {
                            return [2 /*return*/, response.json({ error: 'Email is not registered' })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, userData[0].password)];
                    case 2:
                        isPasswordOk = _b.sent();
                        if (isPasswordOk === false) {
                            return [2 /*return*/, response.json({ error: 'Invalid Password' })];
                        }
                        token = jsonwebtoken_1.default.sign({
                            id: userData[0].id,
                            email: userData[0].email,
                        }, 'segredo', {
                            expiresIn: '1h',
                        });
                        return [2 /*return*/, response.json({ token: token, category: userData[0].category })];
                }
            });
        });
    };
    return UserController;
}());
exports.default = UserController;
