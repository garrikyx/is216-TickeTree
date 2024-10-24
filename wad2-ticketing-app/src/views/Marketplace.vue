

<template>
 <div class="container mt-4 marketplace-section">
    <!-- Filter dropdown from FilterSection.vue -->
    <FilterSection
      :selectedFilters="selectedFilters"
      @setAllCategories="addAllCategories"
      @setCategory="filterByCategory"
      @setPrice="sortByPrice"
      @setDate="sortByDate"
      @removeFilter="removeFilter"
    />

    <!-- Render the filtered tickets -->
    <div class="row g-3 mb-3">
      <div 
        class="col-md-4" 
        v-for="ticket in filteredTickets" 
        :key="ticket.id"
      >
        <TicketCard :ticket="ticket" />
      </div>
    </div>
  </div>
</template>

<script>
import FilterSection from '@/components/marketplace/FilterSection.vue'; // Import FilterSection component
import TicketCard from '@/components/marketplace/TicketCard.vue'; // Import TicketCard component

export default {
  components: {
    FilterSection,
    TicketCard,
  },
  data() {
    return {
      selectedFilters: [],  // Hold selected filters
      tickets: [
      { id: 1,
        eventName: "Tate McRae Concert",
        location: "The Star Theatire",
        category: "Entertainment",
        seatCategory: "VIP",
        section: "A1",
        seatNumber: 15,
        price: 120,
        date: "2024-10-31",
        time: "7:00 PM",
        image: "./marketplace-images/tatemcrae.jpg"
      },
      {
        id: 2,
        eventName: "HSBC Rugby Sevens 2024",
        location: "Singapore National Stadium",
        category: "Sports",
        seatCategory: "General",
        section: "B2",
        seatNumber: 42,
        price: 180,
        date: "2024-05-03",
        time: "5:00 PM",
        image: "./marketplace-images/rugby7.png"
      },
      {
        id: 3,
        eventName: "The World of Studio Ghibli",
        location: "ArtScience Museum",
        category: "Arts & Culture",
        seatCategory: null,
        section: null,
        seatNumber: null,
        price: 20,
        date: "2024-10-22",
        time: "6:00 PM",
        image: "./marketplace-images/studioghibli.jpg"
      },
      {
        id: 4,
        eventName: "TechX Summit 2024",
        location: "Sands Expo & Convention Centre",
        category: "Conferences & Conventions",
        seatCategory: "VIP",
        section: "D1",
        seatNumber: 5,
        price: 270,
        date: "2024-04-03",
        time: "9:00 AM",
        image: "./marketplace-images/techsummit.jpg"
      },
      {
        id: 5,
        eventName: "Taiwan Adventure Trip",
        location: "Taiwan",
        category: "Travel & Adventure",
        seatCategory: null,
        section: null,
        seatNumber: null,
        price: 1800,
        date: "2025-03-15",
        time: "All Day",
        image: "./marketplace-images/taiwan.png"
      },
      {
        id: 6,
        eventName: "Ed Sheeran Tour 2024",
        location: "Singapore National Stadium",
        category: "Entertainment",
        seatCategory: "2",
        section: "D",
        seatNumber: "68",
        price: 1800,
        date: "2024-02-16",
        time: "8:00 PM",
        image: "./marketplace-images/edsheeran.jpg"
        },
        {
        id: 7,
        eventName: "Dua Lip - Radical Optimism Tour",
        location: "Singapore Indoor Stadium",
        category: "Entertainment",
        seatCategory: "3",
        section: "C",
        seatNumber: "12",
        price: 168,
        date: "2024-11-05",
        time: "7:00 PM",
        image: "./marketplace-images/dualipa.jpg"
        }
      ], // Array of all ticket listings
      selectedCategory: null, // Holds selected category
      selectedSort: null,     // Holds selected sort option
    };
  },
  computed: {
    filteredTickets() {
      let result = this.tickets;

      // Filter by category
      if (this.selectedCategory) {
        result = result.filter(ticket => ticket.category === this.selectedCategory);
      }

      // Sort by price
      if (this.selectedSort === 'low') {
        result = result.sort((a, b) => a.price - b.price);
      } else if (this.selectedSort === 'high') {
        result = result.sort((a, b) => b.price - a.price);
      }

      // Sort by date
      if (this.selectedSort === 'ascending') {
        result = result.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (this.selectedSort === 'descending') {
        result = result.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      return result;
    },
  },
  methods: {
    // Add all categories filter
    addAllCategories(categories) {
      this.selectedFilters = categories;
      this.filterListings();
    },
    filterByCategory(category) {
      this.selectedCategory = category; // Update selected category
    },
    sortByPrice(order) {
      this.selectedSort = order; // Update selected price sort order
    },
    sortByDate(order) {
      this.selectedSort = order; // Update selected date sort order
    },
    removeFilter(filter) {
      const index = this.selectedFilters.indexOf(filter);
      if (index !== -1) {
        this.selectedFilters.splice(index, 1);
        this.filterListings();
      }
    },
  },
};
</script>