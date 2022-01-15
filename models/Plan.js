"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var Plan = /** @class */ (function () {
    function Plan(cart) {
        // This will contain all the results to handle.
        this.mutations = [];
        this.creations = [];
        this.deletions = [];
        this.cart = cart;
    }
    /**
     * Creates the plan mutations,
     */
    Plan.prototype.create = function (promotions) {
        var _this = this;
        // Here we need to loop through each promotion and add the creations,
        // mutations and deletions.
        promotions.forEach(function (promotion) {
            var state = promotion.run(_this.cart);
            _this.setCreations(state.creations);
            _this.setMutations(state.mutations);
            _this.setDeletions(state.deletions);
        });
        // Removing orphans. 
        this.setDeletions(this.removeOrphans());
        return this;
    };
    /**
     * Creates a deletion array with all the orphans.
     *
     * @returns
     */
    Plan.prototype.removeOrphans = function () {
        var _this = this;
        // Orphans are all the followers that do not have a belonging 
        // leader line_item. 
        return this.cart.line_items.filter(function (item) {
            var _a;
            return ((_a = item.properties) === null || _a === void 0 ? void 0 : _a._promotion_leader) === 'false'
                && !_this.cart.line_items.some(function (found) {
                    var _a;
                    return found.key === ((_a = item.properties) === null || _a === void 0 ? void 0 : _a._promotion_leader_key);
                });
        }).map(function (item) { return item.key; });
    };
    /**
     * Sets the list of mutations into the plan.
     *
     * @param mutations the list of mutations
     * @returns Plan
     */
    Plan.prototype.setMutations = function (mutations) {
        if (Array.isArray(mutations)) {
            this.mutations = __spreadArray(__spreadArray([], this.mutations, true), mutations, true);
        }
        else {
            this.mutations.push(mutations);
        }
        return this;
    };
    /**
     * Sets a list of items to create.
     *
     * @param creations the list of creations
     * @returns Plan
     */
    Plan.prototype.setCreations = function (creations) {
        if (Array.isArray(creations)) {
            this.creations = __spreadArray(__spreadArray([], this.creations, true), creations, true);
        }
        else {
            this.creations.push(creations);
        }
        return this;
    };
    /**
     * Sets a list of deletions
     * @param deletions the keys to delete.
     * @returns Plan
     */
    Plan.prototype.setDeletions = function (deletions) {
        if (Array.isArray(deletions)) {
            this.deletions = __spreadArray(__spreadArray([], this.deletions, true), deletions, true);
        }
        else {
            this.deletions.push(deletions);
        }
        return this;
    };
    return Plan;
}());
exports["default"] = Plan;
