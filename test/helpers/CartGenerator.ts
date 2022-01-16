import {Cart, CartLineItem} from "../../types";

export default class CartGenerator {

    items: CartLineItem[]

    constructor(items: CartLineItem[]) {
        this.items = items; 
    }

    generate(): Cart {
        return {
            items: this.items
        }
    }
}