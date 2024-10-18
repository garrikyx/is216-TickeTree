<template>
    <div class="card mb-3">
      <img :src="ticket.image" class="card-img-top event-image" :alt="ticket.eventName">
      
      <div class="card-body">
        <h5 class="card-title">{{ ticket.eventName }}</h5>
        <p class="card-text">Category: {{ ticket.category }}</p>
        <p class="card-text">Date: {{ ticket.date }}</p>
        <p class="card-text">Time: {{ ticket.time }}</p>
        <p class="card-text">Location: {{ ticket.location }}</p>
        <p class="card-text" v-if="ticket.seatCategory">Seat Category: {{ ticket.seatCategory }}</p>
        <p class="card-text" v-if="ticket.section">Section: {{ ticket.section }}</p>
        <p class="card-text" v-if="ticket.seatNumber">Seat Number: {{ ticket.seatNumber }}</p>
        <p class="card-text text-success">Price: ${{ ticket.price }}</p>
        <button class="btn btn-primary">Buy Ticket</button>
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
  }
  
  .event-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  </style>