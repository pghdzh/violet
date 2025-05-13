<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <Navbar />
  <div class="main-content">
    <RouterView />
  </div>
</template>

<style scoped>
.main-content {
  margin-top: 48px;
}
</style>
