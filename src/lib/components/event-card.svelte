<script lang="ts">
  import type { HijriEvent } from '$lib/types/dates';
  import { differenceInDays, format } from 'date-fns';

  export let event: HijriEvent;

  let date = new Date();
  setInterval(() => {
    date = new Date();
  }, 30000);

  let featured = event.slug === 'ramadhan';
</script>

<div
  class="sm:w-1/2 md:w-1/3 p-3 w-full aspect-square {featured &&
    'md:w-2/3 sm:w-full'}"
>
  <div
    class="md:p-8 flex relative flex-col justify-center p-5 h-full rounded-3xl border-4 border-current"
  >
    <div
      class="lg:text-2xl flex relative justify-center items-center text-xl font-semibold {featured &&
        'lg:text-3xl text-2xl'}"
    >
      {#if featured}
        <div class="pulse inline-block" />
      {/if}
      {differenceInDays(event.dateObj, date)} days until
    </div>
    <div
      class="lg:text-4xl font-head relative text-3xl font-semibold tracking-tight leading-none {featured &&
        'lg:text-7xl text-5xl'}"
    >
      {event.name}
    </div>
    <div
      class="lg:text-base absolute left-0 bottom-4 w-full text-sm font-extrabold leading-none text-center text-gray-500 {featured &&
        'lg:text-xl text-lg'}"
    >
      {format(event.dateObj, 'd MMMM yyyy')}
    </div>
  </div>
</div>
{#if featured}
  <div class="h-0" style="flex-basis: 100%;" />
{/if}
