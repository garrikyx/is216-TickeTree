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
        <p>
          <strong>Date:</strong>
          {{ event?.datetime_summary || "November 30, 2024" }}
        </p>
        <p><strong>Time:</strong> {{ event?.time || "6:00 PM" }}</p>
        <p>
          <strong>Location:</strong>
          {{ event?.location_summary || "OCBC Arena" }}
        </p>
      </div>
    </div>

    <!-- Price and Marketplace Section -->
    <div class="container mt-3 d-flex justify-content-between">
      <div class="price-section">
        <h4>Price: {{ event?.price || "$50.00" }}</h4>
        <RouterLink to="/payment" @click.prevent="addToCart" class="btn btn-success">Get Tickets</RouterLink>

      </div>
      <div class="marketplace">
        <h5>Marketplace</h5>
        <button class="btn btn-outline-primary">See Resale Price</button>
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
import { useRoute } from "vue-router";
import { useEventStore } from "@/stores/eventStore";
import { useCartStore } from "@/stores/cartStore";

const route = useRoute();
const eventId = route.params.id;
const eventStore = useEventStore();
const loading = ref(true);
const googleMapsLoaded = ref(false);

onMounted(async () => {
  await eventStore.loadEvents();
  eventStore.selectEventById(eventId);
  loading.value = false;

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
  /* Positioning context for the pseudo-element */
  color: white;
  /* Text color */
  /* Add padding */
  text-align: center;
  /* Center text */
  overflow: hidden;
  /* Hide overflow */
  height: 400px;
  /* Set height for the div */
  width: 100vw;
}

.blurred-background::before {
  margin: 0px;
  content: "";
  /* Required for pseudo-elements */
  position: absolute;
  /* Position absolutely within the parent */
  top: 0;
  /* Align to top */
  left: 0;
  /* Align to left */
  right: 0;
  /* Align to right */
  bottom: 0;
  /* Align to bottom */
  background-size: cover;
  /* Cover the entire div */
  background-position: center;
  /* Center the image */
  filter: blur(10px);
  /* Apply blur effect */
  z-index: -1;
  /* Send the pseudo-element behind the content */
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
</style>
