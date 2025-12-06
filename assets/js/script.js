'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Wait for DOM to be fully loaded
// function to handle initialization
function initScript() {
  console.log("Initializing script...");

  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
  }



  // testimonials variables - check if elements exist
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // Only run testimonials functionality if elements exist
  if (testimonialsItem.length > 0 && modalContainer && modalCloseBtn && overlay) {
    // modal variable
    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");

    // modal toggle function
    const testimonialsModalFunc = function () {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }

    // add click event to all modal items
    for (let i = 0; i < testimonialsItem.length; i++) {

      testimonialsItem[i].addEventListener("click", function () {

        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

        testimonialsModalFunc();

      });

    }

    // add click event to modal close button
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    overlay.addEventListener("click", testimonialsModalFunc);
  }



  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });

    // add event in all select items
    for (let i = 0; i < selectItems.length; i++) {
      selectItems[i].addEventListener("click", function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

      });
    }
  }

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {

    for (let i = 0; i < filterItems.length; i++) {

      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }

    }

  }

  // add event in all filter button items for large screen
  if (filterBtn.length > 0) {
    let lastClickedBtn = filterBtn[0];

    for (let i = 0; i < filterBtn.length; i++) {

      filterBtn[i].addEventListener("click", function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;

      });

    }
  }



  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  // add event to all form input field
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }


  // Share Button Functionality
  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link: ", err);
      }
    });
  }



  // Page navigation variables
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const pageArticles = document.querySelectorAll("[data-page]");

  // Function to activate a specific page
  function activatePage(pageName) {
    // Normalize page name
    const targetPage = pageName.toLowerCase().trim();

    // Check if target page exists in DOM before switching
    const targetExists = Array.from(pageArticles).some(page => page.dataset.page === targetPage);
    if (!targetExists) return;

    // Remove active class from all nav links
    navLinks.forEach(nav => {
      if (nav.textContent.toLowerCase().trim() === targetPage) {
        nav.classList.add("active");
      } else {
        nav.classList.remove("active");
      }
    });

    // Remove active class from all pages and activate target
    let pageFound = false;
    pageArticles.forEach(page => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        pageFound = true;
      } else {
        page.classList.remove("active");
      }
    });

    if (pageFound) {
      window.scrollTo(0, 0);
    }
  }

  // Add click event to navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetPage = this.textContent.toLowerCase().trim();

      // Update URL history
      history.pushState({ page: targetPage }, "", `#${targetPage}`);
      activatePage(targetPage);
    });
  });

  // Handle Back/Forward buttons
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.page) {
      activatePage(event.state.page);
    } else {
      // Fallback: check hash or default to 'about'
      const hash = window.location.hash.substring(1);
      if (hash) {
        activatePage(hash);
      } else {
        activatePage("about");
      }
    }
  });

  // Handle Initial Load (Deep Linking)
  const hash = window.location.hash.substring(1);
  console.log("Current hash:", hash);
  if (hash) {
    activatePage(hash);
  } else {
    console.log("No hash, defaulting to about");
    activatePage("about");
  }

} // End of initScript

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScript);
} else {
  initScript();
}