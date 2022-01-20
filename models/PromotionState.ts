import { PromotionStateCreation, PromotionStateMutation } from "../types";

export default class PromotionState {
    creations: PromotionStateCreation[] = []; 
    mutations: PromotionStateMutation[] = []; 
    deletions: string[]; 

    addCreation(creation: PromotionStateCreation) {
        this.creations.push(creation); 
    }

    addMutation(mutation: PromotionStateMutation) {
        this.mutations.push(mutation); 
    }

    addDeletion(key: string) {
        this.deletions.push(key); 
    }

    merge(state: PromotionState) {
        this.creations = [...this.creations, ...state.creations];
        this.mutations = [...this.mutations, ...state.mutations];
        this.deletions = [...this.deletions, ...state.deletions];
    }
}