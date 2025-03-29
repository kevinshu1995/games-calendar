<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
</script>

<template>
  <Separator />
  <div class="container py-10 space-y-4">
    <div class="w-full flex items-center justify-center">
      <Button variant="ghost" as-child>
        <a
          href="https://github.com/kevinshu1995/games-calendar"
          class="inline-block"
          target="_blank"
        >
          <Icon icon="mdi:github" />
          Github Repo
          <Icon icon="mdi:external-link" />
        </a>
      </Button>
    </div>
    <p class="text-muted-foreground text-center text-sm">
      Copyright © 2025-PRESENT Wen Hsiu Hsu
    </p>
  </div>
</template>
