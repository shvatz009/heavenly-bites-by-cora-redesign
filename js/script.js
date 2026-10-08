// =========================
// Mobile Navigation
// =========================

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    navigation.classList.toggle("nav-open");
  });
}

// =========================
// Close Mobile Menu
// =========================

const navigationLinks = document.querySelectorAll("nav a");

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("nav-open");
  });
});

// =========================
// Smooth Scroll
// =========================

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (targetId.startsWith("#")) {
      event.preventDefault();

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});

// =========================
// Header Shadow on Scroll
// =========================

const header = document.querySelector(".navbar");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// =========================
// Menu Filtering
// =========================

const menuFilters = document.querySelectorAll(".menu-filter");
const filterableMenuItems = document.querySelectorAll(".menu-item");

menuFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.category;
    menuFilters.forEach((button) => button.classList.remove("active"));
    filter.classList.add("active");

    filterableMenuItems.forEach((item) => {
      item.style.display =
        category === "all" || item.dataset.category === category ? "" : "none";
    });
  });
});

// =========================
// Fade-In Animation
// =========================

const animatedElements = document.querySelectorAll(
  ".product-card, .review-grid blockquote",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

animatedElements.forEach((element) => {
  element.classList.add("fade-in");

  observer.observe(element);
});

// =========================
// Review Carousel
// =========================

const reviewsGrid = document.querySelector(".reviews-grid");
const reviewCards = reviewsGrid
  ? Array.from(reviewsGrid.querySelectorAll(".review-card"))
  : [];

if (reviewsGrid && reviewCards.length > 1) {
  reviewsGrid.classList.add("is-carousel");
  reviewsGrid.setAttribute("aria-label", "Customer reviews");

  const pauseButton = document.createElement("button");
  pauseButton.className = "review-carousel-toggle";
  pauseButton.type = "button";
  pauseButton.textContent = "Pause reviews";
  pauseButton.setAttribute("aria-pressed", "false");

  const previousButton = document.createElement("button");
  previousButton.className = "review-carousel-arrow";
  previousButton.type = "button";
  previousButton.textContent = "‹";
  previousButton.setAttribute("aria-label", "Show previous review");

  const nextButton = document.createElement("button");
  nextButton.className = "review-carousel-arrow";
  nextButton.type = "button";
  nextButton.textContent = "›";
  nextButton.setAttribute("aria-label", "Show next review");

  const carouselControls = document.createElement("div");
  carouselControls.className = "review-carousel-controls";
  carouselControls.append(previousButton, pauseButton, nextButton);
  reviewsGrid.before(carouselControls);

  let activeIndex = 0;
  let cycleTimer = 0;
  let transitionTimer = 0;
  let isPaused = false;
  let isTransitioning = false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const transitionDuration = prefersReducedMotion.matches ? 0 : 600;

  reviewCards.forEach((card, index) => {
    card.setAttribute("aria-hidden", String(index !== activeIndex));
  });

  const clearTimers = () => {
    window.clearTimeout(cycleTimer);
    window.clearTimeout(transitionTimer);
    cycleTimer = 0;
    transitionTimer = 0;
  };

  const scheduleNextReview = () => {
    if (!isPaused && !document.hidden) {
      cycleTimer = window.setTimeout(() => showReview(1), 5000);
    }
  };

  const showReview = (direction) => {
    if (isTransitioning) {
      return;
    }
    window.clearTimeout(cycleTimer);
    const currentCard = reviewCards[activeIndex];
    const nextIndex = (activeIndex + direction + reviewCards.length) % reviewCards.length;
    const nextCard = reviewCards[nextIndex];
    currentCard.classList.remove("is-active");
    currentCard.classList.add(direction > 0 ? "is-leaving-left" : "is-leaving-right");
    currentCard.setAttribute("aria-hidden", "true");
    nextCard.classList.add(direction > 0 ? "is-entering-right" : "is-entering-left");
    isTransitioning = true;
    previousButton.disabled = true;
    nextButton.disabled = true;

    transitionTimer = window.setTimeout(() => {
      currentCard.classList.remove("is-leaving-left", "is-leaving-right");
      activeIndex = nextIndex;
      nextCard.setAttribute("aria-hidden", "false");
      window.requestAnimationFrame(() => {
        nextCard.classList.remove("is-entering-left", "is-entering-right");
        nextCard.classList.add("is-active");
        transitionTimer = window.setTimeout(() => {
          isTransitioning = false;
          previousButton.disabled = false;
          nextButton.disabled = false;
          scheduleNextReview();
        }, transitionDuration);
      });
    }, transitionDuration);
  };

  const pauseReviews = () => {
    clearTimers();
    if (isTransitioning) {
      reviewCards.forEach((card, index) => {
        card.classList.remove(
          "is-active",
          "is-leaving-left",
          "is-leaving-right",
          "is-entering-left",
          "is-entering-right",
        );
        card.setAttribute("aria-hidden", String(index !== activeIndex));
      });
      reviewCards[activeIndex].classList.add("is-active");
      isTransitioning = false;
      previousButton.disabled = false;
      nextButton.disabled = false;
    }
  };

  window.requestAnimationFrame(() => {
    reviewCards[activeIndex].classList.add("is-active");
    scheduleNextReview();
  });

  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Play reviews" : "Pause reviews";
    pauseButton.setAttribute("aria-pressed", String(isPaused));
    if (isPaused) {
      pauseReviews();
    } else {
      scheduleNextReview();
    }
  });

  previousButton.addEventListener("click", () => showReview(-1));
  nextButton.addEventListener("click", () => showReview(1));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseReviews();
    } else {
      scheduleNextReview();
    }
  });
}

// =========================
// Menu Ordering
// =========================

const menuCards = document.querySelectorAll(".menu-grid .menu-item");

if (menuCards.length > 0) {
  const order = new Map();
  const modal = document.createElement("dialog");
  modal.className = "order-modal";
  modal.setAttribute("aria-labelledby", "order-modal-title");
  modal.innerHTML = `
    <form class="order-modal-content">
      <button class="order-modal-close" type="button" aria-label="Close item details">&times;</button>
      <img class="order-modal-image" alt="">
      <h2 id="order-modal-title"></h2>
      <p class="order-modal-description"></p>
      <p class="order-modal-price"></p>
      <div class="order-flavor-field" hidden>
        <label for="order-pie-flavor">Pie flavor</label>
        <select id="order-pie-flavor">
          <option value="">Select a flavor</option>
          <option value="Apple">Apple</option>
          <option value="Strawberry">Strawberry</option>
          <option value="Pumpkin">Pumpkin</option>
          <option value="Cherry">Cherry</option>
          <option value="Pecan">Pecan</option>
          <option value="Fudge">Fudge</option>
        </select>
      </div>
      <div class="order-baked-good-field" hidden>
        <label for="order-baked-good">Baked good</label>
        <select id="order-baked-good">
          <option value="">Select a baked good</option>
          <option value="Cinnamon Rolls">Cinnamon Rolls</option>
          <option value="Scones">Scones</option>
          <option value="Sweet Breads">Sweet Breads</option>
          <option value="Muffins">Muffins</option>
          <option value="Cannolis">Cannolis</option>
          <option value="Dipped Pretzels">Dipped Pretzels</option>
        </select>
      </div>
      <label class="order-quantity-label" for="order-quantity">Quantity</label>
      <input id="order-quantity" class="order-quantity" type="number" min="1" step="1" value="1" required>
      <button class="btn btn-primary order-add-button" type="submit">Add to Order</button>
    </form>
  `;
  document.body.append(modal);

  const cartButton = document.createElement("button");
  cartButton.className = "order-cart-toggle";
  cartButton.type = "button";
  cartButton.setAttribute("aria-expanded", "false");
  cartButton.setAttribute("aria-controls", "order-cart");
  document.body.append(cartButton);

  const cartPanel = document.createElement("aside");
  cartPanel.className = "order-cart";
  cartPanel.id = "order-cart";
  cartPanel.hidden = true;
  cartPanel.setAttribute("aria-label", "Shopping cart");
  cartPanel.innerHTML = `
    <div class="order-cart-header">
      <h2>Your Order</h2>
      <button class="order-cart-close" type="button" aria-label="Close cart">&times;</button>
    </div>
    <div class="order-cart-items" aria-live="polite"></div>
    <p class="order-cart-total"></p>
    <p class="order-cart-note"></p>
    <button class="order-checkout-button" type="button" disabled>Checkout Now</button>
  `;
  document.body.append(cartPanel);

  const checkoutModal = document.createElement("dialog");
  checkoutModal.className = "checkout-modal";
  checkoutModal.setAttribute("aria-labelledby", "checkout-modal-title");
  checkoutModal.innerHTML = `
    <form class="checkout-modal-content">
      <button class="checkout-modal-close" type="button" aria-label="Close checkout">&times;</button>
      <h2 id="checkout-modal-title">Online Ordering</h2>
      <fieldset class="checkout-options">
        <legend>Pickup or Delivery</legend>
        <label><input type="radio" name="fulfillment" value="pickup" checked> Pickup</label>
        <label><input type="radio" name="fulfillment" value="delivery"> Delivery</label>
      </fieldset>
      <div class="checkout-address" hidden>
        <label for="delivery-address">Delivery address</label>
        <input id="delivery-address" name="delivery-address" type="text" autocomplete="street-address" placeholder="Enter your delivery address">
      </div>
      <fieldset class="checkout-options checkout-timing">
        <legend>When would you like your order?</legend>
        <label><input type="radio" name="order-timing" value="now" checked> Order Now</label>
        <label class="schedule-pickup-option"><input type="radio" name="order-timing" value="scheduled"> Select a date and time for pickup</label>
      </fieldset>
      <div class="checkout-schedule" hidden>
        <label for="pickup-time">Pickup date and time</label>
        <input id="pickup-time" type="datetime-local">
      </div>
      <p class="checkout-message" role="status" aria-live="polite"></p>
      <button class="checkout-start-button" type="submit">Start Order</button>
    </form>
  `;
  document.body.append(checkoutModal);

  let selectedItem = null;
  const quantityInput = modal.querySelector(".order-quantity");
  const pieFlavorField = modal.querySelector(".order-flavor-field");
  const pieFlavorSelect = modal.querySelector("#order-pie-flavor");
  const bakedGoodField = modal.querySelector(".order-baked-good-field");
  const bakedGoodSelect = modal.querySelector("#order-baked-good");
  const cartItems = cartPanel.querySelector(".order-cart-items");
  const cartTotal = cartPanel.querySelector(".order-cart-total");
  const cartNote = cartPanel.querySelector(".order-cart-note");
  const checkoutForm = checkoutModal.querySelector(".checkout-modal-content");
  const pickupTimeInput = checkoutModal.querySelector("#pickup-time");
  const checkoutMessage = checkoutModal.querySelector(".checkout-message");
  const scheduleOption = checkoutModal.querySelector(".schedule-pickup-option");
  const scheduleFields = checkoutModal.querySelector(".checkout-schedule");
  const addressFields = checkoutModal.querySelector(".checkout-address");
  const addressInput = checkoutModal.querySelector("#delivery-address");

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const toLocalDateTimeValue = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const renderCart = () => {
    const entries = Array.from(order.values());
    const itemCount = entries.reduce((count, item) => count + item.quantity, 0);
    cartButton.textContent = `Cart (${itemCount})`;
    cartPanel.querySelector(".order-checkout-button").disabled = itemCount === 0;

    cartItems.replaceChildren();
    if (entries.length === 0) {
      cartItems.textContent = "Your cart is empty.";
      cartTotal.textContent = "";
      cartNote.textContent = "";
      return;
    }

    let startingTotal = 0;
    let hasUnpricedItems = false;

    entries.forEach((item) => {
      const row = document.createElement("div");
      row.className = "order-cart-item";

      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.flavor ? `${item.name} (${item.flavor})` : item.name;
      const price = document.createElement("p");
      price.textContent = item.unitPrice === null
        ? `${item.priceLabel} · Qty ${item.quantity}`
        : `${item.priceLabel} · Qty ${item.quantity}`;
      details.append(title, price);

      const removeButton = document.createElement("button");
      removeButton.className = "order-cart-remove";
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", `Remove ${item.name}${item.flavor ? ` (${item.flavor})` : ""} from order`);
      removeButton.addEventListener("click", () => {
        order.delete(item.cartKey);
        renderCart();
      });

      row.append(details, removeButton);
      cartItems.append(row);

      if (item.unitPrice === null) {
        hasUnpricedItems = true;
      } else {
        startingTotal += item.unitPrice * item.quantity;
      }
    });

    const hasStartingPrices = entries.some((item) => item.isStartingPrice);
    if (hasUnpricedItems && startingTotal === 0) {
      cartTotal.textContent = "Subtotal: To be determined";
    } else if (hasUnpricedItems) {
      cartTotal.textContent = `Known-price subtotal${hasStartingPrices ? " (starting prices)" : ""}: ${formatMoney(startingTotal)}`;
    } else {
      cartTotal.textContent = `${hasStartingPrices ? "Starting subtotal" : "Subtotal"}: ${formatMoney(startingTotal)}`;
    }

    cartNote.textContent = hasUnpricedItems
      ? "Items marked contact for pricing need a quote. The subtotal excludes those items."
      : hasStartingPrices
        ? "Starting prices are estimates; final pricing may vary."
        : "";
  };

  const openItemModal = (card) => {
    const image = card.querySelector("img");
    const name = card.querySelector("h3")?.textContent.trim() ?? "Menu item";
    const description = card.querySelector(".menu-item-content p")?.textContent.trim() ?? "";
    const priceLabel = card.querySelector(".price")?.textContent.trim().replace(/\s+/g, " ") ?? "Contact for pricing";
    const amountMatch = priceLabel.match(/\$([\d,]+(?:\.\d{1,2})?)/);
    const hasPieFlavors = Boolean(card.closest("#pies"));
    const hasBakedGoodOptions = Boolean(card.closest("#specialty")) && name === "Baked Goods";
    pieFlavorField.hidden = !hasPieFlavors;
    pieFlavorSelect.required = hasPieFlavors;
    pieFlavorSelect.value = "";
    bakedGoodField.hidden = !hasBakedGoodOptions;
    bakedGoodSelect.required = hasBakedGoodOptions;
    bakedGoodSelect.value = "";

    selectedItem = {
      name,
      description,
      imageSrc: image?.getAttribute("src") ?? "",
      imageAlt: image?.getAttribute("alt") ?? name,
      priceLabel,
      unitPrice: amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : null,
      isStartingPrice: /^starting at/i.test(priceLabel),
    };

    modal.querySelector(".order-modal-image").src = selectedItem.imageSrc;
    modal.querySelector(".order-modal-image").alt = selectedItem.imageAlt;
    modal.querySelector("#order-modal-title").textContent = name;
    modal.querySelector(".order-modal-description").textContent = description;
    modal.querySelector(".order-modal-price").textContent = priceLabel;
    quantityInput.value = "1";
    modal.showModal();
    quantityInput.focus();
  };

  menuCards.forEach((card) => {
    const content = card.querySelector(".menu-item-content");
    if (!content) {
      return;
    }

    const chooseButton = document.createElement("button");
    chooseButton.className = "menu-item-choose";
    chooseButton.type = "button";
    chooseButton.textContent = "Choose options";
    chooseButton.addEventListener("click", () => openItemModal(card));

    const actions = document.createElement("div");
    actions.className = "menu-item-actions";
    const customOrderLink = content.querySelector(".menu-item-custom-order");
    if (customOrderLink) {
      actions.append(customOrderLink);
    }
    actions.append(chooseButton);
    content.append(actions);
  });

  modal.querySelector(".order-modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  modal.querySelector(".order-modal-content").addEventListener("submit", (event) => {
    event.preventDefault();
    const quantity = Number(quantityInput.value);
    const selectionInput = pieFlavorSelect.required ? pieFlavorSelect : bakedGoodSelect.required ? bakedGoodSelect : null;
    const flavor = selectionInput?.value ?? "";
    if (!selectedItem || !Number.isSafeInteger(quantity) || quantity < 1 || (selectionInput && !flavor)) {
      if (selectionInput && !flavor) {
        selectionInput.focus();
        return;
      }
      quantityInput.focus();
      return;
    }

    const cartKey = `${selectedItem.name}::${flavor}`;
    const existingItem = order.get(cartKey);
    order.set(cartKey, {
      ...selectedItem,
      flavor,
      cartKey,
      quantity: (existingItem?.quantity ?? 0) + quantity,
    });
    renderCart();
    cartPanel.hidden = false;
    cartButton.setAttribute("aria-expanded", "true");
    modal.close();
  });

  cartButton.addEventListener("click", () => {
    cartPanel.hidden = !cartPanel.hidden;
    cartButton.setAttribute("aria-expanded", String(!cartPanel.hidden));
  });

  cartPanel.querySelector(".order-cart-close").addEventListener("click", () => {
    cartPanel.hidden = true;
    cartButton.setAttribute("aria-expanded", "false");
    cartButton.focus();
  });

  const updateCheckoutOptions = () => {
    const isPickup = checkoutForm.querySelector('input[name="fulfillment"]:checked').value === "pickup";
    addressFields.hidden = isPickup;
    addressInput.required = !isPickup;
    scheduleOption.hidden = !isPickup;
    if (!isPickup) {
      checkoutForm.querySelector('input[name="order-timing"][value="now"]').checked = true;
    }

    const isScheduled =
      isPickup &&
      checkoutForm.querySelector('input[name="order-timing"]:checked').value === "scheduled";
    scheduleFields.hidden = !isScheduled;
    pickupTimeInput.required = isScheduled;
  };

  checkoutForm.querySelectorAll('input[name="fulfillment"], input[name="order-timing"]').forEach((input) => {
    input.addEventListener("change", updateCheckoutOptions);
  });

  cartPanel.querySelector(".order-checkout-button").addEventListener("click", () => {
    checkoutMessage.textContent = "";
    const earliestPickup = new Date();
    earliestPickup.setSeconds(0, 0);
    pickupTimeInput.min = toLocalDateTimeValue(earliestPickup);
    updateCheckoutOptions();
    checkoutModal.showModal();
  });

  checkoutForm.querySelector(".checkout-modal-close").addEventListener("click", () => checkoutModal.close());
  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      checkoutModal.close();
    }
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (order.size === 0) {
      checkoutMessage.textContent = "Add an item to your order before continuing.";
      return;
    }

    const fulfillment = checkoutForm.querySelector('input[name="fulfillment"]:checked').value;
    const timing = checkoutForm.querySelector('input[name="order-timing"]:checked').value;
    if (fulfillment === "pickup" && timing === "scheduled" && !pickupTimeInput.value) {
      pickupTimeInput.reportValidity();
      return;
    }

    checkoutMessage.textContent =
      "Your selections are ready, but online order submission is not connected yet. No order has been placed.";
  });

  updateCheckoutOptions();
  renderCart();
}
