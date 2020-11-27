// Variables
const cartBtn = document.querySelector('.cart-btn');
const closeCart = document.querySelector('.close-cart');
const clearCar = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products-center');

// cart, getting the items from the loca storage
let cart = [];

let buttonsDOM = [];

// class responsable for getting the data
class Products{

    // function which get the data
    async getProducts(){

        try {

            let result = await fetch('./../../../products.json')

            let data = await result.json() // convert data

            // DESTRUCTING DATA
            let products = data.items;
            products = products.map(item =>{
                const {title, price} = item.fields;
                // const id = item.sys;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {id, title, price, image};
            });

            return products;

        } catch (error) {

            console.log(error)

        }
        
    }

}

// class responsable for diplaying the data
class UI{

    // Display profucts function, it take data grom products class
    displayProducts(products){
        let result = ''

        products.forEach(product => {

            result += `
                <!-- Start Single Product Example-->
                <article class="product">
                    <div class="img-container">
                        <img src="${product.image}" alt="${product.title}" class="product-img"/>
                        <button class="bag-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            add to bag
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article>
                <!-- End Single Product Example-->
            `;
        });

        // insert products inside producr-center section
        productDOM.innerHTML = result;
        
    } 

    

    // Start bagButtons function, handel the cart and buttons behavior
    getBagButtons(){

        // i used spread operator, returned all buttons, you can return an array [...buttons]
        const buttons = [...document.querySelectorAll('.bag-btn')];

        buttonsDOM = buttons; // assign those buttons to the parent buttons's holders

        buttons.forEach(button => {
            let id = button.dataset.id; // OR button.getAttribute('data-id')
            // To chack if the product i cart => make some changes on buttons
            const inCart = cart.find(item => item.id === id);

            if(inCart){
                button.innerText = 'In Cart';
                button.disabled = true;
            }

            button.addEventListener('click', e =>{

                e.target.innerText = 'In Cart';
                e.target.disabled = true;
                
                // get the product from the localstorage
                let cartItem = {...Storage.getProduct(e.target.dataset.id), amount: 1}; // destruct the data and added amount prop
                
                // add product to the cart
                cart = [...cart, cartItem];
                console.log(cart)
                //Storage.addProductToCart(cartItem);

                // save cart in local storage
                Storage.saveCart(cart); // pass the array of cart items to stor in local sotage

                // set cart values
                this.setCartValues(cart);
                // display cart values

                // show the cart
                
                
                
            });
            
        })
            
    }

    // setting the cart values function
    setCartValues(cart){

        let itemsTotal = 0, // You Sould Initialize Them To Not Get 'Nan'
            totalPrice = 0;
        cart.map(item => {
            itemsTotal += item.amount;
            totalPrice += item.price * item.amount;

            console.log(item.amount);
            console.log(item.price);
        });

        cartItems.innerText = itemsTotal;
        cartTotal.innerText = parseFloat(totalPrice.toFixed(2));

    }

    
}

// class responsable for storing the data
class Storage{

    // save products in the localstorage
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products));
    }

    // get a specific product from the local storage
    static getProduct(id){
        const products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    // save cart items in local storage
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    /* static addProductToCart(product){
        cartContent.innerHTML = `
            <!-- Start Item -->
                <div class="cart-item">
                    <img src="${product.image}" alt="CartProduct">
                    <div>
                        <h4>${product.title}</h4>
                        <h5>${product.price}$</h5>
                        <span class="remove-item">remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up"></i>
                        <p class="item-amount">1</p>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>         
                <!-- End Item -->
        `;
    } */

}

document.addEventListener('DOMContentLoaded',() => {

    

    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => {

        ui.displayProducts(products);

        // Is the function is static one you don't have to make an instance of it to work with
        Storage.saveProducts(products);

    }).then(() =>{

        ui.getBagButtons();
        

    }).catch(err => {

        console.log(err)

    });

    

});