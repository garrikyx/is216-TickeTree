<template>
    <div class="container mt-4">
      <!-- Event Poster and Details -->
      <div class="poster">
        <img
          :src="event?.imageUrl || '/images/noimage.png'"
          class="img-fluid shadow-lg rounded poster-img"
          alt="Event Poster"
        />
      </div>
      <hr class="custom-hr" />
  
      <div class="text-center mt-4">
        <h2 class="event-title">{{ event?.name || "Event Title" }}</h2>
        <p><i class="bi bi-calendar-event"></i> {{ event?.date || "TBD" }}</p>
        <p><i class="bi bi-clock"></i> {{ event?.time || "TBD" }}</p>
        <p><i class="bi bi-geo-alt"></i> {{ event?.location || "Location Unknown" }}</p>
        <p>{{ event?.description || "Description not available." }}</p>
      </div>
  
      <!-- Price History Chart Section -->
      <div class="mt-4">
        <h5>Price History</h5>
        <Chart/>
      </div>
  
      <!-- Related Tickets Section -->
      <div class="mt-4">
        <h5>Related Tickets</h5>
        <div class="row g-3 mb-3">
          <div
            class="col-lg-4 col-md-6 col-sm-12"
            v-for="ticket in filteredTickets"
            :key="ticket.id"
          >
            <TicketCard :ticket="ticket" />
          </div>
        </div>
      </div>
  
      <!-- Ticket Purchase Button -->
      <div class="mt-4 d-flex justify-content-center">
        <button @click="handleTicketPurchase" class="btn btn-success btn-lg">Buy Ticket</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue"; // Add computed here
  import { useRoute } from "vue-router";
  import { useTicketStore } from "@/stores/ticketStore"; 
  import Chart from "@/components/marketplace/Chart.vue";
  import TicketCard from "@/components/marketplace/TicketCard.vue";
  
  export default {
    name: "ListedEvent",
    components: {
      Chart,
      TicketCard,
    },
    setup() {
      const route = useRoute();
      const eventId = route.params.id;
      const event = ref(null); // For event details (could be fetched from a store)
      const priceHistoryData = ref([]); // Price history data (could also be from a store)
      
      // Access ticket store
      const ticketStore = useTicketStore(); 
  
      // Fetch event and price history from store (if available)
      onMounted(async () => {
        // Assuming event details and price history data are static or fetched from the store
        // Event details would need to be set from a static data or store
        event.value = ticketStore.getTicketsByEvent(eventId); // Assuming a method to get event details by ID
  
        // Fetch related tickets based on event ID
        ticketStore.fetchTickets();
      });
  
      // Use the filtered tickets based on eventId
      const filteredTickets = computed(() => {
        // Get tickets for the current event
        return ticketStore.getTicketsByEvent(eventId);
      });
  
      // Handle ticket purchase action
      function handleTicketPurchase() {
        console.log("Ticket purchase initiated");
      }
  
      return {
        event,
        priceHistoryData,
        filteredTickets,
        handleTicketPurchase,
      };
    },
  };
  </script>
  
  <style scoped>
  .blurred-background {
    background-size: cover;
    background-position: center;
    height: 300px;
    display: flex;
    align-items: center;
  }
  
  .poster-img {
    max-height: 400px;
    border-radius: 10px;
  }
  
  .event-title {
    font-size: 2.5em;
    font-weight: bold;
  }
  
  hr.custom-hr {
    border: 1px solid #ddd;
    width: 80%;
  }
  
  .container {
    margin-top: 20px;
  }
  </style>
  