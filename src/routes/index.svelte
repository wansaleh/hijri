<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, url }) {
    const year = url.searchParams.get('year') || new Date().getFullYear();
    const res = await fetch(`/events/${year}.json`).then((r) => r.json());
    const yearStart = await fetch(
      `https://api.aladhan.com/v1/gToH?date=01-01-${year}`
    ).then((r) => r.json());
    const yearEnd = await fetch(
      `https://api.aladhan.com/v1/gToH?date=31-12-${year}`
    ).then((r) => r.json());

    return {
      props: {
        _events: res.events,
        hijriYearStart: yearStart?.data?.hijri.year,
        hijriYearEnd: yearEnd?.data?.hijri.year,
        yearEnd,
      },
    };
  }
</script>

<script lang="ts">
  import { range } from 'lodash-es';
  import EventCard from '$lib/components/event-card.svelte';
  import type { HijriEvent } from '$lib/types/dates';

  import { parseISO } from 'date-fns';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  export let _events: HijriEvent[];
  export let hijriYearStart: string;
  export let hijriYearEnd: string;

  let events: HijriEvent[];
  $: events = _events.map((event) => ({
    ...event,
    dateObj: parseISO(event.date),
  }));

  let currentYear: number = new Date().getFullYear();
  $: currentYear = Number(
    $page.url.searchParams.get('year') || new Date().getFullYear()
  );

  let years = range(51).map((num) => num + 2000);
</script>

<div class="layout py-20 px-4 text-center">
  <h1 class="mb-4 text-7xl font-bold">{currentYear}</h1>
  <h2 class="mb-10 font-semibold">
    {hijriYearStart} &mdash; {hijriYearEnd}
    <a
      href="https://en.wikipedia.org/wiki/Hijri_year"
      rel="external nooopener noreferrer"
      target="_blank"
      title="Hijri Year"
      class="cursor-help border-b border-current border-dotted">AH</a
    >
  </h2>

  <div class="flex flex-wrap justify-center">
    {#each events as event}
      <EventCard {event} />
    {/each}
  </div>

  <div class="flex flex-wrap justify-center mt-20">
    {#each years as year}
      <button
        on:click={() => {
          goto(`/?year=${year}`);
        }}
        class="p-1 {year === currentYear && 'text-blue-500'} {year ===
          new Date().getFullYear() && 'font-bold'}"
      >
        {year}
      </button>
    {/each}
  </div>
</div>
