<template>
  <div id="app">

    <!-- Poster Section -->
    <div class="blurred-background p-0 m-0 container-fluid mt-4 d-flex justify-content-center align-items-center">
      <div class="poster">
        <img src="/images/dualipa.jpg" class="img-fluid" alt="Event Poster" style="max-height: 400px;" />
      </div>
    </div>
    <hr>

    <!-- Event Details -->
    <div class="container mt-3">
      <div class="event-details">
        <h2>Event Title</h2>
        <p><strong>Date:</strong> November 30, 2024</p>
        <p><strong>Time:</strong> 6:00 PM</p>
        <p><strong>Location:</strong> OCBC Arena</p>
      </div>
    </div>

    <!-- Price and Marketplace Section -->
    <div class="container mt-3 d-flex justify-content-between">
      <div class="price-section">
        <h4>Price: $50.00</h4>
        <RouterLink to="/payment" class="btn btn-success">Get Tickets
        </RouterLink>
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
          This is a detailed description of the event. It will cover the event
          background, performers, and what the audience can expect.
        </p>
      </div>
    </div>

    <!-- Location Map section -->
    <div class="container mt-3">
      <div class="location-map">
        <h5>Location:</h5>
        <div id="map" style="width: 1000px; height: 300px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
  background-image: url('/images/dualipa.jpg');
  /* Set background image */
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
</style>


<script>
export default {
  mounted() {
    window.initMap = this.initMap;  // Ensure the callback is set globally
    this.loadGoogleMaps();
  },
  methods: {
    loadGoogleMaps() {
      // Dynamically create and append the Google Maps script
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = this.initMap; // Set initMap as a global function
      document.head.appendChild(script);
    },
    initMap() {
      const location = { lat: 1.3046849416229254, lng: 103.87609278257061 }; // Coordinates for OCBC arena

      const map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
      });

      // Add a marker to the location
      new google.maps.Marker({
        position: location,
        map: map,
      });
    }
  }
}

</script>
