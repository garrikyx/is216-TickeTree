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
      @setPriceRange="filterByPriceRange"
      @removeFilter="removeFilter"
    />

    <!-- Render the filtered tickets -->
    <div class="row g-3 mb-3">
      <div 
        class="col-lg-4 col-md-6 col-sm-12" 
        v-for="ticket in filteredTickets" 
        :key="ticket.id"
        :ref="el => ticketCardRefs[index] = el"
      >
        <TicketCard :ticket="ticket" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import anime from 'animejs';
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
    
    // Initialize selected filters and categories
    const selectedFilters = ref([]);
    const selectedCategory = ref();
    const selectedSortOption = ref(null);
    const priceRange = ref([0, 3000]);

    const ticketCardRefs = ref([]);

    // Fetch tickets on mount
    onMounted(() => {
      if (!ticketStore.tickets.length) {
        ticketStore.fetchTickets();
      }
    });

    // Get all tickets from the store
    const allTickets = computed(() => ticketStore.tickets);

    // Computed property to dynamically filter and sort tickets
    const filteredTickets = computed(() => {
      let tickets = [...allTickets.value];

      // Filter by category if a category is selected
      if (selectedCategory.value) {
        tickets = tickets.filter(ticket => ticket.category === selectedCategory.value);
      }

      // Filter by price range
      tickets = tickets.filter(ticket => 
        ticket.price >= priceRange.value[0] && ticket.price <= priceRange.value[1]
      );

      // Sort tickets based on selected sort option
      if (selectedSortOption.value) {
        if (selectedSortOption.value === 'low') {
          tickets.sort((a, b) => a.price - b.price);
        } else if (selectedSortOption.value === 'high') {
          tickets.sort((a, b) => b.price - a.price);
        } else if (selectedSortOption.value === 'ascending') {
          tickets.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (selectedSortOption.value === 'descending') {
          tickets.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
      }

      return tickets;
    });

    // Watch for changes in filteredTickets to trigger the animation
    watch(filteredTickets, () => {
      animateCards();
    });

    // Categories to display in the filter section
    const categories = ['Entertainment', 'Sports', 'Arts & Culture', 'Business & Education'];

    // Animation function using anime.js for filtering events
    function animateCards() {
      anime({
        targets: '.row.g-3.mb-3',
        opacity: [0, 1],
        translateY: [500, 0],
        duration: 1500,
        easing: 'spring(1, 80, 10, 0)',
      });
    }

    // Methods for updating filters and sort options
    function addAllCategories(categories) {
      selectedFilters.value = categories;
    }

    function filterByCategory(category) {
      selectedCategory.value = category;
    }

    function sortByPrice(order) {
      selectedSortOption.value = order;
    }

    function sortByDate(order) {
      selectedSortOption.value = order;
    }

    function filterByPriceRange(range) {
      priceRange.value = range;
    }

    function removeFilter(filter) {
      if (filter === 'category') {
        selectedCategory.value = null;
      } else if (filter === 'sort') {
        selectedSortOption.value = null;
      } else if (filter === 'price') {
        priceRange.value = [0, 3000];
      }
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
      ticketCardRefs,
    };
  },
};
</script>