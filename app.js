const STORAGE_KEY = "hostel_inventory_items";

const form = document.getElementById("item-form");
const tableBody = document.getElementById("inventory-body");
const rowTemplate = document.getElementById("row-template");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const statsNode = document.getElementById("stats");

let items = loadItems();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    id: crypto.randomUUID(),
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value,
    quantity: Number.parseInt(document.getElementById("quantity").value, 10),
    issued: 0,
    location: document.getElementById("location").value.trim() || "Not set"
  };

  if (!item.name || item.quantity < 1) {
    return;
  }

  items.push(item);
  saveItems();
  form.reset();
  document.getElementById("quantity").value = 1;
  render();
});

searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [
      { id: crypto.randomUUID(), name: "Football", category: "Sports", quantity: 8, issued: 2, location: "Sports Room" },
      { id: crypto.randomUUID(), name: "Dumbbell Set", category: "Gym", quantity: 12, issued: 4, location: "Gym Hall" },
      { id: crypto.randomUUID(), name: "Data Structures", category: "Books", quantity: 15, issued: 6, location: "Library Shelf B" },
      { id: crypto.randomUUID(), name: "Study Table", category: "Furniture", quantity: 30, issued: 3, location: "Hostel Block C" }
    ];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
  tableBody.innerHTML = "";

  const search = searchInput.value.trim().toLowerCase();
  const filter = categoryFilter.value;

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search) || item.location.toLowerCase().includes(search);
    const matchesCategory = filter === "All" || item.category === filter;
    return matchesSearch && matchesCategory;
  });

  filtered.forEach((item) => {
    const fragment = rowTemplate.content.cloneNode(true);
    const row = fragment.querySelector("tr");

    row.querySelector(".item-name").textContent = item.name;
    row.querySelector(".item-category").textContent = item.category;
    row.querySelector(".item-available").textContent = String(item.quantity - item.issued);
    row.querySelector(".item-issued").textContent = String(item.issued);
    row.querySelector(".item-location").textContent = item.location;

    const issueBtn = row.querySelector(".issue");
    const returnBtn = row.querySelector(".return");
    const deleteBtn = row.querySelector(".delete");

    issueBtn.disabled = item.issued >= item.quantity;
    returnBtn.disabled = item.issued <= 0;

    issueBtn.addEventListener("click", () => adjustIssued(item.id, 1));
    returnBtn.addEventListener("click", () => adjustIssued(item.id, -1));
    deleteBtn.addEventListener("click", () => removeItem(item.id));

    tableBody.appendChild(fragment);
  });

  renderStats(filtered);
}

function adjustIssued(id, delta) {
  items = items.map((item) => {
    if (item.id !== id) {
      return item;
    }

    const nextIssued = item.issued + delta;
    if (nextIssued < 0 || nextIssued > item.quantity) {
      return item;
    }

    return { ...item, issued: nextIssued };
  });

  saveItems();
  render();
}

function removeItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  render();
}

function renderStats(list) {
  const totals = list.reduce(
    (acc, item) => {
      acc.total += item.quantity;
      acc.issued += item.issued;
      return acc;
    },
    { total: 0, issued: 0 }
  );

  const available = totals.total - totals.issued;
  statsNode.innerHTML = `
    <span>Items: ${list.length}</span>
    <span>Total Units: ${totals.total}</span>
    <span>Issued: ${totals.issued}</span>
    <span>Available: ${available}</span>
  `;
}

saveItems();
