<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch }) {
    const res = await fetch('/events/2022.json');

    if (res.ok) {
      return {
        props: {
          events: (await res.json()).events,
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

  export let events: Event[];
  let ramadhan = events.find(
    (event: Event) => event.name === 'Start of Fasting Ramadan'
  );
  ramadhan.dateObj = parse(ramadhan.date, 'yyyy-MM-dd', new Date());

  let date = new Date();
  setInterval(() => {
    date = new Date();
  }, 30000);
</script>

<div class="layout text-center">
  <div
    class="lg:text-5xl relative text-3xl leading-normal font-extralight tracking-tighter"
  >
    {differenceInDays(ramadhan.dateObj, new Date())} days before
  </div>
  <div
    class="lg:text-7xl relative text-5xl font-semibold tracking-tight leading-normal"
  >
    Ramadhan
  </div>
  <div
    class="lg:text-5xl relative text-3xl leading-normal font-extralight tracking-tighter"
  >
    {format(ramadhan.dateObj, 'd MMMM yyyy')}
  </div>
</div>
