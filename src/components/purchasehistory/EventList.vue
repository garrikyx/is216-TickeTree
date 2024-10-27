<template>
  <div class="purchase-list">
    <div v-if="filteredTickets.length">
      <PurchaseItem
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        :ticket="ticket"
        :isPastEvent="isPastEvent"
      />
    </div>
    <div v-else class="no-tickets">
      <p>No {{ isPastEvent ? "past" : "upcoming" }} events to display.</p>
    </div>
  </div>
</template>

<script>
import PurchaseItem from "./PurchaseItem.vue";

export default {
  name: "EventsList",
  components: {
    PurchaseItem,
  },
  props: {
    tickets: {
      type: Array,
      required: true,
    },
    currentTab: {
      type: String,
      required: true,
    },
  },
  computed: {
    isPastEvent() {
      return this.currentTab === "past";
    },
    filteredTickets() {
      const currentDate = new Date();
      if (this.isPastEvent) {
        return this.tickets.filter(
          (ticket) => new Date(ticket.date) < currentDate
        );
      } else {
        return this.tickets.filter(
          (ticket) => new Date(ticket.date) >= currentDate
        );
      }
    },
  },
};
</script>

<style scoped>
.purchase-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-tickets {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}
</style>