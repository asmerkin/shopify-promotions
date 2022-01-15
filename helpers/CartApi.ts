import Cart from "../definitions/Cart";

export default class CartApi {
    headers = {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    }

    static async update(payload) {
        console.log('Not implemented yet'); 
        return {} as Cart; 
    }

    static async change(payload) {
        console.log('Not implemented yet'); 
        return {} as Cart; 
    }

    static async add(payload) {
        console.log('Not implemented yet'); 
        return {} as Cart; 
    }
}