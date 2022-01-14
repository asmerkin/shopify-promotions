import Cart from "../definitions/Cart";

interface CartApiAction {
    action: 'change' | 'update' | 'add', 
    payload: object 
}

export default class CartApi {
    headers = {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    }

    static update(payload) {
        return new Promise((resolve) => {
            console.log('Not implemented yet'); 
            resolve('resolved'); 
        }); 
    }

    static change(payload) {
        return new Promise((resolve) => {
            console.log('Not implemented yet'); 
            resolve('resolved'); 
        }); 
    }

    static add(payload) {
        return new Promise((resolve) => {
            console.log('Not implemented yet'); 
            resolve('resolved'); 
        }); 
    }

    /**
     * Runs the processing queue to alter the cart in the desired way. 
     * (Shopify doesn't like concurrent calls, so we have to do it this way)
     * 
     * @param actions list of actions to process. 
     * @param cart the last cart response. 
     * @returns the last cart response after the actions array is cleared. 
     */
    static process(actions: CartApiAction[], cart?: Cart) {
        if ( actions.length === 0 ) {
            return cart; 
        }

        const next = actions.shift(); 

        this[next.action](next.payload).then( (response) => {
            this.process(actions, response as Cart); 
        }); 
    }
}