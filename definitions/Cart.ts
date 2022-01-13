export interface CartLineItem {
    id: number, 
    key: string, 
    variant_id: number, 
    quantity: number, 
    properties?: {
        [index: string]: string 
    }
}

export default interface Cart {
    line_items: CartLineItem[]
}