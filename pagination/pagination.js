document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const itemsPerPage = 8;
  let allProducts = [];

  const container = document.getElementById("productList");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");
  const firstBtn = document.getElementById("firstBtn");
  const lastBtn = document.getElementById("lastBtn");
  const pageInput = document.getElementById("pageInput");
  const goBtn = document.getElementById("goBtn");

  const productBase = window.location.pathname.includes('/pagination/') ? '../product.html' : 'product.html';

  function addToViewHistory(item) {
    try {
      let history = JSON.parse(localStorage.getItem('viewHistory')) || [];
      history = history.filter(h => h.id !== item.id);
      history.unshift(item);
      if (history.length > 50) history.length = 50;
      localStorage.setItem('viewHistory', JSON.stringify(history));
    } catch (e) {
      console.error('viewHistory error', e);
    }
  }

  if (!container) {
    console.warn('Pagination: #productList not found on page — skipping pagination init.');
    return;
  }

  fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
      allProducts = data.products || [];
      if (allProducts.length === 0) {
        container.innerHTML = "<p>No Products Available</p>";
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (pageInfo) pageInfo.innerText = "";
        return;
      }
      renderPage();
    })
    .catch(err => {
      console.error('Failed to load products', err);
      container.innerHTML = "<p>Failed to load products</p>";
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
    });

  function renderPage(){
    container.innerHTML="";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = allProducts.slice(start,end);

    pageItems.forEach(product=>{
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}"/>
        <h3>${product.title}</h3>
        <p>💲${product.price}</p>
      `;

      card.addEventListener("click", () => {
        addToViewHistory({ id: product.id, title: product.title, thumbnail: product.thumbnail, time: Date.now() });
        window.location.href = `${productBase}?id=${product.id}`;
      });
      container.appendChild(card);
    });

    const totalPages = Math.max(1, Math.ceil(allProducts.length/itemsPerPage));
    if (pageInfo) pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    // Sync page input
    if (pageInput) {
      pageInput.value = currentPage;
      pageInput.max = totalPages;
    }

    if (firstBtn) firstBtn.disabled = currentPage === 1;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (lastBtn) lastBtn.disabled = currentPage === totalPages;
  }

  if (firstBtn) firstBtn.addEventListener("click", () => {
    if (currentPage !== 1) {
      currentPage = 1;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  if (prevBtn) prevBtn.addEventListener("click", ()=>{
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      window.scrollTo({top:0,behavior:"smooth"});
    }
  });

  if (nextBtn) nextBtn.addEventListener("click", ()=>{
    const totalPages = Math.ceil(allProducts.length/itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      window.scrollTo({top:0,behavior:"smooth"});
    }
  });

  if (lastBtn) lastBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(allProducts.length/itemsPerPage);
    if (currentPage !== totalPages) {
      currentPage = totalPages;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  if (goBtn) goBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(allProducts.length/itemsPerPage);
    const requested = parseInt(pageInput && pageInput.value, 10) || 1;
    const target = Math.min(Math.max(1, requested), totalPages);
    if (target !== currentPage) {
      currentPage = target;
      renderPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  if (pageInput) pageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (goBtn) goBtn.click();
    }
  });
});

// Duplicate block removed — pagination logic is implemented above inside DOMContentLoaded
