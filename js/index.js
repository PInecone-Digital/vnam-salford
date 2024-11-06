const menu = document.getElementById("menu_wrapper");
const menuNav = document.getElementById("menu-nav");
const details = document.getElementById("venue-details");
const coverImage = document.getElementById("cover-image");
const logoImage = document.getElementById("logo");

async function getData() {
  const response = await fetch("data/menu.json", { cache: "no-store" });
  const data = await response.json();
  let rawdetails = "";
  let rawMenuIndex = "";
  let output = "";

  // SET COVER IMAGE AND LOGO
  try {
    const cover = new Image();
    const logo = new Image();
    cover.src = "img/" + data.info[0].coverImage;
    logo.src = "img/" + data.info[0].logoImage;
    cover.onload = function () {
      coverImage.src = "img/" + data.info[0].coverImage;
    };
    cover.onerror = function () {
      coverImage.src = "img/cover-placeholder.jpg";
    };
    logo.onload = function () {
      logoImage.src = "img/" + data.info[0].logoImage;
    };
    logo.onerror = function () {
      logoImage.src = "img/logo-placeholder.png";
    };
  } catch {
    coverImage.src = "img/cover-placeholder.jpg";
    logoImage.src = "img/logo-placeholder.png";
  }

  // SET VENUE DETAILS
  rawdetails = `
  <h1 id="venue-name" class="fw-bold">${data.info[0].name}</h1>
  <p id="venue-description">${data.info[0].description}</p>
  <div id="venue-info" class="d-flex flex-row flex-wrap gap-4 row-gap-2 pb-3">
    <a href="${data.info[0].locationLink}" target="_blank" rel="noopener noreferrer" class="text-muted">
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" />
        <circle cx="128" cy="104" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
        <path d="M208,104c0,72-80,128-80,128S48,176,48,104a80,80,0,0,1,160,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
    </svg>
    ${data.info[0].location}</a>
    ${
      data.info[0].website
        ? `<a href="${data.info[0].website}" target="_blank" rel="noopener noreferrer" class="text-muted">
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" />
        <line x1="96" y1="160" x2="160" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
        <path d="M112,76.11l30.06-30a48,48,0,0,1,67.88,67.88L179.88,144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
        <path d="M76.11,112l-30,30.06a48,48,0,0,0,67.88,67.88L144,179.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
    </svg>`
        : ""
    }
    ${data.info[0].website}</a>
    ${
      data.info[0].phone
        ? `<a href="tel:${data.info[0].phone}" class="text-muted">
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" />
        <path d="M164.39,145.34a8,8,0,0,1,7.59-.69l47.16,21.13a8,8,0,0,1,4.8,8.3A48.33,48.33,0,0,1,176,216,136,136,0,0,1,40,80,48.33,48.33,0,0,1,81.92,32.06a8,8,0,0,1,8.3,4.8l21.13,47.2a8,8,0,0,1-.66,7.53L89.32,117a7.93,7.93,0,0,0-.54,7.81c8.27,16.93,25.77,34.22,42.75,42.41a7.92,7.92,0,0,0,7.83-.59Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
    </svg>
    ${data.info[0].phone}</a>
  </div>`
        : ""
    }
  `;

  details.innerHTML = rawdetails;

  // Function to format prices
  const formatPrices = (prices) => {
    if (!prices || prices.length === 0) return "";
    if (prices.length === 1) {
      return prices[0].price;
    } else {
      return prices.map((p) => `${p.option}: ${p.price}`).join(" - ");
    }
  };

  const formatExtras = (addition) => {
    if (!addition || addition.length === 0) return "";
    if (addition.length === 1) {
      return `${addition[0].name}: ${addition[0].price}`;
    } else {
      return addition.map((p) => `${p.name} ${p.price}`).join(" - ");
    }
  };

  const formatLabels = (labels) => {
    if (!labels || labels.length === 0) return "";
    return labels.map((label) => `<span class="badge badge-label text-uppercase me-2">${label}</span>`).join("");
  };

  // Iterate through each section
  data.menu.forEach((category) => {
    let sectionId = category.category.replace(/[^A-Z0-9]/gi, "-").toLowerCase();
    output += `
    <div class="mb-4">
      <h2 id="${sectionId}" class="font-secondary fw-bold pt-5 mb-0">${category.category}</h2>
      ${category.description ? `<p>${category.description}</p>` : ""}
    </div>
      <div class="row gy-4 mb-4">
    `;

    // SET MENU NAVBAR
    rawMenuIndex += `
    <li class="nav-item">
    <a class="nav-link text-nowrap py-3" href="#${sectionId}">${category.icon ? `${category.icon} ` : ""}${category.category}</a>
    </li>
    `;

    category.items.forEach((item) => {
      const formattedPrice = formatPrices(item.prices);
      const formattedLabels = formatLabels(item.labels);
      const formattedExtras = formatExtras(item.addition);
      output += `
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 d-flex flex-column justify-content-between cursor-pointer" 
             data-bs-toggle="modal" 
             data-bs-target="#itemModal" 
             data-bs-image="${item.imageUrl ? `/img/menu/${item.imageUrl}` : "/img/item-placeholder.png"}" 
             data-bs-name="${item.name}" 
             data-bs-description="${item.description}" 
             data-bs-price="${formattedPrice}">
            ${item.image ? `<img class="menu-item-image img-fluid mb-3" src="/img/menu/${item.imageUrl}" alt="${item.name}" loading="lazy" onError="this.onerror=null;this.src='/img/item-placeholder.png';" />` : ""}
          <div class="flex-grow-1">
            <div class="d-flex align-items-center">
              ${item.name ? `<p class="food-title mb-0 me-2">${item.name}</p>` : ""}
              ${formatLabels ? `${formattedLabels}` : ""}
            </div>
            <p class="mb-1">${formattedPrice}</p>
            <p class="food-details">${item.description}</p>
            ${formattedExtras ? `<p class="text-muted small text-uppercase mb-1">options</p><p class="food-details">${formattedExtras}</p>` : ""}
            ${item.notes ? `<p class="food-details">${item.notes}</p>` : ""}
          </div>
        </div>
      `;
    });
    output += `</div>`;
  });

  menuNav.innerHTML = rawMenuIndex;
  menu.innerHTML = output;
}

getData();

// Get the dynamic modal stuff
const itemModal = document.getElementById("itemModal");
itemModal.addEventListener("show.bs.modal", function (event) {
  let data = event.relatedTarget;

  let image = data.getAttribute("data-bs-image");
  let name = data.getAttribute("data-bs-name");
  let price = data.getAttribute("data-bs-price");
  let description = data.getAttribute("data-bs-description");

  let modalImage = itemModal.querySelector("#modalFoodImage");
  let modalTitle = itemModal.querySelector("#modalFoodTitle");
  let modalPrice = itemModal.querySelector("#modalFoodPrice");
  let modalDescription = itemModal.querySelector("#modalFoodDescription");

  modalImage.src = image;
  modalTitle.innerHTML = name;
  modalPrice.innerHTML = price;
  modalDescription.innerHTML = description;
});
