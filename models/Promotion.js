"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var Promotion = /** @class */ (function () {
    function Promotion(_a) {
        var key = _a.key, lookup_variants = _a.lookup_variants, add_variants = _a.add_variants;
        this.key = key;
        this.lookup_variants = lookup_variants;
        this.add_variants = add_variants;
    }
    Promotion.prototype.run = function (cart) {
        var _this = this;
        var state = {
            creations: [],
            mutations: [],
            deletions: []
        };
        cart.line_items.filter(function (item) {
            var _a;
            return _this.lookup_variants.includes(item.variant_id)
                && ((_a = item.properties) === null || _a === void 0 ? void 0 : _a._promotion_leader) !== 'false';
        }).forEach(function (leader) {
            var _a;
            if (((_a = leader.properties) === null || _a === void 0 ? void 0 : _a._promotion_leader) == null) {
                _this.hookPromotionLeader(leader, state);
            }
            // followers are the items added by this promotion. 
            var followers = cart.line_items.filter(function (item) {
                var _a, _b, _c;
                return ((_a = item.properties) === null || _a === void 0 ? void 0 : _a._promotion_leader) === 'false'
                    && ((_b = item.properties) === null || _b === void 0 ? void 0 : _b._promotion_key) === _this.key
                    && ((_c = item.properties) === null || _c === void 0 ? void 0 : _c._promotion_leader_key) === leader.key;
            });
            _this.add_variants.forEach(function (variant) {
                var isCreated = followers.map(function (item) { return item.variant_id; })
                    .includes(variant.id);
                if (isCreated) {
                    var follower = followers.find(function (item) { return item.variant_id === variant.id; });
                    var expected_quantity = variant.quantity * leader.quantity;
                    if (follower.quantity != expected_quantity) {
                        _this.adjustFollowerQuantity(follower, expected_quantity, state);
                    }
                }
                else {
                    _this.createNewFollower(leader, variant, state);
                }
            });
        });
        return state;
    };
    /**
     * Sets the parameters to the leader object.
     *
     * @param item the cart line item to use,
     * @param state the return state
     */
    Promotion.prototype.hookPromotionLeader = function (item, state) {
        state.mutations.push({
            key: item.key,
            quantity: item.quantity,
            properties: __assign(__assign({}, item.properties), {
                _promotion: 'true',
                _promotion_key: this.key,
                _promotion_leader: 'true',
                _promotion_leader_key: item.key
            })
        });
    };
    /**
     * Creates a new follower for the specified variant.
     * @param leader
     * @param variant
     * @param state
     */
    Promotion.prototype.createNewFollower = function (leader, variant, state) {
        state.creations.push({
            id: variant.id,
            quantity: variant.quantity * leader.quantity,
            properties: {
                _promotion: 'true',
                _promotion_key: this.key,
                _promotion_leader: 'false',
                _promotion_leader_key: leader.key
            }
        });
    };
    /**
     * Adjusts the follower to match the leader quantity using the defined
     * promotion quantity.
     *
     * @param follower
     * @param quantity
     * @param state
     */
    Promotion.prototype.adjustFollowerQuantity = function (follower, quantity, state) {
        state.mutations.push({
            key: follower.key,
            quantity: quantity,
            properties: follower.properties
        });
    };
    return Promotion;
}());
exports["default"] = Promotion;
