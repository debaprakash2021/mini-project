// Read query param
const params = new URLSearchParams(window.location.search);
const query = params.get('q');

const headingEl = document.getElementById('heading');
const historyListEl = document.getElementById('historyList');
const clearBtn = document.getElementById('clearHistory');
const productGrid = document.getElementById('productGrid');

function formatTime(ts) {
    return new Date(ts).toLocaleString();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // sort by most recent
    history.sort((a,b) => b.time - a.time);
    renderHistory(history);
}

function renderHistory(history) {
    historyListEl.innerHTML = '';
    if(history.length === 0) {
        const li = document.createElement('li');
        li.innerText = 'No searches yet.';
        historyListEl.appendChild(li);
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'history-item';
        btn.innerText = `${item.query} — ${formatTime(item.time)}`;
        btn.addEventListener('click', () => {
            // Navigate to the same page with the selected query
            window.location.href = `searchHistory.html?q=${encodeURIComponent(item.query)}`;
        });
        li.appendChild(btn);
        historyListEl.appendChild(li);
    });
}

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('searchHistory');
    loadHistory();
});



// If there is a query in the URL, show results and add to history
if(query) {
    headingEl.innerText = `Results for "${query}"`;

    // Save to history (avoid duplicates; update timestamp if exists)
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const existing = history.find(h => h.query.toLowerCase() === query.toLowerCase());
    if(existing) {
        existing.time = Date.now();
    } else {
        history.push({ query, time: Date.now() });
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));

    // Fetch products and filter safely
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            const products = data.products || [];
            const qLower = query.toLowerCase();
            const filtered = products.filter(p => p.title.toLowerCase().includes(qLower));

            productGrid.innerHTML = '';
            if(filtered.length === 0) {
                const msg = document.createElement('p');
                msg.innerText = 'No results found.';
                productGrid.appendChild(msg);
                return;
            }

            filtered.forEach(product => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${product.thumbnail}">
                    <h4>${product.title}</h4>
                    <p>₹ ${product.price}</p>
                `;
                productGrid.appendChild(card);
                // adding eventListener to card
                
            });
        })
        .catch(err => console.error(err));
} else {
    headingEl.innerText = 'Search history';
}

// Always load history list on page load
loadHistory();












