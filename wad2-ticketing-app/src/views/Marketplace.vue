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
        <div class="row g-3">
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
          category: "Conferences and Conventions",
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
          category: "Travel and Adventure",
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