<template>
  <!-- Event Poster and Details -->
  <div class="poster text-center">
    <img
      :src="event?.imageUrl || '/images/noimage.png'"
      class="img-fluid shadow-lg rounded poster-img"
      alt="Event Poster"
    />
  </div>
  <hr class="custom-hr" />
    <div class="container">
  
    <div class="container mt-4 text-center event-details">
        <h2 class="event-title">{{ event?.eventName || "Event Title" }}</h2>
        <div class="d-flex justify-content-center gap-3 text-muted">
            <p class="h5"><i class="fa fa-calendar"></i> {{ event?.date || "November 30, 2024" }}</p>
            <p class="h5"><i class="fa fa-clock-o"></i> {{ event?.time || "6:00 PM" }}</p>
            <p class="h5"><i class="fa fa-map-marker"></i> {{ event?.location }}</p>
        </div>
            <p>{{ event?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." }}</p>
    </div>
      <!-- Ticket Purchase Button -->
      <div class="mt-4 d-flex justify-content-center">
        {{ event?.price || '$500' }}
        <button @click="handleTicketPurchase" class="btn btn-success btn-lg">Buy Ticket</button>
      </div>
      
      <!-- Price History Chart Section -->
      <div class="mt-4" v-if="event">
      <h5>Price History</h5>
      <Chart :eventName="event.eventName"/>
    </div>
    <div class="mt-4" v-else>
      <p>Loading price history...</p>
    </div>
  </div>
</template>
  
  <script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketStore } from "@/stores/ticketStore";
import { useCartStore } from "@/stores/cartStore"; 
import Chart from "@/components/marketplace/Chart.vue";

export default {
  name: "ListedEvent",
  props: {
    id: String
  },
  components: {
    Chart,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventId = route.params.id;
    const event = ref(null);
    const ticketStore = useTicketStore();
    const cartStore = useCartStore();

    onMounted(async () => {
      event.value = await ticketStore.fetchTicketById(eventId);
    });

    // Handle ticket purchase action
    async function handleTicketPurchase() {
      if (event.value) {
        cartStore.addTicketToCart(event.value); // Add ticket to the cart
        router.push("/payment"); // Navigate to payment page
      } else {
        console.error("Event not found, cannot add to cart");
      }
    }

    return {
      event,
      handleTicketPurchase,
    };
  },
};
</script>
  
  <style scoped>
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
  