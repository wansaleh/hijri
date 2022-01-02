<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch }) {
    const res = await fetch('/events/2022.json');

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
  import type { HijriEvent } from '$lib/types/dates';

  import {
    differenceInDays,
    format,
    formatDistance,
    formatDistanceToNow,
    parse,
  } from 'date-fns';

  type Event = HijriEvent & { dateObj: Date };

  export let _events: HijriEvent[];

  const events: Event[] = _events.map((event) => ({
    ...event,
    dateObj: parse(event.date, 'yyyy-MM-dd', new Date()),
  }));

  let ramadhan = events.find(
    (event: Event) => event.name === 'Start of Fasting Ramadan'
  ) as Event;
</script>

<div class="layout text-center">
  <div class="grid grid-cols-1 lg:grid-cols-3">
    {#each events as event}
      <div class="p-8">
        <div
          class="lg:text-2xl relative text-xl leading-normal font-extralight tracking-tighter"
        >
          {differenceInDays(event.dateObj, new Date())} days until
        </div>
        <div
          class="lg:text-4xl relative text-3xl font-semibold tracking-tight leading-normal"
        >
          {event.name}
        </div>
        <div
          class="lg:text-2xl relative text-xl leading-normal font-extralight tracking-tighter"
        >
          {format(event.dateObj, 'd MMMM yyyy')}
        </div>
      </div>
    {/each}
  </div>
</div>
