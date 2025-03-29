<script setup lang="ts">
import Navigation from "@/components/BaseNavigation.vue";
import BaseFooter from "@/components/BaseFooter.vue";
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <Navigation />
  <div class="min-h-screen">
    <router-view />
    <!-- Footer -->
    <BaseFooter />
  </div>
  <Toaster />
</template>
