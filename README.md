# Mini Product Store

A small front-end product listing demo that fetches product data from DummyJSON and provides features for browsing, searching, viewing product details, and tracking user history.

# **Made by Debaprakash Jena**

---

## Features

- Product listing with responsive grid layout and pagination
- Dynamic, in-place search with live filtering as you type
- Search suggestions based on previous searches
- Search history management (view, remove, clear)
- Viewed products history (records product pages you open)
- Product detail page with rich information and improved styling
- Modern, responsive CSS with accessible interactions

## Files & Structure

```
index.html
product.html
product.js
productDetails.css
script.js
searchHistory.html
searchHistory.js
viewHistory.html
viewHistory.js
style.css
pagination/
  ├─ pagination.css
  ├─ pagination.js
```

## Development

Requirements: a modern browser and a static file server (or VS Code Live Server).

To run locally:
1. Open the project in your editor (e.g., VS Code).
2. Start a static server (for example, use the Live Server extension or `npx http-server` in the project folder).
3. Open `http://127.0.0.1:5501/index.html` (port may vary) in the browser.

## Notes

- Product data is loaded from `https://dummyjson.com/products` and individual product endpoints (no backend required).
- Search history and view history are stored in `localStorage`.
- The product detail page accepts a query string parameter `id`, e.g.: `product.html?id=8`.

## Customization / Next Steps

- Add keyboard navigation for suggestion chips (arrow keys + Enter).
- Add a favorites system or export history feature.
- Improve accessibility attributes and tests.

## License

This demo is provided as-is for learning and prototyping.

---

If you'd like, I can add a short project screenshot into the README or add a quick deploy script.
