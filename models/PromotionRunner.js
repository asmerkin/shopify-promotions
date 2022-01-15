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
exports.__esModule = true;
var Promotion_1 = require("../models/Promotion");
var Plan_1 = require("../models/Plan");
var ActionsProcessor_1 = require("../helpers/ActionsProcessor");
var CartApi_1 = require("../helpers/CartApi");
var PromotionRunner = /** @class */ (function () {
    function PromotionRunner() {
        this.promotions = [];
    }
    /**
     * Registers a new promotion.
     * @param promotion the promotion to register.
     */
    PromotionRunner.prototype.register = function (promotion) {
        var _this = this;
        if (Array.isArray(promotion)) {
            promotion.forEach(function (p) { return _this.promotions.push(new Promotion_1["default"](p)); });
        }
        else {
            this.promotions.push(new Promotion_1["default"](promotion));
        }
    };
    /**
     * returns the list of registered promotions.
     *
     * @returns the list of promotions.
     */
    PromotionRunner.prototype.getPromotions = function () {
        return this.promotions;
    };
    /**
     * Generates a plan to run all promotions..
     */
    PromotionRunner.prototype.plan = function (cart) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (new Plan_1["default"](cart)).create(this.promotions)];
            });
        });
    };
    /**
     * Executes the plan handling all Promotions
     *
     * @param plan
     * @returns
     */
    PromotionRunner.prototype.commit = function (cart, plan) {
        return __awaiter(this, void 0, void 0, function () {
            var actions, updatedCart, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actions = [];
                        // this method should create a series of calls to, 
                        // 1. delete all deltable items. 
                        // 2. mutate all changeable items. 
                        // 3. add all new items. 
                        if (plan.deletions.length > 0) {
                            actions.push({
                                action: 'update',
                                payload: cart.line_items.map(function (item) {
                                    return plan.deletions.includes(item.key)
                                        ? 0
                                        : item.quantity;
                                })
                            });
                        }
                        if (plan.mutations.length > 0) {
                            plan.mutations.forEach(function (mutation) {
                                actions.push({
                                    action: 'change',
                                    payload: {
                                        id: mutation.key,
                                        quantity: mutation.quantity,
                                        properties: mutation.properties
                                    }
                                });
                            });
                        }
                        if (plan.creations.length > 0) {
                            actions.push({
                                action: 'add',
                                payload: {
                                    items: plan.creations.map(function (creation) {
                                        return {
                                            id: creation.id,
                                            quantity: creation.quantity,
                                            properties: creation.properties
                                        };
                                    })
                                }
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, ActionsProcessor_1.processActions)(actions)];
                    case 2:
                        updatedCart = _a.sent();
                        return [2 /*return*/, updatedCart];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Excecutes the plan in the cart, and then returns the cart object
     * back to the caller.
     */
    PromotionRunner.prototype.check = function (cart) {
        return __awaiter(this, void 0, void 0, function () {
            var plan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!cart) return [3 /*break*/, 2];
                        return [4 /*yield*/, CartApi_1["default"].getCart()];
                    case 1:
                        cart = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.plan(cart)];
                    case 3:
                        plan = _a.sent();
                        return [2 /*return*/, this.commit(cart, plan)];
                }
            });
        });
    };
    return PromotionRunner;
}());
exports["default"] = PromotionRunner;
