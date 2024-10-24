<template>
    <div class="card mr-3" style="width: auto;">
      <img :src="ticket.image" class="card-img-top event-image" :alt="ticket.eventName">
      
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ ticket.eventName }}</h5>
        <p class="card-text">Category: {{ ticket.category }}</p>
        <p class="card-text">Date: {{ ticket.date }}</p>
        <p class="card-text">Time: {{ ticket.time }}</p>
        <p class="card-text">Location: {{ ticket.location }}</p>
        <p class="card-text" v-if="ticket.seatCategory">Seat Category: {{ ticket.seatCategory }}</p>
        <p class="card-text" v-if="ticket.section">Section: {{ ticket.section }}</p>
        <p class="card-text" v-if="ticket.seatNumber">Seat Number: {{ ticket.seatNumber }}</p>
        <p class="card-text text-success">Price: ${{ ticket.price }}</p>
        <button class="mt-auto btn btn-primary">Buy Ticket</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TicketCard',
    props: {
      ticket: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .card {
    height: 100%;
    margin: 10px; /* Add margin to ensure spacing */
  }
  
  .event-image {
    width: 100%; /* Ensures the image fills the card width */
    height: auto; /* Maintains aspect ratio */
    object-fit: cover; /* Ensures the image covers the space without distortion */
  }
  </style>
  