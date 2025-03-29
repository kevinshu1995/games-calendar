<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";
import HeroSection from "@/components/HeroSection.vue";
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <Navigation />
  <div class="min-h-screen">
    <!-- Intro -->
    <HeroSection />
    <!-- TODO Search bar -->
    <!-- Card List -->
  </div>
  <Toaster />
</template>
