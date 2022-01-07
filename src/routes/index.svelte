<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, url }) {
    const year = url.searchParams.get('year') || new Date().getFullYear();
    const res = await fetch(`/events.json?year=${year}`).then((r) => r.json());
    const resYears = await fetch(`/hijriyear.json?year=${year}`).then((r) =>
      r.json()
    );

    return {
      props: {
        _events: res.events,
        hijriYearStart: resYears.yearStart,
        hijriYearEnd: resYears.yearEnd,
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
  import Seo from '$lib/components/seo.svelte';

  export let _events: HijriEvent[];
  export let hijriYearStart: string;
  export let hijriYearEnd: string;

  let events: HijriEvent[];
  $: events = _events.map((event) => ({
    ...event,
    dateObj: parseISO(event.date),
  }));

  $: currentYear = Number(
    $page.url.searchParams.get('year') || new Date().getFullYear()
  );

  let years = range(51).map((num) => num + 2000);
</script>

<Seo templateTitle="{currentYear} / {hijriYearStart}&ndash;{hijriYearEnd} AH" />

<div class="layout py-20 px-4 text-center">
  <h1 class="mb-2 font-extrabold leading-none">
    {currentYear}
    <select
      value={currentYear}
      on:change={(e) =>
        goto(`/?year=${e.currentTarget.value}`, { replaceState: false })}
      class="text-2xl bg-transparent outline-none"
    >
      {#each years as year (year)}
        <option value={year}>{year}</option>
      {/each}
    </select>
  </h1>
  <h3 class="mb-10 font-semibold leading-none">
    {hijriYearStart} &ndash; {hijriYearEnd}
    <a
      href="https://en.wikipedia.org/wiki/Hijri_year"
      rel="external nooopener noreferrer"
      target="_blank"
      title="Hijri Year"
      class="cursor-help border-b border-current border-dotted">AH</a
    >
  </h3>

  <div class="flex flex-wrap justify-center">
    {#each events as event}
      <EventCard {event} />
    {/each}
  </div>

  <!-- <div class="flex flex-wrap justify-center mt-10">
    {#each years as year}
      <button
        on:click={() => {
          goto(`/?year=${year}`);
        }}
        class="px-2 hover:bg-gray-500/30 rounded-full tracking-tight text-sm
        {year === currentYear && 'text-blue-500'}
        {year === new Date().getFullYear() && 'font-bold'}"
      >
        {year}
      </button>
    {/each}
  </div> -->
</div>
