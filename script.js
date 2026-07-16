// ==============================
// Category Tabs
// ==============================
const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");
const grid = document.querySelector(".services-grid");
let currentCategory = "bath";

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    grid.classList.add("changing");

    setTimeout(() => {
      currentCategory = tab.dataset.category;

      const category = tab.dataset.category;

      cards.forEach((card) => {
        card.style.display =
          card.dataset.category === category ? "flex" : "none";
      });

      grid.classList.remove("changing");
    }, 250);
  });
});

// Show Bath services initially
cards.forEach((card) => {
  if (card.dataset.category !== "bath") {
    card.style.display = "none";
  }
});

// ==============================
// Search
// ==============================
const search = document.getElementById("search");

search.addEventListener("input", () => {
  const value = search.value.trim().toLowerCase();

  cards.forEach((card) => {
    const service = card.dataset.name.toLowerCase();

    // If search is empty, show only the current tab
    if (value === "") {
      card.style.display =
        card.dataset.category === currentCategory ? "flex" : "none";
    }
    // Otherwise, filter by search text
    else {
      if (service.includes(value)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });
});

// ==============================
// Appointment Summary
// ==============================

const appointmentList = document.getElementById("appointment-list");
const totalPrice = document.getElementById("total-price");
const emptyMessage = document.getElementById("empty-message");

let total = 0;

const selectedServices = new Set();


// ==============================
// Book Appointment
// ==============================

const bookButton = document.getElementById("book-btn");
bookButton.addEventListener("click", () => {
  if (selectedServices.size === 0) {
    alert("Please select at least one service.");
    return;
  }

  const services = [...selectedServices].join(", ");

  alert(`Appointment Booked!

    Services:
    ${services}

    Total: ₹${total}`);

  // Clear appointment list
  appointmentList.innerHTML = "";

  // Reset total
  total = 0;
  totalPrice.textContent = "₹0";

  // Clear selected services
  selectedServices.clear();

  // Show empty message
  emptyMessage.style.display = "block";

  // Reset all Add Service buttons
  document.querySelectorAll(".add-service").forEach((button) => {
    button.disabled = false;
    button.textContent = "Add Service";
  });

  // Optional: Clear the search box
  search.value = "";

  // Show only the current tab again
  cards.forEach((card) => {
    card.style.display =
      card.dataset.category === currentCategory ? "flex" : "none";
  });
});
