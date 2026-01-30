// fetch("https://dummyjson.com/products")
// .then(response => response.json())
// .then(data => {
//     console.log("sucess ",data.products);
// })
// .catch(error => {console.error('Error:', error)});

const grid = document.getElementById("productGrid");

if (grid) {
  // Legacy non-paginated product rendering (only when #productGrid exists)
  fetch("https://dummyjson.com/products")
  .then(response => response.json())
  .then(data => {
      data.products.forEach(product => {
          let card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
              <img src="${product.thumbnail}">
              <h4>${product.title}</h4>
              <p>₹ ${product.price}</p>
          `;

          grid.appendChild(card);
          card.addEventListener("click",()=>{
              console.log("Card Clicked",product.id);
              window.location.href = `product.html?id=${product.id}`
          });
      });
  })
  .catch(err => console.log(err));
} else {
  console.log('Non-paginated #productGrid not present; skipping legacy product render.');
} 



const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchbtn");
const suggestionBox = document.getElementById("suggestions");
console.log(searchBtn,searchInput);

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(!query) return;
    console.log("Searching for:", query);

    // Save History (avoid duplicates)
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    console.log(history);

    if(!history.some(h => h.query.toLowerCase() === query.toLowerCase())){
        history.push({
            query: query,
            time: Date.now()
        });
        localStorage.setItem("searchHistory",JSON.stringify(history));
    } else {
        // Update timestamp to mark recent search
        history = history.map(h => h.query.toLowerCase() === query.toLowerCase() ? { query: h.query, time: Date.now() } : h);
        localStorage.setItem("searchHistory",JSON.stringify(history));
    }

    window.location.href = `searchHistory.html?q=${encodeURIComponent(query)}`; 
    searchInput.value = "";
});




searchInput.addEventListener("input",()=>{
    console.log("Suggestion Working");

    const text = searchInput.value.toLowerCase();
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    console.log(history);
   // Filter based on Query Field
    const matches = history.filter(item => {
        return item.query.toLowerCase().includes(text);
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

