# Shopify Promotions 

This script helps Shopify stores to implement promotions via javascript on the client side. The idea is to register all promotions on load, and then hook events to the theme actions that would trigger cart updates so the promotions are checked and they run as soon as the cart is updated. 

The idea behind these scripts are to create simplified way to stack promotions, apply them in order, and then modify the cart using the minor number of api calls as possible. As we know, Shopify doesn't like very much concurrent calls, so we are running these calls in series. The more calls we need to make, the slower the process will be. 

> Also, please consider that at this initial stage, scripts are handling only adding and keeping sync of some products. 

### ⚠️ About changing prices
Please notice that these scripts won't alter prices in any way. We can't do that using javascript, so that must be done by using Shopify Scripts (plus stores), or using free (or discounted) products for regular stores. 

At this stage, these promotiosn won't add discount codes to cart. This is something that might be done in the future, though it's not promised. 


## How to use it. 

### 1. Inject the promotions script into your store. 

```html
<script src="https://cdn.jsdelivr.net/npm/shopify-promotions@0.1.1/dist/runner.js" defer>
```

### 2. Register all your promotions. 

```javascript
window.PromotionRunner.register([
    {
        key: 'somekey', 
        lookup_variants: [123, 456], 
        add_variants: [
            {
                id: 789,
                quantity: 2,
                properties: {
                    _your_properties: 'your values'
                }
            }
        ]
    }
]); 
```

| Parameter | Required? | Description |
| --------- | --------- | ----------- |
| `key`       | yes       | An unique key per promotion that we will use to identify promotions | 
|` lookup_variants` | yes | A list of variant ids that the script needs to lookup to apply promotions | 
|` add_variants` | yes | a list of variants with quantities and properties we need to add for each found variant id | 

### 3. Hook the promotions checker after every cart update. 

This is a bit more complex an depends on the theme you're using or how you've hooked up the cart updates, but after updating the cart (adding an item, or updating quantities in the cart page, or even removing products), run this code so all promotions are checked and updated. 

```javascript 
window.PromotionRunner.check().then( cart => {
    // execute your actions with an updated cart object after all promotions 
    // are updated.  
}); 
```