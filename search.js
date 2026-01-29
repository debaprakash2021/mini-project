let param = new URLSearchParams(window.location.search);
console.log(param);

let query = param.get("q");
console.log("Search query is:", query);

// fetch("https://dummyjson.com/products")
// .then(response => response.json())
// .then(data => {
//     let products= data.products;
//     let filtered = products.filter(p =>{
//     return p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase());
//     });
//     let grid = document.getElementById("results");
// })
// .catch(err => console.log(err));



fetch("https://dummyjson.com/products")
.then(response => response.json())
.then(data => {
       let products= data.products;
    let filtered = products.filter(p =>{
    return p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    });
    let grid = document.getElementById("productGrid");

    filtered.forEach(product => {
        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.thumbnail}">
            <h4>${product.title}</h4>
            <p>₹ ${product.price}</p>
        `;

        grid.appendChild(card);
    });
})
.catch(err => console.log(err));