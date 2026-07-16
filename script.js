// ==============================
// Category Tabs
// ==============================

const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn => btn.classList.remove("active"));
        tab.classList.add("active");

        const category = tab.dataset.category;

        cards.forEach(card => {

            if (card.dataset.category === category) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });

    });

});

// Show Bath services initially
cards.forEach(card => {

    if (card.dataset.category !== "bath") {
        card.style.display = "none";
    }

});


// ==============================
// Search
// ==============================

const search = document.getElementById("search");

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    cards.forEach(card => {

        const service = card.dataset.name.toLowerCase();

        if (service.includes(value)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
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
// Add Service
// ==============================

document.querySelectorAll(".add-service").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".card");

        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        if (selectedServices.has(name)) {

            alert("Service already added.");
            return;

        }

        selectedServices.add(name);

        button.textContent = "Added ✓";
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

    const card = document.querySelector(
        `.card[data-name="${name}"]`
    );

    const button = card.querySelector(".add-service");

    button.disabled = false;
    button.textContent = "Add Service";

    if (appointmentList.children.length === 0) {

        emptyMessage.style.display = "block";

    }

});


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

    alert(
`Appointment Booked!

Services:
${services}

Total: ₹${total}`
    );

});