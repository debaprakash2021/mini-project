const historyListEl = document.getElementById('historyList');
const clearBtn = document.getElementById('clearHistory');
const historyCountEl = document.getElementById('historyCount');

function formatTime(ts) {
    return new Date(ts).toLocaleString();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // sort by most recent
    history.sort((a,b) => b.time - a.time);
    renderHistory(history);
    historyCountEl.innerText = `${history.length} item${history.length === 1 ? '' : 's'}`;
}

function renderHistory(history) {
    historyListEl.innerHTML = '';
    if(history.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-history';
        li.innerText = 'No searches yet.';
        historyListEl.appendChild(li);
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-card';
        li.innerHTML = `
            <div class="history-title">${escapeHtml(item.query)}</div>
            <div class="history-time">${formatTime(item.time)}</div>
            <div class="history-actions">
              <button class="remove-history" data-query="${escapeHtml(item.query)}">Remove</button>
            </div>
        `;

        // clicking a card runs the search on the home page (confirmation)
        li.addEventListener('click', (e) => {
            if (e.target.closest('.remove-history')) return; // ignore remove clicks
            if (!confirm(`Run search for "${item.query}" on the home page?`)) return;
            sessionStorage.setItem('pendingSearch', item.query);
            window.location.href = 'index.html';
        });

        historyListEl.appendChild(li);
    });
}

// Delegated listeners for history list actions
historyListEl.addEventListener('click', (e) => {
    if (e.target.matches('.remove-history')) {
        const q = e.target.getAttribute('data-query');
        if (!q) return;
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history = history.filter(h => h.query.toLowerCase() !== q.toLowerCase());
        localStorage.setItem('searchHistory', JSON.stringify(history));
        loadHistory();
    }
});

clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all search history?')) return;
    localStorage.removeItem('searchHistory');
    loadHistory();
});

// Always load history list on page load
loadHistory();












