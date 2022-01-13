import PromotionRunner from "./models/PromotionRunner";

// Somehow we need to register this in the window object, so 
// then it can be called and laoded.
// window.PromotionRunner = new PromotionRunner(); 

// then they could use something like

// PromotionRunner.register({
//     id: somepromotion,
//     ...
// });

// And finally run the promotion executor every time all promos need to be 
// checked. 

// PromotionRunner.run(cart).then( cart => {
//     ...do something with the cart output. 
// }); 