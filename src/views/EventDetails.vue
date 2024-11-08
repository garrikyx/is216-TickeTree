<template>
  <div>
    <!-- Poster Section -->
    <div
      class="blurred-background container-fluid  d-flex justify-content-center align-items-center"
      :style="{ backgroundImage: `url(${event?.images?.images[0]?.original_url || '/images/noimage.png'})` }"
    >
      <div class="poster">
        <img
          :src="event?.images?.images[0]?.original_url || '/images/noimage.png'"
          class="img-fluid shadow-lg rounded poster-img"
          alt="Event Poster"
        />
      </div>
    </div>
    <hr class="custom-hr" />

    <!-- Event Details -->
    <div class="container mt-4 text-center event-details">
      <h2 class="event-title">{{ event?.name || "Event Title" }}</h2>
      <div class="d-block justify-content-center gap-5 text-muted">
        <p class="h5"><i class="fa fa-calendar"></i> {{ event?.datetime_summary || "November 30, 2024" }}</p>
        <p class="h5"><i class="fa fa-clock-o" ></i> {{ event?.time || "6:00 PM" }}</p>
        <p class="h5"><i class="fa fa-map-marker"></i> {{ event?.location_summary }}</p>
      </div>
    </div>

    <div class="container d-flex justify-content-center align-items-start gap-5 mt-4">
  <div class="card w-100 shadow-lg">
    <div class="card-body d-flex justify-content-between align-items-start">
      <!-- About Section -->
      <div class="about-section p-3 me-4">
        <h5>About:</h5>
        <p>{{ event?.description || "Detailed event description goes here." }}</p>
      </div>

      <!-- Price Section -->
      <div class="price-section text-center p-3">
        <h4 class="text-success">Price: {{ event?.price || "$50.00" }}</h4>
        <button @click="handleTicketPurchase" class="btn btn-success btn-lg animate-pulse">Get Tickets</button>
        <div class="marketplace mt-3">
          <router-link to="/marketplace">
            <button class="btn btn-outline-primary btn-lg">See Resale Price</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- Error Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content animate-fade-in">
        <h5>Login Required</h5>
        <p class="text-muted">{{ errorMessage }}</p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-primary">Go to Login</button>
          <button @click="showModal = false" class="btn btn-close">Close</button>
        </div>
      </div>
    </div>


    <!-- Location Map Section -->
    <div class="container mt-4 mb-4 location-map">
      <h5>Location:</h5>
      <div id="map" class="rounded shadow" style="width: 100%; height: 300px"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { useEventStore } from "@/stores/eventStore";
import { useCartStore } from "@/stores/cartStore";

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
});

const event = computed(() => eventStore.selectedEvent);

// Load Google Maps dynamically
function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Check if the Google Maps script is already loaded
  if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js?key=${apiKey}"]`)) {
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


function initMap() {
  const { lat, lng } = event.value.location.point;
  const location = { lat, lng };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 15,
  });

  new google.maps.Marker({
    position: location,
    map: map,
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
    cartStore.addItem(event.value);
  }
}
</script>

<style scoped>
/* General Styling */
* {
  box-sizing: border-box;
  transition: all 0.3s ease;
}

hr.custom-hr {
  border: 1px solid #ddd;
  width: 80%;
}

.poster-img {
  max-height: 400px;
  border-radius: 10px;
  transition: transform 0.5s;
}

.event-title {
  font-size: 3em;
  font-weight: bold;
  color: #333;
  animation: fade-in 1.5s ease-in-out;
}

.about-section {
  width: 500px;
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
}

#map {
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes fade-in {
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
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
