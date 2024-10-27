<template>
  <div :class="['purchase-item', { faded: isPastEvent }]">
    <div class="event-image-container">
      <img :src="ticket.image" class="event-image" alt="Event Image" />
    </div>
    <div class="event-details">
      <strong>{{ ticket.eventName }}</strong> <br />
      <small
        >{{ ticket.category }} | {{ formattedDate }} - {{ ticket.time }}</small
      >
      <br />
      <small>{{ ticket.location }}</small>
    </div>
    <div class="event-price">
      <span class="price">\${{ ticket.price }}</span>
      <span :class="['badge-status', badgeClass]">{{ badgeText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PurchaseItem",
  props: {
    ticket: {
      type: Object,
      required: true,
    },
    isPastEvent: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    badgeText() {
      return this.isPastEvent ? "Expired" : "Paid";
    },
    badgeClass() {
      return this.isPastEvent ? "expired" : "paid";
    },
    formattedDate() {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(this.ticket.date).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.purchase-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e6ea;
  width: 100%;
}

.event-image-container {
  flex: 0 0 120px;
}

.event-image {
  width: auto;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.event-details {
  flex-grow: 1;
  margin-left: 20px;
}

.event-price {
  text-align: right;
  min-width: 100px;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

.badge-status {
  font-size: 0.875rem;
  padding: 5px 10px;
  border-radius: 20px;
  margin-top: 5px;
  background-color: #e0e0e0;
  color: #fff;
}

.badge-status.paid {
  background-color: #007bff;
}

.badge-status.expired {
  background-color: #dc3545;
}

.faded {
  opacity: 0.5;
  filter: grayscale(50%);
}
</style>