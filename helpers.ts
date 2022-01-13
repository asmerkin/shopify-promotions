import Cart from "./definitions/Cart";

export function findCartItemByKey(cart: Cart, key: string) {
    return cart.line_items.find( item => {
        return item.key == key; 
    }); 
}