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
                    <h4>${product.price}</h4>
                </article>
                <!-- End Single Product Example-->
            `;
        });

        // select the producs center and append a child inside it
        document.querySelector('.products-center').innerHTML = result;
        
    }
}

// class responsable for storing the data
class Storage{

}

document.addEventListener('DOMContentLoaded',()=>{

    console.log("hi from addEventListener !!, Your page was loaded successfully.");

    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => ui.displayProducts(products)).catch(err =>{

        console.log(err)

    })

    

});