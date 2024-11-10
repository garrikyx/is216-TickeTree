<template>
<poster/>
</template>
<script setup>
import Poster from "@/components/EventDetail/poster.vue"
const suspense = async () => {
    await new Promise ((resolve)=> setTimeout(resolve,5000))
}
await suspense()
</script>