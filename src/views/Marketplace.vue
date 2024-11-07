<template>
  <div class="container mt-4 marketplace-section">
    <!-- Filter dropdown from FilterSection.vue -->
    <FilterSection
      :selectedFilters="selectedFilters"
      :categories="categories" 
      @setAllCategories="addAllCategories"
      @setCategory="filterByCategory"
      @setPrice="sortByPrice"
      @setDate="sortByDate"
      @setPriceRange="handlePriceRange"
      @removeFilter="removeFilter"
    />

    <!-- Render the filtered tickets -->
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
</template>

<script>
import { computed, onMounted } from 'vue';
import { useTicketStore } from '@/stores/ticketStore.js'; 
import FilterSection from '@/components/marketplace/FilterSection.vue';
import TicketCard from '@/components/marketplace/TicketCard.vue';

export default {
  components: {
    FilterSection,
    TicketCard,
  },
  setup() {
    const ticketStore = useTicketStore(); 

    onMounted(() => {
      if (!ticketStore.tickets.length) {
        ticketStore.fetchTickets();
      }
    });

    // Computed properties and methods for filtering
    const filteredTickets = computed(() => ticketStore.filteredTickets);
    const selectedFilters = computed(() => ticketStore.selectedFilters);
    const categories = ['Entertainment', 'Sports', 'Arts & Culture', 'Business & Education'];

    // Methods to trigger store actions for filtering and sorting
    function addAllCategories(categories) {
      ticketStore.setAllCategories(categories);
    }

    function filterByCategory(category) {
      ticketStore.toggleCategoryFilter(category);
    }

    function sortByPrice(order) {
      ticketStore.sortByPrice(order);
    }

    function sortByDate(order) {
      ticketStore.sortByDate(order);
    }

    function filterByPriceRange(range) {
      ticketStore.setPriceRange(range);
    }

    function removeFilter(filter) {
      ticketStore.removeFilter(filter);
    }

    return {
      filteredTickets,
      selectedFilters,
      categories,
      addAllCategories,
      filterByCategory,
      sortByPrice,
      sortByDate,
      filterByPriceRange,
      removeFilter,
    };
  },
};
</script>
