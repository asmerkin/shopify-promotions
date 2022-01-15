import Cart from "../definitions/Cart";
import CartApi from "./CartApi";

interface CartApiAction {
    action: 'change' | 'update' | 'add', 
    payload: object 
}

/**
 * Runs the processing queue to alter the cart in the desired way. 
 * (Shopify doesn't like concurrent calls, so we have to do it this way)
 * 
 * @param actions list of actions to process. 
 * @param cart the last cart response. 
 * @returns the last cart response after the actions array is cleared. 
 */
export async function processActions(actions: CartApiAction[]): Promise<Cart> {
    let lastCart = null; 

    actions.forEach ( async (next) => {
        try {
            lastCart = await CartApi[next.action](next.payload); 
        } catch ( error ) {
            console.log( error ); 
        }
    }); 

    return lastCart as Cart;
}