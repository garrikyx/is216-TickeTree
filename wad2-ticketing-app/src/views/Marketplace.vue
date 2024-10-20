<template>
    <div class="container marketplace-section">
      <div class="container mt-4">
        <!-- Filter Section -->
        <FilterSection
          :selectedFilters="selectedFilters"
          @setCategory="setCategory"
          @setPrice="setPrice"
          @setDate="setDate"
          @removeFilter="removeFilter"
        />
  
        <!-- Tickets Grid -->
        <div class="row mb-3">
          <div 
            class="col-md-4" 
            v-for="ticket in filteredTickets" 
            :key="ticket.id"
          >
            <TicketCard :ticket="ticket" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import FilterSection from '@/components/marketplace/FilterSection.vue';
import TicketCard from '@/components/marketplace/TicketCard.vue';
  
  export default {
    name: 'Marketplace',
    components: {
      FilterSection,
      TicketCard
    },
    data() {
      return {
        tickets: [
          {
            id: 1,
            eventName: "Concert A",
            location: "Singapore Indoor Stadium",
            category: "Entertainment",
            seatCategory: "VIP",
            section: "A1",
            seatNumber: 15,
            price: 120,
            date: "2024-12-01",
            time: "7:00 PM",
            image: "https://example.com/concert.jpg"
          },
          {
            id: 2,
            eventName: "Sports Event B",
            location: "National Stadium",
            category: "Sports",
            seatCategory: "General",
            section: "B2",
            seatNumber: 42,
            price: 180,
            date: "2024-11-15",
            time: "5:00 PM",
            image: "https://example.com/sportsevent.jpg"
          },
          {
            id: 3,
            eventName: "Art Festival C",
            location: "Marina Bay Sands",
            category: "Arts & Culture",
            seatCategory: null,
            section: null,
            seatNumber: null,
            price: 80,
            date: "2024-10-22",
            time: "6:00 PM",
            image: "https://example.com/artfestival.jpg"
          },
          {
            id: 4,
            eventName: "Tech Conference D",
            location: "SMU",
            category: "Conferences and Conventions",
            seatCategory: "VIP",
            section: "D1",
            seatNumber: 5,
            price: 270,
            date: "2024-12-05",
            time: "9:00 AM",
            image: "https://example.com/techconference.jpg"
          },
          {
            id: 5,
            eventName: "Adventure Trip E",
            location: "Tioman Island",
            category: "Travel and Adventure",
            seatCategory: null,
            section: null,
            seatNumber: null,
            price: 230,
            date: "2024-11-02",
            time: "All Day",
            image: "https://example.com/adventuretrip.jpg"
          }
        ],
        selectedFilters: [],
        filteredTickets: [],
      }
    },
    methods: {
      setCategory(category) {
        if (!this.selectedFilters.includes(category)) {
          this.selectedFilters.push(category)
        }
        this.filterTickets()
      },
      setPrice(order) {
        const label = order === 'low' ? 'Price: Low to High' : 'Price: High to Low'
        if (!this.selectedFilters.includes(label)) {
          this.selectedFilters.push(label)
        }
        this.filterTickets()
      },
      setDate(order) {
        const label = order === 'ascending' ? 'Date: Earliest First' : 'Date: Latest First'
        if (!this.selectedFilters.includes(label)) {
          this.selectedFilters.push(label)
        }
        this.filterTickets()
      },
      filterTickets() {
        let filtered = [...this.tickets]
  
        const categoryFilters = ['Entertainment', 'Sports', 'Arts & Culture', 'Conferences & Conventions', 'Travel & Adventure']
        const selectedCategory = this.selectedFilters.find(filter => categoryFilters.includes(filter))
        
        if (selectedCategory) {
          filtered = filtered.filter(ticket => ticket.category === selectedCategory)
        }
  
        if (this.selectedFilters.includes('Price: Low to High')) {
          filtered.sort((a, b) => a.price - b.price)
        } else if (this.selectedFilters.includes('Price: High to Low')) {
          filtered.sort((a, b) => b.price - a.price)
        }
  
        if (this.selectedFilters.includes('Date: Earliest First')) {
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
        } else if (this.selectedFilters.includes('Date: Latest First')) {
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
  
        this.filteredTickets = filtered
      },
      removeFilter(filter) {
        const index = this.selectedFilters.indexOf(filter)
        if (index > -1) {
          this.selectedFilters.splice(index, 1)
        }
        this.filterTickets()
      }
    },
    mounted() {
      this.filteredTickets = this.tickets
    }
  }
  </script>
  
  <style scoped>
  .marketplace-section {
    margin-top: 20px;
  }
  
  .row {
    margin-bottom: 20px;
  }
  </style>