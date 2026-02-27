# Hostel Inventory Manager

A lightweight web app to manage hostel inventory such as sports items, gym equipment, books, furniture, and other assets.

## Features

- Add inventory items with category, quantity, and location.
- Issue and return items while preventing over-issue.
- Search by item name/location and filter by category.
- Real-time summary stats for total, issued, and available units.
- Local persistence using browser `localStorage`.

## Run

Open `index.html` in a browser, or serve directory:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.
