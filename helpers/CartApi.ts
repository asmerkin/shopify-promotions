export default class CartApi {
    static async call(method: 'get' | 'post', url: string, payload?: object) {
        if ( method === 'get') {
            return fetch(url).then( response => response.json() ); 
        }

        return fetch(url, {
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }
        }).then( response => response.json() ); 
    }

    static async getCart() {
        return this.call('get', '/cart.js'); 
    }

    static async update(payload) {
        return this.call('post', '/cart/update.js', payload); 
    }

    static async change(payload) {
        return this.call('post', '/cart/change.js', payload); 
    }

    static async add(payload) {
        return this.call('post', '/cart/add.js', payload); 
    }
}