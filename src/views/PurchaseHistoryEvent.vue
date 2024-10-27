<template>
  <div id="app">
    <!-- Poster Section -->
    <PosterSection :event="event" />

    <!-- Event Details -->
    <div class="container mt-3">
      <EventDetails :event="event" />
    </div>

    <!-- Price and Marketplace Section -->
    <PriceMarketplaceSection :event="event" />

    <!-- About Section -->
    <div class="container mt-3">
      <AboutSection :event="event" />
    </div>

    <!-- Location Map section -->
    <div class="container mt-3">
      <LocationMap :locationName="event.location" />
    </div>
  </div>
</template>

<script>
import { purchasedTickets } from '@/data/tickets.js';
import PosterSection from '@/components/purchasehistoryevent/PosterSection.vue';
import EventDetails from '@/components/purchasehistoryevent/EventDetails.vue';
import PriceMarketplaceSection from '@/components/purchasehistoryevent/PriceMarketplaceSection.vue';
import AboutSection from '@/components/purchasehistoryevent/AboutSection.vue';
import LocationMap from '@/components/purchasehistoryevent/LocationMap.vue';

export default {
  name: 'PurchaseHistoryEvent',
  props: ['id'],
  data() {
    return {
      ticketlist: purchasedTickets,
      index: this.id - 1,
    };
  },
  computed: {
    event() {
      return this.ticketlist[this.index];
    },
  },
  components: {
    PosterSection,
    EventDetails,
    PriceMarketplaceSection,
    AboutSection,
    LocationMap,
  },
};
</script>

<style scoped>
/* If there are any global styles, include them here */
</style>