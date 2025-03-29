<script setup lang="ts">
import InfoCards from "@/components/InfoCards.vue";
import HeroSection from "@/components/SectionHero.vue";
import SectionInfo from "@/components/SectionInfo.vue";
</script>

<template>
  <!-- Intro -->
  <HeroSection />
  <!-- TODO Search bar -->
  <!-- Card List -->
  <div class="container max-w-xl py-20">
    <div class="grid grid-cols-1 gap-4">
      <InfoCards />
    </div>
  </div>
  <SectionInfo />
</template>
