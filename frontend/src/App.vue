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
  <div class="animated-bg animated-bg-animation-1"></div>
  <div class="animated-bg animated-bg-animation-2"></div>
  <div class="animated-bg animated-bg-animation-3"></div>
</template>

<style scoped>
.animated-bg {
  height: 100%;
  width: 0;
  top: 0;
  position: fixed;
  z-index: -1;
  transform-origin: top right;
  box-shadow: -130px 0 80px 40px transparent,
    -50px 0 130px 25px hsl(var(--primary)), 100px 0 80px 20px transparent;
  opacity: 0.1;
}
.animated-bg-animation-1 {
  animation: 250s ease-in-out infinite slide;
}
.animated-bg-animation-2 {
  animation: 300s ease-in-out infinite slide;
  animation-direction: reverse;
}
.animated-bg-animation-3 {
  animation: 400s ease-in-out infinite slide;
  animation-delay: 100s;
}
@keyframes slide {
  0% {
    transform: rotate(30deg) scale(0.9);
    right: 0vw;
  }
  5% {
    transform: rotate(-10deg) scale(1.5);
    right: 100vw;
  }
  10% {
    transform: rotate(20deg) scale(1);
    right: 0vw;
  }
  20% {
    transform: rotate(-30deg) scale(1.2);
    right: 50vw;
  }
  30% {
    transform: rotate(10deg) scale(0.9);
    right: 100vw;
  }
  35% {
    transform: rotate(20deg) scale(1.2);
    right: 0vw;
  }
  40% {
    transform: rotate(-20deg) scale(1);
    right: 100vw;
  }
  50% {
    transform: rotate(-10deg) scale(0.9);
    right: 0vw;
  }
  60% {
    transform: rotate(30deg) scale(1.2);
    right: 60vw;
  }
  70% {
    transform: rotate(-10deg) scale(1.7);
    right: 100vw;
  }
  80% {
    transform: rotate(30deg) scale(0.9);
    right: 70vw;
  }
  90% {
    transform: rotate(-10deg) scale(1.6);
    right: 0vw;
  }
  100% {
    transform: rotate(30deg) scale(1);
    right: 100vw;
  }
}
</style>
