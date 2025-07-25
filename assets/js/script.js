'use strict';

// Load sidebar function
async function loadSidebar() {
  try {
    const response = await fetch('./sidebar.html');
    const sidebarHTML = await response.text();
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
      sidebarContainer.innerHTML = sidebarHTML;
      
      // Reinitialize sidebar functionality after loading
      initializeSidebar();
    }
  } catch (error) {
    console.error('Error loading sidebar:', error);
  }
}

// Initialize sidebar functionality
function initializeSidebar() {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener("click", function () { 
      elementToggleFunc(sidebar); 
    });
  }
}

// Initialize all page functionality
function initializePageFunctionality() {
  initializeTestimonials();
  initializePortfolioFilters();
  initializeContactForm();
}

// Initialize testimonials functionality
function initializeTestimonials() {
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  if (testimonialsItem.length > 0 && modalContainer) {
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
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    }
    if (overlay) {
      overlay.addEventListener("click", testimonialsModalFunc);
    }
  }
}

// Initialize portfolio filters functionality
function initializePortfolioFilters() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  if (select && selectItems.length > 0) {
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

  // filter function
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
        if (selectValue) {
          selectValue.innerText = this.innerText;
        }
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    }
  }
}

// Initialize contact form functionality
function initializeContactForm() {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  if (form && formInputs.length > 0 && formBtn) {
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
  }
}

// Load sidebar and initialize functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadSidebar();
  initializePageFunctionality();
});

// element toggle function
const elementToggleFunc = function (elem) { 
  if (elem) {
    elem.classList.toggle("active"); 
  }
}