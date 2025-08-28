// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_-HbKHMUbNiX6pvw5d9t73oqTvFjp7Co",
  authDomain: "restaurant-896d0.firebaseapp.com",
  projectId: "restaurant-896d0",
  storageBucket: "restaurant-896d0.firebasestorage.app",
  messagingSenderId: "1037108801190",
  appId: "1:1037108801190:web:9a2308dc0cb53b29854e67",
  measurementId: "G-ESNJW4VC0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

class Index {
  constructor() {
    this.initMenuFilter();
    this.initOrderPopup();
  }

  initMenuFilter() {
    // Example: Isotope filter for menu
    if (window.$ && $('.filters_menu').length) {
      var $grid = $('.grid').isotope({
        itemSelector: '.all',
        layoutMode: 'fitRows'
      });
      $('.filters_menu li').on('click', function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
      });
    }
  }

  initOrderPopup() {
    document.body.addEventListener('click', function(e) {
      // Order Now buttons
      if (e.target.closest('.btn1') || e.target.closest('.order_online') || (e.target.closest('.options a') && e.target.closest('.options a').innerText.trim().toLowerCase().includes('order'))) {
        e.preventDefault();
        $('#orderModal').modal('show');
      }
    });
  }
}

class Book {
  constructor() {
    // Example: booking form logic
    this.initBookingForm();
    // Add other book page logic here
  }

  initBookingForm() {
    // Example: handle booking form submit
    const form = document.querySelector('.form_container form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add booking logic here (e.g., validation, AJAX)
        alert('Booking submitted!');
      });
    }
  }
}
