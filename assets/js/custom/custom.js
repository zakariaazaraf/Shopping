// Variables
const cartBtn = document.querySelector('.cart-btn');
const closeCart = document.querySelector('.close-cart');
const clearCart = document.querySelector('.clear-cart');
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
                            add to cart
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
                //Storage.addProductToCart(cartItem);

                // save cart in local storage
                Storage.saveCart(cart); // pass the array of cart items to stor in local sotage

                // set cart values
                this.setCartValues(cart);

                // display cart values
                this.addCartItem(cartItem);

                // show the cart
                this.showCart();
                
                
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
        });

        cartItems.innerText = itemsTotal;
        cartTotal.innerText = parseFloat(totalPrice.toFixed(2));

    }

    // add the cart items
    addCartItem(item){  
        
        let div = document.createElement('div'); // think to append div(s) every time the user add an item
        div.classList.add('cart-item'); // custimaze the div    
        
            div.innerHTML = `
                <!-- Start Item -->
                
                    <img src="${item.image}" alt="CartProduct">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>${item.price}$</h5>
                        <span class="remove-item" data-id="${item.id}">remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id="${item.id}"></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id="${item.id}"></i>
                    </div>
               
                <!-- End Item -->
            `;
        cartContent.insertBefore(div, null);
        
    }

    // show cart function
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    }

    // close the cart item
    closeCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    // setup app on refrech
    setupApp(){
        // get data cart from the local storage
        cart = Storage.getCart();

        // set car values and total price
        this.setCartValues(cart);

        // add item to the cart
        this.populateCart(cart);

        // add Events Listner

        cartBtn.addEventListener('click', this.showCart); // when the cart button clicked, show the cart items

        closeCart.addEventListener('click', this.closeCart); // close the cart from the close button
       
    }

    // add item(s) to the cart 
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }

    cartLogic(){

        // claer all items
        clearCart.addEventListener('click', ()=>{
            this.clearCart();
        });

        // cart fonctionallity
        cartContent.addEventListener('click', event =>{
            let id = event.target.dataset.id,
                cartItem = cart.find(item => item.id === id);
            
            switch(event.target.className){
                case 'fas fa-chevron-up': 
                cartItem.amount ++;
                // setting the item number and the total price
                event.target.nextElementSibling.innerText = cartItem.amount;
                // save the cart in loal storage
                Storage.saveCart(cart);
                // setting the item number and the total price
                this.setCartValues(cart);
                break;
                case 'fas fa-chevron-down': 
                cartItem.amount --;
                if(cartItem.amount > 0){
                    
                    // save the cart in loal storage
                    Storage.saveCart(cart);
                    // setting the item number and the total price
                    this.setCartValues(cart);
                    // update the text content
                    event.target.previousElementSibling.innerText = cartItem.amount;
                }else{
                    cartContent.removeChild(event.target.parentElement.parentElement);
                    this.removeItem(id);
                }        
                break;
                case 'remove-item': 
                    this.removeItem(id);
                    cartContent.removeChild(event.target.parentElement.parentElement);
                break;
                default:;
            }
            
        });
    }

    // clear all items function
    clearCart(){
        // get the ids of the items
        let cartItems = cart.map(item => item.id);

        // remove the items one by one
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        // remove cart from the cart content
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
        }

        // hide the cart after the removing is done
        this.closeCart();
        
    }

    removeItem(id){

        // update the cart, by remve just the item that have the id passed in the function
        cart = cart.filter(item => item.id !== id);

        // set the cart values, the number and the total price
        this.setCartValues(cart);

        // save cart values to the local storage
        Storage.saveCart(cart);

        // get the button and handel it by enable and change 'in card' to 'add to cart'
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class='fas fa-shopping-cart'></i>add to cart`;

        
    }

    // get the button and return it
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
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

    // get the cart data from the local storage
    static getCart(){
        let data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    }


}

document.addEventListener('DOMContentLoaded',() => {

    // instanciations of classes
    const ui = new UI();
    const products = new Products();

    // setup the application, by displaying the data from the local storage
    ui.setupApp();

    // get the product and show them in the page
    products.getProducts().then(products => {

        // display fuction
        ui.displayProducts(products);

        // Is the function is static one you don't have to make an instance of it to work with
        Storage.saveProducts(products);


    }).then(() =>{

        ui.getBagButtons();
        ui.cartLogic();

    }).catch(err => {

        console.log(err)

    });


});

