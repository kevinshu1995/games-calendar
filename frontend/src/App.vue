<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";
import InfoCards from "@/components/InfoCards.vue";
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
    <div class="container max-w-xl mt-20">
      <div class="grid grid-cols-1 gap-4">
        <InfoCards />
      </div>
    </div>
    <!-- Footer -->
  </div>
  <Toaster />
</template>
