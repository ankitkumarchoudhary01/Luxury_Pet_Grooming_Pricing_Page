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

                <button class="remove-btn" aria-label="Remove ${name} from appointment">
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
// ==============================
// Validation Helpers
// ==============================

function showError(field) {
    field.classList.add("error");
}

function clearError(field) {
    field.classList.remove("error");
}


// ==============================
// Field References
// ==============================

const ownerNameField = document.getElementById("owner-name");
const petNameField = document.getElementById("pet-name");
const petTypeField = document.getElementById("pet-type");
const dateField = document.getElementById("appointment-date");
const timeField = document.getElementById("appointment-time");
const notesField = document.getElementById("notes");

const bookButton = document.getElementById("book-btn");

// Remove error while typing
[
    ownerNameField,
    petNameField,
    petTypeField,
    dateField,
    timeField,
    notesField
].forEach(field => {

    field.addEventListener("input", () => clearError(field));
    field.addEventListener("change", () => clearError(field));

});

// Prevent selecting past dates
dateField.min = new Date().toISOString().split("T")[0];

// ==============================
// Book Appointment
// ==============================

bookButton.addEventListener("click", () => {

    // Clear previous errors
    [
        ownerNameField,
        petNameField,
        petTypeField,
        dateField,
        timeField,
        notesField
    ].forEach(clearError);

    // Read & sanitize values
    const ownerName = sanitizeInput(ownerNameField.value);
    const petName = sanitizeInput(petNameField.value);
    const petType = petTypeField.value;
    const appointmentDate = dateField.value;
    const appointmentTime = timeField.value;
    const notes = sanitizeInput(notesField.value);

    let valid = true;

    // =====================
    // Required validation
    // =====================

    if (!ownerName) {
        showError(ownerNameField);
        valid = false;
    }

    if (!petName) {
        showError(petNameField);
        valid = false;
    }

    if (!petType) {
        showError(petTypeField);
        valid = false;
    }

    if (!appointmentDate) {
        showError(dateField);
        valid = false;
    }

    if (!appointmentTime) {
        showError(timeField);
        valid = false;
    }

    if (!valid) {
        alert("Please fill all required fields.");
        return;
    }

    // =====================
    // Date & Time Validation
    // =====================

    const selectedDateTime = new Date(
        `${appointmentDate}T${appointmentTime}`
    );

    if (selectedDateTime <= new Date()) {

        showError(dateField);
        showError(timeField);

        alert("Please select a future date and time.");
        return;
    }

    // =====================
    // Service Validation
    // =====================

    if (selectedServices.size === 0) {
        alert("Please select at least one service.");
        return;
    }

    // =====================
    // Success
    // =====================

    alert(`Appointment Booked Successfully!

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

    // Analytics
    logAnalytics(
        "User completed booking on Luxury Pet Grooming Salon Pricing Page"
    );

    // =====================
    // Reset Form
    // =====================

    ownerNameField.value = "";
    petNameField.value = "";
    petTypeField.selectedIndex = 0;
    dateField.value = "";
    timeField.value = "";
    notesField.value = "";

    appointmentList.innerHTML = "";

    total = 0;
    totalPrice.textContent = "₹0";

    selectedServices.clear();

    emptyMessage.style.display = "block";

    document.querySelectorAll(".add-service").forEach(button => {
        button.disabled = false;
        button.textContent = "Add Service";
    });

    search.value = "";

    cards.forEach(card => {
        card.style.display =
            card.dataset.category === currentCategory
                ? "flex"
                : "none";
    });

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
