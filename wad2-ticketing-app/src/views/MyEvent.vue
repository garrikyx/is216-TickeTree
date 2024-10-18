<template>
  <div id="app">

    <!-- Poster Section -->
    <div class="container mt-4">
      <div class="poster">
        <img src="/images/dualipa.jpg" class="img-fluid" alt="Event Poster" />
      </div>
    </div>

    <!-- Event Details -->
    <div class="container mt-3">
      <div class="event-details">
        <h2>Event Title</h2>
        <p><strong>Date:</strong> November 30, 2024</p>
        <p><strong>Time:</strong> 6:00 PM</p>
        <p><strong>Location:</strong> ABC Arena</p>
      </div>
    </div>

    <!-- Price and Marketplace Section -->
    <div class="container mt-3 d-flex justify-content-between">
      <div class="price-section">
        <h4>Price: $50.00</h4>
        <button class="btn btn-success">Get Tickets</button>
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

    <!-- Seat View Section -->
    <div class="container mt-3">
      <div class="seat-view">
        <h5>Seat View:</h5>
        <div class="seat-view-image">
          <!-- <img
            src="/seat-view-image-url.jpg"
            class="img-fluid"
            alt="Seat View"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
