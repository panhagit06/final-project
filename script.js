document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu")
  const mobileNav = document.getElementById("mobile-nav")
  const navLinks = mobileNav.querySelectorAll("a") // This selects links in the mobile nav
  const desktopNavLinks = document.querySelectorAll(".desktop-nav a") // Select desktop nav links too
  const cartIcon = document.getElementById("cart-icon")
  const cartDropdown = document.getElementById("cart-dropdown")
  const cartCounter = document.getElementById("cart-counter")
  const cartItemsList = document.getElementById("cart-items")
  const cartTotalSpan = document.getElementById("cart-total")
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
  const heroShopNowBtn = document.querySelector(".hero-section .primary-btn")
  const contactForm = document.getElementById("contact-form")

  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // --- Helper Functions ---

  function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCounter.textContent = totalItems
    cartCounter.style.display = totalItems > 0 ? "flex" : "none" // Show/hide counter
  }

  function renderCartDropdown() {
    cartItemsList.innerHTML = "" // Clear existing items
    let total = 0

    if (cart.length === 0) {
      const emptyMessage = document.createElement("li")
      emptyMessage.classList.add("empty-cart-message")
      emptyMessage.textContent = "Your cart is empty."
      cartItemsList.appendChild(emptyMessage)
    } else {
      cart.forEach((item) => {
        const listItem = document.createElement("li")
        listItem.innerHTML = `
          <span class="item-name">${item.name} (x${item.quantity})</span>
          <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        `
        cartItemsList.appendChild(listItem)
        total += item.price * item.quantity
      })
    }
    cartTotalSpan.textContent = total.toFixed(2)
  }

  function toggleMobileNav() {
    mobileNav.classList.toggle("active")
    hamburgerMenu.classList.toggle("open") // Optional: for hamburger animation
    // Close cart dropdown if open when mobile nav is toggled
    if (cartDropdown.classList.contains("active")) {
      cartDropdown.classList.remove("active")
    }
  }

  function toggleCartDropdown() {
    cartDropdown.classList.toggle("active")
    renderCartDropdown() // Re-render cart content every time it's opened
    // Close mobile nav if open when cart dropdown is toggled
    if (mobileNav.classList.contains("active")) {
      mobileNav.classList.remove("active")
      hamburgerMenu.classList.remove("open")
    }
  }

  function closeAllDropdowns(event) {
    // Close mobile nav if clicking outside
    if (
      mobileNav.classList.contains("active") &&
      !mobileNav.contains(event.target) &&
      !hamburgerMenu.contains(event.target)
    ) {
      toggleMobileNav()
    }

    // Close cart dropdown if clicking outside
    if (
      cartDropdown.classList.contains("active") &&
      !cartDropdown.contains(event.target) &&
      !cartIcon.contains(event.target)
    ) {
      cartDropdown.classList.remove("active")
    }
  }

  function validateForm(event) {
    event.preventDefault() // Prevent default form submission

    let isValid = true
    const nameInput = document.getElementById("name")
    const emailInput = document.getElementById("email")
    const messageInput = document.getElementById("message")

    const nameError = document.getElementById("name-error")
    const emailError = document.getElementById("email-error")
    const messageError = document.getElementById("message-error")
    const formSuccess = document.getElementById("form-success")

    // Clear previous errors and success message
    nameError.style.display = "none"
    emailError.style.display = "none"
    messageError.style.display = "none"
    formSuccess.style.display = "none"

    // Validate Name
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Name is required."
      nameError.style.display = "block"
      isValid = false
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailInput.value.trim() === "") {
      emailError.textContent = "Email is required."
      emailError.style.display = "block"
      isValid = false
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address."
      emailError.style.display = "block"
      isValid = false
    }

    // Validate Message
    if (messageInput.value.trim() === "") {
      messageError.textContent = "Message is required."
      messageError.style.display = "block"
      isValid = false
    }

    if (isValid) {
      // In a real application, you would send this data to a server
      console.log("Form submitted:", {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
      })
      formSuccess.textContent = "Message sent successfully! We'll get back to you soon."
      formSuccess.style.display = "block"
      contactForm.reset() // Clear the form
    }
  }

  // --- Event Listeners ---

  // Hamburger menu toggle
  hamburgerMenu.addEventListener("click", toggleMobileNav)

  // Function to handle smooth scrolling for any nav link
  function handleNavLinkClick(event) {
    event.preventDefault() // Prevent default jump behavior
    const targetId = event.currentTarget.getAttribute("href").substring(1) // Get the section ID
    const targetSection = document.getElementById(targetId)

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" })
    }

    // Close mobile menu if active (only relevant for mobile nav links)
    if (mobileNav.classList.contains("active")) {
      toggleMobileNav()
    }
  }

  // Apply smooth scrolling to all navigation links (desktop and mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavLinkClick)
  })
  desktopNavLinks.forEach((link) => {
    link.addEventListener("click", handleNavLinkClick)
  })

  // Cart icon toggle
  cartIcon.addEventListener("click", toggleCartDropdown)

  // Close all dropdowns when clicking outside
  document.addEventListener("click", closeAllDropdowns)

  // Add to Cart functionality
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card")
      const productId = productCard.dataset.id
      const productName = productCard.dataset.name
      const productPrice = Number.parseFloat(productCard.dataset.price)
      const productImage = productCard.dataset.image

      const existingItem = cart.find((item) => item.id === productId)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        })
      }

      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCounter()
      renderCartDropdown() // Update dropdown immediately
      // Optionally, show a brief confirmation message
      alert(`${productName} added to cart!`)
    })
  })

  // Hero "Shop Now" button scroll
  heroShopNowBtn.addEventListener("click", (event) => {
    event.preventDefault()
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" })
  })

  // Contact form validation
  contactForm.addEventListener("submit", validateForm)

  // --- Initial Load ---
  updateCartCounter() // Set initial cart count on page load
  renderCartDropdown() // Render initial cart dropdown state
})
