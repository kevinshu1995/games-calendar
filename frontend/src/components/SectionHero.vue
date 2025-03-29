<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
</script>

<template>
  <div class="container py-20">
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center gap-2 mb-1">
        <div class="flex items-center gap-3">
          <img src="/favicon.png" alt="Logo" class="w-10 h-10 translate-x-1" />
          <Icon icon="ri:close-large-fill" class="w-4 h-4 translate-y-px" />
          <img
            src="/google_Calendar_icon.svg"
            alt="Google Calendar"
            class="w-7 h-7"
          />
        </div>
        <p class="text-xl italic font-bold">
          Your Ultimate Sports Event Organizer
        </p>
      </div>
      <h1
        class="text-9xl font-bold uppercase text-center mb-6 flex flex-col -space-y-4"
      >
        <span>Sports</span><span class="text-primary">Calendar</span>
      </h1>
      <div class="text-center max-w-2xl space-y-8 mb-12">
        <p class="text-2xl space-x-1">
          <span class="opacity-70 block"
            >Get sports schedules effortlessly! 🏆</span
          >
          <span class="underline decoration-primary decoration-4 font-bold"
            >Subscribe instantly</span
          >
          <span class="opacity-70">or</span>
          <span class="underline decoration-primary decoration-4 font-bold"
            >import via iCal.</span
          >
          <span class="opacity-70"
            >No manual updates needed. Sports Calendar syncs tournaments
            directly to</span
          >
          <span class="underline decoration-primary decoration-4 font-bold"
            >Google Calendar.</span
          >
          <span class="opacity-70"
            >, keeping you up to date with smart event detection.</span
          >
        </p>
      </div>

      <Button variant="ghost" as-child>
        <a
          href="https://github.com/kevinshu1995/games-calendar"
          class="inline-block text-xl"
          target="_blank"
        >
          <Icon icon="mdi:github" class="!size-6" />
          Github Repo
          <Icon icon="mdi:external-link" class="text-muted-foreground" />
        </a>
      </Button>
    </div>
  </div>
</template>
