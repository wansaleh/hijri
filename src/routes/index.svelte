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
  import type { HijriEvent } from '$lib/types/dates';

  import { differenceInDays, format, parseISO } from 'date-fns';

  type Event = HijriEvent & { dateObj: Date };

  export let _events: HijriEvent[];

  const events: Event[] = _events.map((event) => ({
    ...event,
    dateObj: parseISO(event.date),
  }));
</script>

<div class="layout py-20 text-center">
  <div class="lg:grid-cols-3 grid grid-cols-1 gap-6">
    {#each events as event}
      <div class="p-8 rounded-3xl border-4 border-current">
        <div
          class="lg:text-2xl relative text-xl font-semibold tracking-tighter leading-normal"
        >
          {differenceInDays(event.dateObj, new Date())} days until
        </div>
        <div
          class="lg:text-4xl relative text-3xl font-semibold tracking-tight leading-none"
        >
          {event.name}
        </div>
        <div
          class="lg:text-2xl relative text-xl font-extralight tracking-tighter leading-normal"
        >
          {format(event.dateObj, 'd MMMM yyyy')}
        </div>
      </div>
    {/each}
  </div>
</div>
