<script setup lang="ts">
import { computed, ref } from "vue";
import { useElementSize } from "@vueuse/core";
import TogglerDarkMode from "@/components/TogglerDarkMode.vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";

const togglerRef = ref<HTMLElement>();
const { height } = useElementSize(togglerRef);

const style = computed(() => ({
  height: `${height.value}px`,
}));
</script>

<template>
  <div :style="style">
    <div class="fixed top-0 right-0 w-full" ref="togglerRef">
      <div class="bg-background/50 backdrop-blur">
        <div class="container py-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="/favicon.png" alt="Logo" class="w-8 h-8" />
              <h2 class="text-xl font-bold translate-y-px hidden sm:block">
                Sports Calendar
              </h2>
            </div>
            <div>
              <Button as-child variant="ghost" size="icon">
                <a
                  href="https://github.com/kevinshu1995/games-calendar"
                  class="inline-block"
                  target="_blank"
                >
                  <Icon icon="mdi:github" />
                </a>
              </Button>
              <TogglerDarkMode />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
