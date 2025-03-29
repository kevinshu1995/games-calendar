<script setup lang="ts">
import Navigation from "@/components/BaseNavigation.vue";
import InfoCards from "@/components/InfoCards.vue";
import HeroSection from "@/components/HeroSection.vue";
import BaseFooter from "@/components/BaseFooter.vue";
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <Navigation />
  <div class="min-h-screen">
    <!-- Intro -->
    <HeroSection />
    <!-- TODO Search bar -->
    <!-- Card List -->
    <div class="container max-w-xl py-20">
      <div class="grid grid-cols-1 gap-4">
        <InfoCards />
      </div>
    </div>
    <!-- Footer -->
    <BaseFooter />
  </div>
  <Toaster />
</template>
