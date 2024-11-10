<template>
  <div class="poster-section">
    <div
      class="background-layer"
      :style="{
        backgroundImage: `url(${
          event?.images?.images[0]?.original_url || '/images/noimage.png'
        })`,
      }"
    ></div>

    <div class="poster d-flex justify-content-center align-items-center">
      <img
        :src="event?.images?.images[0]?.original_url || '/images/noimage.png'"
        class="img-fluid shadow-lg rounded poster-img"
        alt="Event Poster"
      />
    </div>
    <hr class="custom-hr" />
  </div>

  <div class="container justify-content-center gap-4 mb-4 poster-content">
    <div class="card w-100" :class="isDarkMode ? 'dark' : 'light'">
      <!-- Event Details -->
      <div class="container mt-4 text-center event-details">
        <h2 class="event-title" :class="{ lighttext: isDarkMode }">
          {{ event?.name || "Event Title" }}
        </h2>
        <div class="d-block justify-content-center gap-5 text-muted">
          <p class="h5">
            <i class="fa fa-calendar"></i>
            {{ event?.datetime_summary || "November 30, 2024" }}
          </p>
          <p class="h5">
            <i class="fa fa-clock"></i> {{ event?.time || "6:00 PM" }}
          </p>
          <p class="h5">
            <i class="fa fa-map-marker"></i> {{ event?.location_summary }}
          </p>
        </div>
      </div>

      <div class="card-body d-flex row">
        <!-- About Section -->
        <div class="about-section col-8 p-3" :class="{ lighttext: isDarkMode }">
          <h5>About:</h5>
          <p>
            {{ event?.description || "Detailed event description goes here." }}
          </p>
        </div>

        <!-- Price Section -->
        <div class="price-section col-4 text-center p-3">
          <h4 class="text-success">Price: {{ event?.price || "$50.00" }}</h4>
          <button
            @click="handleTicketPurchase"
            class="btn btn-success btn-lg animate-pulse"
          >
            Get Tickets
          </button>
          <div class="marketplace mt-3">
            <router-link to="/marketplace">
              <button class="btn btn-outline-primary btn-lg">
                See Resale Price
              </button>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content animate-fade-in">
          <h5>Login Required</h5>
          <p class="text-muted">{{ errorMessage }}</p>
          <div class="modal-actions">
            <button @click="closeModal" class="btn btn-primary">
              Go to Login
            </button>
            <button @click="showModal = false" class="btn btn-close">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Location Map Section -->
      <div
        class="container m-4 location-map col-12"
        :class="{ lighttext: isDarkMode }"
      >
        <h5>Location:</h5>
        <div
          id="map"
          class="rounded shadow"
          style="width: 96%; height: 300px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { useEventStore } from "@/stores/eventStore";
import { useCartStore } from "@/stores/cartStore";
import { inject } from "vue";
import anime from "animejs/lib/anime.es.js";

const isDarkMode = inject("isDarkMode");
const route = useRoute();
const router = useRouter();
const eventId = route.params.id;
const eventStore = useEventStore();
const loading = ref(true);
const googleMapsLoaded = ref(false);
const errorMessage = ref("");
const showModal = ref(false); // Track modal visibility

const auth = getAuth();
const isLoggedIn = ref(false); // Track login status

onMounted(async () => {
  await eventStore.loadEvents();
  eventStore.selectEventById(eventId);
  loading.value = false;

  // Check authentication status
  auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user; // Set isLoggedIn to true if user is logged in
  });

  // Initialize map with the event location after loading event details
  if (event.value && event.value.location?.point) {
    loadGoogleMaps();
  }
  anime({
    targets: ".poster-section",
    scale: [0.9, 1],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1500,
  });

  anime({
    targets: ".poster-content",
    scale: [0.95, 1],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1500,
    delay: 1000
  });

  anime({
    targets:
      ".event-title, .event-details p, .about-section,.price-section,.location-map",
    translateY: [20, 0],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 10000,
    delay: anime.stagger(200, { start: 1900 }),
  });
});

const event = computed(() => eventStore.selectedEvent);

// Load Google Maps dynamically
function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Check if the Google Maps script is already loaded
  if (
    document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js?key=${apiKey}"]`
    )
  ) {
    if (!googleMapsLoaded.value) {
      initMap();
    }
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.async = true;
  script.defer = true;
  window.initMap = initMap;
  document.head.appendChild(script);
  googleMapsLoaded.value = true;
}

async function initMap() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { lat, lng } = event.value.location.point;
  const location = { lat, lng };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 15,
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
  });

  const marker = new AdvancedMarkerElement({
    map,
    position: location,
  });
}

const cartStore = useCartStore();

function handleTicketPurchase() {
  if (!isLoggedIn.value) {
    errorMessage.value = "Please log in to purchase tickets."; // Set error message if user is not logged in
    showModal.value = true; // Show modal
  } else {
    addToCart();
    errorMessage.value = ""; // Clear error message if user is logged in
    router.push("/payment"); // Navigate to payment page
  }
}

function closeModal() {
  showModal.value = false; // Close the modal
  router.push("/login"); // Redirect to login page
}

function addToCart() {
  if (event.value) {
    cartStore.addEventToCart(event.value);
  }
}
</script>

<style scoped>
/* General Styling */

.poster-section {
  position: relative;
  overflow: hidden;
  height: 500px;
}

/* Background Layer with Blur and Overlay */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80%;
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.4);
  mix-blend-mode: darken;
}

.poster {
  position: relative;
  z-index: 2;
}

.poster-img {
  max-height: 400px;
  height: fit-content;
  border-radius: 10px;
}

.custom-hr {
  border: 1px solid #ddd;
  width: 80%;
  margin: 20px auto;
}

@media (max-width: 575px) {
  .poster-section {
    height: 40vh; /* Full viewport height */
  }

  .background-layer {
    height: 100%;
    filter: blur(0);
    background-size: cover;
    background-position: center;
  }
  .poster {
    display: none;
  }

  .poster-img {
    display: none;
  }
}

.card.light {
  background-color: whitesmoke;
  border-radius: 10px;
  box-shadow: 7px 2px 10px #b7765c;
}
.card.dark {
  background-color: black;
  border-radius: 10px;
  box-shadow: 7px 2px 10px #b7765c;
}

.lighttext {
  color: white;
}

.card-body {
  margin: auto;
  width: 100%;
}

.event-title {
  font-size: 3em;
  font-weight: bold;
  animation: fade-in 1.5s ease-in-out;
}

.about-section {
  margin: auto;
}

.text-muted {
  font-size: 0.9em;
  color: #6c757d !important;
}

.pricing-section .price-info {
  background-color: #f9f9f9;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

.btn-success {
  background-color: #2c685e !important;
}

.text-success {
  color: #2c685e !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fade-in 0.5s;
}

.modal-actions button {
  margin-top: 10px;
}

.modal-content .btn-close {
  background-color: #ccc;
}

.modal-content .btn-close:hover {
  background-color: #bbb;
}

/* Map Section */
.location-map {
  margin-top: 1.5rem;
  margin: auto;
}

#map {
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animations */
/* @keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
} */
</style>
