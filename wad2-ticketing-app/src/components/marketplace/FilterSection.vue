<template>
    <div class="d-flex justify-content-start align-items-center mb-3">
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="filterDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filter By
        </button>
        <ul class="dropdown-menu" aria-labelledby="filterDropdown">
          <li v-for="category in categories" :key="category">
            <a class="dropdown-item" @click="$emit('setCategory', category)">{{ category }}</a>
          </li>
          <li v-for="(sort, index) in sortOptions" :key="index">
            <a class="dropdown-item" @click="$emit(sort.event, sort.value)">{{ sort.label }}</a>
          </li>
        </ul>
      </div>
  
      <!-- Selected filters badges -->
      <div class="ms-3">
        <span
          v-for="filter in selectedFilters"
          :key="filter"
          class="badge bg-info me-2"
        >
          {{ filter }}
          <button 
            type="button" 
            class="btn-close btn-close-white ms-2" 
            aria-label="Remove" 
            @click="$emit('removeFilter', filter)"
          ></button>
        </span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FilterSection',
    props: {
      selectedFilters: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        categories: [
          'Entertainment',
          'Sports',
          'Arts & Culture',
          'Conferences & Conventions',
          'Travel & Adventure'
        ],
        sortOptions: [
          { label: 'Price: Low to High', event: 'setPrice', value: 'low' },
          { label: 'Price: High to Low', event: 'setPrice', value: 'high' },
          { label: 'Date: Earliest First', event: 'setDate', value: 'ascending' },
          { label: 'Date: Latest First', event: 'setDate', value: 'descending' }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
  }
  </style>