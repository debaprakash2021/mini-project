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



const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchbtn");
console.log(searchBtn,searchInput);

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(!query) return;
    console.log("Searching for:", query);

    // // Save History
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    console.log(history);

    if(!history.includes(query)){
        history.push({
            query:query,
            time: Date.now()
        });
        localStorage.setItem("searchHistory",JSON.stringify(history));
    }

    
    window.location.href =`search.html?q=${encodeURIComponent(query)}`; 
    searchInput.value = "";

    
});




searchInput.addEventListener("input",()=>{
    console.log("Suggestion Working");

    const text = searchInput.value.toLowerCase();
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    console.log(history);
   // Filter based on Query Field
    const matches = history.filter(item=>{
        item.query.toLowerCase().inscludes(text)
    });
   // Clear previous suggestion
    suggestionBox.innerHTML = "";

    matches.forEach(item=>{
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.innerText = item.query;

        div.addEventListener("click",()=>{
            searchInput.value = item.query;
            suggestionBox.innerHTML = "";
        });
        suggestionBox.appendChild(div);
    })
});

