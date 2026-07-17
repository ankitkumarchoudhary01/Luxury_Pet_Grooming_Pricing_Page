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
      logAnalytics(`User selected "${currentCategory}" category`);

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

function sanitizeInput(value) {
  const div = document.createElement("div");
  div.textContent = value.trim();
  return div.innerHTML;
}

const search = document.getElementById("search");
const noResults = document.getElementById("no-results");

search.addEventListener("input", () => {
  const value = sanitizeInput(search.value).toLowerCase();
  let visibleCards = 0;

  cards.forEach((card) => {
    const service =
      card.dataset.name.toLowerCase() || card.dataset.description.toLowerCase();

    if (value === "") {
      if (card.dataset.category === currentCategory) {
        card.style.display = "flex";
        visibleCards++;
      } else {
        card.style.display = "none";
      }
    } else {
      const searchableText = `
    ${card.dataset.name}
    ${card.dataset.description}
`.toLowerCase();

      if (searchableText.includes(value)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });

  noResults.style.display = visibleCards === 0 ? "block" : "none";

  logAnalytics(`User searched for "${search.value.trim()}"`);
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
// Add Service
// ==============================

document.querySelectorAll(".add-service").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");

    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    if (selectedServices.has(name)) {
      alert("Service already added.");
      return;
    }

    selectedServices.add(name);

    button.textContent = "Added";
    button.disabled = true;

    emptyMessage.style.display = "none";

    const li = document.createElement("li");

    li.dataset.name = name;
    li.dataset.price = price;

    li.innerHTML = `
            <span>${name}</span>

            <div>

                ₹${price}

                <button class="remove-btn">
                    ✕
                </button>

            </div>
        `;

    appointmentList.appendChild(li);

    total += price;

    totalPrice.textContent = `₹${total}`;
  });
  logAnalytics(`User added "${selectedServices}" to appointment`);
});

// ==============================
// Remove Service
// ==============================

appointmentList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-btn")) return;

  const item = e.target.closest("li");

  const name = item.dataset.name;
  const price = Number(item.dataset.price);

  selectedServices.delete(name);

  total -= price;

  totalPrice.textContent = `₹${total}`;

  item.remove();

  const card = document.querySelector(`.card[data-name="${name}"]`);

  const button = card.querySelector(".add-service");

  button.disabled = false;
  button.textContent = "Add Service";

  if (appointmentList.children.length === 0) {
    emptyMessage.style.display = "block";
  }
  logAnalytics(`User removed "${selectedServices}" from appointment`);
});

// ==============================
// Book Appointment
// ==============================

const bookButton = document.getElementById("book-btn");
bookButton.addEventListener("click", () => {
  const ownerName = sanitizeInput(document.getElementById("owner-name").value);

  const petName = sanitizeInput(document.getElementById("pet-name").value);

  const petType = document.getElementById("pet-type").value;

  const appointmentDate = document.getElementById("appointment-date").value;

  const appointmentTime = document.getElementById("appointment-time").value;

  const notes = sanitizeInput(document.getElementById("notes").value);
  //correct it/

  console.log({
    ownerName,
    petName,
    petType,
    appointmentDate,
    appointmentTime,
    notes,
  });
  if (
    !ownerName ||
    !petName ||
    !petType ||
    !appointmentDate ||
    !appointmentTime
  ) {
    alert("Please fill in all booking details.");
    return;
  }

  const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const now = new Date();

  if (selectedDateTime < now) {
    alert("Please select a future date and time.");
    return;
  }

  if (selectedServices.size === 0) {
    alert("Please select at least one service.");
    return;
  }

  const services = [...selectedServices].join(", ");

  alert(`
Appointment Booked Successfully!

Owner: ${ownerName}
Pet: ${petName}
Pet Type: ${petType}

Date: ${appointmentDate}
Time: ${appointmentTime}

Services:
${[...selectedServices].join("\n")}

Total: ₹${total}

Notes:
${notes || "None"}
`);
  // Reset form fields
  document.getElementById("owner-name").value = "";
  document.getElementById("pet-name").value = "";
  document.getElementById("pet-type").selectedIndex = 0;
  document.getElementById("appointment-date").value = "";
  document.getElementById("appointment-time").value = "";
  document.getElementById("notes").value = "";

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
  logAnalytics(
    "User completed booking on Luxury Pet Grooming Salon Pricing Page",
  );
});

// ==============================
// Logs
// ==============================

function logAnalytics(action) {
  console.log(`[Analytics] ${action}`);
}

// ==============================
// Loader for Services (to be used if fetching services from an API)
// ==============================

/*

const loader = document.getElementById("loader");

function showLoader(message = "Loading...") {
    loader.querySelector("p").textContent = message;
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}


or


const loader = document.getElementById("loader");
const servicesGrid = document.querySelector(".services-grid");

async function loadServices(category) {
    loader.classList.remove("hidden");

    try {
        const response = await fetch(`/api/services?category=${category}`);

        if (!response.ok) {
            throw new Error("Failed to load services.");
        }

        const services = await response.json();

        renderServices(services);
    } catch (error) {
        servicesGrid.innerHTML = `
            <p class="error">Unable to load services. Please try again.</p>
        `;
    } finally {
        loader.classList.add("hidden");
    }
}

*/
