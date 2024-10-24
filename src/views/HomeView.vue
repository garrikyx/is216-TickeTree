<template>
  <main>
    <Hero/>
    <CategorySelection/>
    <EventFeed/>
  </main>
</template>


<script setup>

import CategorySelection from '@/components/homepage/CategorySelection.vue';
import EventFeed from '@/components/homepage/EventFeed.vue';
import Hero from '@/components/homepage/Hero.vue';

</script>

<style scoped>
main {
  min-height: 40vh;
}
</style>