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