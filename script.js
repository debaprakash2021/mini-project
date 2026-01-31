// fetch("https://dummyjson.com/products")
// .then(response => response.json())
// .then(data => {
//     console.log("sucess ",data.products);
// })
// .catch(error => {console.error('Error:', error)});

const grid = document.getElementById("productGrid");

function addToViewHistory(item) {
    try {
        let history = JSON.parse(localStorage.getItem('viewHistory')) || [];
        history = history.filter(h => h.id !== item.id);
        history.unshift(item);
        if (history.length > 50) history.length = 50;
        localStorage.setItem('viewHistory', JSON.stringify(history));
    } catch (e) { console.error('viewHistory error', e); }
}

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
              addToViewHistory({ id: product.id, title: product.title, thumbnail: product.thumbnail, time: Date.now() });
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

// In-page search: render results on home instead of navigating to searchHistory
const paginationSection = document.querySelector('.pagination-container');
const searchResultsContainer = document.getElementById('searchResults');
const clearSearchBtn = document.getElementById('clearSearchBtn');

// Products cache used for dynamic filtering (fetched once)
let productsCache = [];
(function prefetchProducts(){
    fetch('https://dummyjson.com/products')
        .then(r => r.json())
        .then(d => { productsCache = d.products || []; })
        .catch(e => console.warn('Failed to prefetch products for dynamic search', e));
})();

function debounce(fn, wait=200){
    let t;
    function wrapped(...args){
        clearTimeout(t);
        t = setTimeout(()=>fn.apply(this,args), wait);
    }
    wrapped.cancel = () => clearTimeout(t);
    return wrapped;
}

function dynamicFilter(q){
    q = (q || '').trim();
    if (!q){
        // restore paginated listing
        if (searchResultsContainer) searchResultsContainer.innerHTML = '';
        if (paginationSection) paginationSection.style.display = '';
        return;
    }

    const runFilter = (products) => {
        const qLower = q.toLowerCase();
        const filtered = products.filter(p => p.title.toLowerCase().includes(qLower));
        renderHomeResults(filtered);
    };

    if (productsCache && productsCache.length) return runFilter(productsCache);

    // fallback fetch if cache not ready
    fetch('https://dummyjson.com/products')
      .then(r => r.json())
      .then(d => { productsCache = d.products || []; runFilter(productsCache); })
      .catch(e => console.error('Search fetch failed', e));
}

const debouncedFilter = debounce(dynamicFilter, 200);

function saveSearchHistory(query) {
    if(!query) return;
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const idx = history.findIndex(h => h.query.toLowerCase() === query.toLowerCase());
    if (idx === -1) {
        history.push({ query, time: Date.now() });
    } else {
        history[idx].time = Date.now();
    }
    localStorage.setItem("searchHistory", JSON.stringify(history));
}

function renderHomeResults(products) {
    if (!searchResultsContainer) return;
    searchResultsContainer.innerHTML = '';
    if (!products || products.length === 0) {
        const p = document.createElement('p');
        p.className = 'no-results';
        p.innerText = 'No results found.';
        searchResultsContainer.appendChild(p);
        paginationSection && (paginationSection.style.display = 'none');
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p>₹ ${product.price}</p>
        `;
        card.addEventListener('click', () => {
            addToViewHistory && addToViewHistory({ id: product.id, title: product.title, thumbnail: product.thumbnail, time: Date.now() });
            window.location.href = `product.html?id=${product.id}`;
        });
        searchResultsContainer.appendChild(card);
    });

    paginationSection && (paginationSection.style.display = 'none');
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;
    saveSearchHistory(query);
    debouncedFilter.cancel && debouncedFilter.cancel();
    dynamicFilter(query);
});

// Trigger search on Enter in input
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
    }
});

// Clear search and show paginated listing again
clearSearchBtn && clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    debouncedFilter.cancel && debouncedFilter.cancel();
    dynamicFilter('');
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
            debouncedFilter.cancel && debouncedFilter.cancel();
            dynamicFilter(item.query);
        });
        suggestionBox.appendChild(div);
    })

    // dynamic in-page filtering while typing (debounced)
    debouncedFilter(searchInput.value.trim());
});

