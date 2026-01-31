document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('historyList');
  const clearBtn = document.getElementById('clearHistory');

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render() {
    const history = JSON.parse(localStorage.getItem('viewHistory')) || [];
    if (!list) return;
    list.innerHTML = '';

    if (history.length === 0) {
      list.innerHTML = '<p>No viewed products yet.</p>';
      return;
    }

    history.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';

      card.innerHTML = `
        <img src="${escapeHtml(item.thumbnail || '')}" alt="${escapeHtml(item.title)}" />
        <div class="history-meta">
          <div class="title"><a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></div>
          <div class="time">${new Date(item.time).toLocaleString()}</div>
        </div>
        <div class="history-actions">
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      `;

      list.appendChild(card);
    });
  }

  // Remove single entry
  list && list.addEventListener('click', (e) => {
    if (e.target.matches('.remove-btn')) {
      const id = e.target.getAttribute('data-id');
      try {
        let history = JSON.parse(localStorage.getItem('viewHistory')) || [];
        history = history.filter(h => String(h.id) !== String(id));
        localStorage.setItem('viewHistory', JSON.stringify(history));
        render();
      } catch (err) { console.error(err); }
    }
  });

  // Clear all
  clearBtn && clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all viewed product history?')) return;
    localStorage.removeItem('viewHistory');
    render();
  });

  render();
});