// fetch("https://dummyjson.com/products")
// .then(response => response.json())
// .then(data => {
//     console.log("sucess ",data.products);
// })
// .catch(error => {console.error('Error:', error)});

fetch("https://dummyjson.com/products")
.then(response => response.json())
.then(data => {
    let grid = document.getElementById("productGrid");

    data.products.forEach(product => {
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


const searchBtn = document.getElementById("searchbtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(!query) return;
    // console.log("Searching for:", query);
    
    window.location.href =`search.html?q=${encodeURIComponent(query)}`; 
    searchInput.value = "";
});
