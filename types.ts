export interface RegistrablePromotion {
    key: string,
    lookup_variants: number[],
    add_variants: Array<{
        id: number, 
        quantity: number, 
        properties?: Array<{
            [index: string]: string
        }>
    }>
}

export interface Variant {
    id: number, 
    quantity: number
}


export interface CartApiAction {
    action: 'change' | 'update' | 'add', 
    payload: object 
}

export interface CartLineItem {
    id: number, 
    key: string, 
    variant_id: number, 
    quantity: number, 
    properties?: {
        [index: string]: string 
    }
}

export interface Cart {
    items: CartLineItem[]
}

export type PromotionStateCreation = {
    id: number,
    quantity: number,
    properties: {
        _promotion: 'true' | 'false', 
        _promotion_key: string,
        _promotion_leader: 'true' | 'false',
        _promotion_leader_key: string
    }
};

export type PromotionStateMutation = {
    key: string,
    quantity: number,
    properties: {
        _promotion: 'true' | 'false', 
        _promotion_key: string,
        _promotion_leader: 'true' | 'false',
        _promotion_leader_key: string
    }
}


export interface PromotionState {
    creations: PromotionStateCreation[], 
    mutations: PromotionStateMutation[], 
    deletions: string[]
}