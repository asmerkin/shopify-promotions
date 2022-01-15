import Cart, { CartLineItem } from "../../definitions/Cart";

export default class CartGenerator {

    line_items: CartLineItem[]

    constructor(line_items: CartLineItem[]) {
        this.line_items = line_items; 
    }

    generate(): Cart {
        return {
            line_items: this.line_items
        }
    }
}