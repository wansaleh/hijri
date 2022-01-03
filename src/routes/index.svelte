<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, url }) {
    const year = url.searchParams.get('year') || new Date().getFullYear();
    const res = await fetch(`/events/${year}.json`);

    if (res.ok) {
      return {
        props: {
          _events: (await res.json()).events,
        },
      };
    }

    return {
      status: res.status,
      error: new Error(`Could not load events.`),
    };
  }
</script>

<script lang="ts">
  import EventCard from '$lib/components/event-card.svelte';
  import type { HijriEvent } from '$lib/types/dates';

  import { differenceInDays, format, parseISO } from 'date-fns';

  export let _events: HijriEvent[];

  const events: HijriEvent[] = _events.map((event) => ({
    ...event,
    dateObj: parseISO(event.date),
  }));
</script>

<div class="layout py-20 px-4 text-center">
  <div class="flex flex-wrap justify-center">
    {#each events as event}
      <EventCard {event} />
    {/each}
  </div>
</div>
