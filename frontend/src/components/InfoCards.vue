<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useClipboard } from "@vueuse/core";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "vue-sonner";
import { Icon } from "@iconify/vue";

interface Calendar {
  id: string;
  name: string;
  description: string;
  publicUrl: string;
  icalUrl: string;
  sportId: string;
  color: string;
}

const fetchState = ref<"loading" | "success" | "error">("loading");
const calendars = ref<Calendar[]>([]);

async function fetchCalendars() {
  fetchState.value = "loading";
  try {
    const response = await fetch("/data/calendars.json");
    if (!response.ok) {
      throw new Error("Failed to fetch calendars");
    }
    const _calendars = await response.json();
    if (!Array.isArray(_calendars)) {
      throw new Error("Invalid calendar data format");
    }
    calendars.value = _calendars as Calendar[];
    fetchState.value = "success";
  } catch (error) {
    console.error("Error fetching calendars:", error);
    fetchState.value = "error";
  }
}

onMounted(() => {
  fetchCalendars();
});

const { copy } = useClipboard();
function onCopy(source: string) {
  copy(source);
  toast("Copied to clipboard");
}
</script>

<template>
  <template v-if="fetchState === 'success'">
    <Card v-for="calendar in calendars" :key="calendar.id">
      <CardHeader>
        <CardTitle class="font-bold text-xl">{{ calendar.name }}</CardTitle>
        <CardDescription>{{ calendar.description }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-2">
          <Button variant="ghost" @click="onCopy(calendar.icalUrl)">
            iCal
            <Icon icon="material-symbols:content-copy-sharp" />
          </Button>
          <Button variant="link" as-child>
            <a :href="calendar.publicUrl" class="w-full" target="_blank"
              >View Calendar
              <Icon icon="mdi:external-link" />
            </a>
          </Button>
        </div>
        <Separator />
        <Button variant="link" as-child>
          <a
            href="#what-is-ical"
            class="text-muted-foreground flex items-center justify-center gap-1 text-xs w-full"
          >
            <Icon icon="material-symbols:info" />
            <span>What is iCal?</span>
          </a>
        </Button>
      </CardContent>
    </Card>

    <Card class="relative overflow-hidden">
      <div
        class="w-full h-full absolute left-0 top-0 flex items-center justify-center backdrop-blur-sm z-50"
        v-if="fetchState === 'success'"
      >
        <p class="font-bold text-xl text-muted-foreground">
          More sports coming soon!
        </p>
      </div>
      <CardHeader class="relative z-10">
        <CardTitle class="mb-2">
          <Skeleton class="w-2/5 h-5" />
        </CardTitle>
        <CardDescription class="mb-4">
          <Skeleton class="w-2/3 h-4" />
        </CardDescription>
        <div class="space-y-2">
          <Skeleton class="w-full h-8" />
          <Skeleton class="w-full h-8" />
        </div>
      </CardHeader>
    </Card>
  </template>
  <p v-if="fetchState === 'error'">
    Error loading calendars. Please try again later.
  </p>
</template>
