const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
console.log("on product page, id=", productId);

if (!productId) {
  console.warn('No product id provided in query string.');
}

fetch(`https://dummyjson.com/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    console.log("Product details:", product);

    // basic info (guard elements)
    const titleEl = document.getElementById("title");
    const thumbEl = document.getElementById("thumbnail");
    const priceEl = document.getElementById("price");
    const descEl = document.getElementById("description");
    const availEl = document.getElementById("availability");

    if (titleEl) titleEl.innerText = product.title || 'Unknown product';
    if (thumbEl && product.thumbnail) thumbEl.src = product.thumbnail;
    if (priceEl) priceEl.innerText = product.price ? `💸${product.price}` : 'Price not available';
    if (descEl) descEl.innerText = product.description || '';
    if (availEl) availEl.innerText = product.availabilityStatus || 'Unknown';

    const details = document.getElementById("details");
    if (details) {
      details.innerHTML = `
      <li><b>Category:</b> ${product.category || 'n/a'}</li>
      <li><b>Rating:</b> ${product.rating ?? 'n/a'}</li>
      <li><b>Stock:</b> ${product.stock ?? 'n/a'}</li>
      <li><b>Discount:</b> ${product.discountPercentage ?? 'n/a'}</li>
      <li><b>Brand:</b> ${product.brand || 'n/a'}</li>
      `;
    }

    // tags (dummyjson may not provide tags)
    const tagsDiv = document.getElementById("tags");
    if (tagsDiv) {
      tagsDiv.innerHTML = "";
      if (Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          const span = document.createElement("span");
          span.className = "tag";
          span.innerText = tag;
          tagsDiv.appendChild(span);
        });
      } else if (product.category) {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerText = product.category;
        tagsDiv.appendChild(span);
      }
    }
  })
  .catch(err => {
    console.error('Failed to load product details', err);
  });
