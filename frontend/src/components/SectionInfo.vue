<script setup lang="ts">
import { Alert, AlertDescription } from "@/components/ui/alert";
import BaseStepper from "@/components/BaseStepper.vue";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";

const steps = [
  {
    step: 1,
    title: "Copy iCal URL",
    description:
      "Click the iCal link (download the .ics file or copy the URL).",
  },
  {
    step: 2,
    title: "Open Calendar App",
    description:
      "Open your calendar app (Google Calendar / Apple Calendar / Outlook).",
  },
  {
    step: 3,
    title: "Import or Subscribe",
    description: "Choose “Import” or “Subscribe” and paste the iCal link.",
  },
];

const supportApps = [
  {
    name: "Google Calendar",
    icon: "/google_Calendar_icon.svg",
    icalHelpLink:
      "https://support.google.com/calendar/answer/37118?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Cexport-from-a-different-google-account",
  },
  {
    name: "Apple Calendar",
    icon: "/icon-apple-calendar.png",
    icalHelpLink: "https://support.apple.com/en-au/guide/calendar/icl1023/mac",
  },
  {
    name: "Outlook",
    icon: "/icon-outlook-calendar.png",
    icalHelpLink:
      "https://support.microsoft.com/en-us/office/import-calendars-into-outlook-8e8364e1-400e-4c0f-a573-fe76b5a2d379",
  },
];
</script>

<template>
  <div class="container max-w-xl py-20 space-y-12">
    <div class="space-y-20">
      <div class="space-y-6">
        <h2 class="text-4xl font-bold" id="what-is-ical">
          What is
          <span class="underline decoration-primary decoration-4">iCal</span>
          and Why Use It?
        </h2>
        <p class="text-lg">
          iCal (.ics) is a calendar file format that lets you easily sync events
          with Google, Apple, Outlook, and other calendar apps.
        </p>
        <p class="text-lg">
          By subscribing to an iCal link, your schedule updates automatically—no
          need for manual entry!
        </p>
        <Alert>
          <AlertDescription>
            If you really want to know the details, feel free to read
            <a
              href="https://en.wikipedia.org/wiki/ICalendar"
              target="_blank"
              class="underline"
              >iCal Wikipedia</a
            >.
          </AlertDescription>
        </Alert>
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <h3 class="text-3xl font-bold">
            <span class="underline decoration-primary decoration-4">How</span>
            to Use iCal?
          </h3>
          <p class="text-muted-foreground">Super Easy 3 Steps</p>
        </div>
        <BaseStepper :steps="steps" class="py-4" />
        <p>That’s it! Your events will now sync automatically!</p>
      </div>

      <div class="space-y-6">
        <div class="space-y-6">
          <div class="space-y-2">
            <h3 class="text-3xl font-bold">Supported Apps</h3>
            <p class="text-muted-foreground">
              Or any other iCal-compatible apps
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              v-for="app in supportApps"
              :key="app.name"
              class="flex flex-col"
            >
              <CardHeader class="flex items-center justify-center">
                <img :src="app.icon" :alt="app.name" class="w-14 h-14" />
              </CardHeader>
              <CardContent class="grow flex flex-col">
                <p class="text-center">
                  {{ app.name }}
                </p>
                <Button as-child variant="link">
                  <a
                    :href="app.icalHelpLink"
                    target="_blank"
                    class="inline-block w-full mt-auto"
                  >
                    Official Guide
                    <Icon
                      icon="mdi:external-link"
                      class="text-muted-foreground"
                    />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
