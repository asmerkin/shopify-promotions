import PromotionRunner from "./models/PromotionRunner";

declare global {
        interface Window {
            PromotionRunner: any; 
        }
}

window.PromotionRunner = new PromotionRunner() || {}; 