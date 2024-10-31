<template>
  <div id="app">
    <!-- Poster Section -->
    <div
      class="blurred-background p-0 m-0 container-fluid mt-4 d-flex justify-content-center align-items-center"
      :style="{
        backgroundImage: `url(${event?.images?.images[0]?.original_url || '/images/noimage.png'})`
      }"
    >
      <div class="poster">
        <img
          :src="event?.images?.images[0]?.original_url || '/images/noimage.png'"
          class="img-fluid"
          alt="Event Poster"
          style="max-height: 400px"
        />
      </div>
    </div>
    <hr />

    <!-- Event Details -->
    <div class="container mt-3">
      <div class="event-details">
        <h2>{{ event?.name || "Event Title" }}</h2>
        <p><strong>Date:</strong> {{ event?.datetime_summary || "November 30, 2024" }}</p>
        <p><strong>Time:</strong> {{ event?.time || "6:00 PM" }}</p>
        <p><strong>Location:</strong> {{ event?.location_summary || "OCBC Arena" }}</p>
      </div>
    </div>

    <!-- Price and Marketplace Section -->
    <div class="container mt-3 d-flex justify-content-between">
      <div class="price-section">
        <h4>Price: {{ event?.price || "$50.00" }}</h4>
        <button @click="handleTicketPurchase" class="btn btn-success">Get Tickets</button>
      </div>
      <div class="marketplace">
        <h5>Marketplace</h5>
        <button class="btn btn-outline-primary">See Resale Price</button>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h5>Login to Proceed</h5>
        <p>{{ errorMessage }}</p>
        <button @click="closeModal" class="btn btn-primary">Go to Login</button>
        <button @click="showModal = false" class="btn btn-close"></button>
      </div>
    </div>

    <!-- About Section -->
    <div class="container mt-3">
      <div class="about-section">
        <h5>About:</h5>
        <p>
          {{
            event?.description ||
            "This is a detailed description of the event. It will cover the event background, performers, and what the audience can expect."
          }}
        </p>
      </div>
    </div>

    <!-- Location Map section -->
    <div class="container mt-3">
      <div class="location-map">
        <h5>Location:</h5>
        <div id="map" style="width: 100%; height: 300px"></div>
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
hr {
  margin: 0;
  padding: 0;
  height: 2px;
}

.blurred-background {
  margin: 0px;
  position: relative;
  color: white;
  text-align: center;
  overflow: hidden;
  height: 400px;
  width: 100vw;
}

.blurred-background::before {
  margin: 0px;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  z-index: -1;
}

.poster {
  position: relative;
  z-index: 1;
}

.price-section,
.marketplace {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.text-danger {
  color: #dc3545;
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
  width: 40%;
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-content h5 {
  margin: 0 0 10px;
}

.modal-content p {
  margin: 0 0 10px;
  font-size: 15px;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #0056b3;
}

.modal-content .btn-close { /* Specific class for the Close button */
  background-color: grey;
  position: absolute; /* Position it absolutely within the modal */
  top: 10px; /* Adjust to position in the upper corner */
  right: 10px; /* Adjust to position in the upper corner */
  padding: 5px 10px;
  color: white;
  border-radius: 5px;
}

.modal-content .btn-close:hover {
  background-color: darkgrey;
}

</style>
