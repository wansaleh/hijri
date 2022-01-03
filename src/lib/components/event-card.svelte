<script lang="ts">
  import type { HijriEvent } from '$lib/types/dates';
  import { differenceInDays, format } from 'date-fns';

  export let event: HijriEvent;

  let date = new Date();
  setInterval(() => {
    date = new Date();
  }, 30000);

  let featured = event.slug === 'ramadhan';

  let daysDiff = differenceInDays(event.dateObj, date);

  const translations = {
    Rajab: 'Raj',
    "Sha'ban": 'Shb',
    Ramadan: 'Ram',
    Shawwal: 'Shw',
    'Dhul-Hijjah': 'Dhu-I',
    Muharram: 'Muh',
    "Rabi' al-Awwal": 'Rab-I',
  };

  function replaceTranslations(text: string): string {
    let output = text;
    Object.keys(translations).forEach((key) => {
      output = output.replace(key, translations[key]);
    });
    return output;
  }
</script>

<div
  class="md:w-1/3 lg:w-1/4 p-3 w-1/2 aspect-square {featured &&
    'md:!w-2/3 lg:!w-1/2 !w-full'}"
>
  <div
    class="lg:p-6 flex relative flex-col justify-center p-4 h-full rounded-3xl border-4 border-current {featured &&
      'bg-black text-white dark:bg-white dark:text-black'}"
  >
    <div
      class="lg:text-xl flex relative justify-center items-center text-lg font-medium tracking-wide {featured &&
        'lg:!text-3xl text-!2xl'}"
    >
      <!-- {#if featured}
        <div class="pulse inline-block" />
      {/if} -->
      {Math.abs(daysDiff)} days
      {daysDiff > 0 ? 'until' : 'since'}
    </div>

    <div
      class="lg:text-4xl font-head relative text-3xl font-medium tracking-normal !leading-[0.9] {featured &&
        'lg:text-7xl text-5xl font-semibold'}"
    >
      {event.name}
    </div>

    <div
      class="lg:text-sm absolute bottom-0 left-0 w-full text-xs font-semibold leading-none text-center"
    >
      <span
        class="dark:bg-white dark:text-black inline-block py-1 px-4 pb-0.5 text-white bg-black rounded-tl-xl rounded-tr-xl {featured &&
          'dark:bg-black dark:text-white text-black bg-white'}"
        >{format(event.dateObj, 'd MMM yyyy')} &middot; {replaceTranslations(
          event.hijriDate.replace(/ AH$/, '')
        )}</span
      >
    </div>
  </div>
</div>
{#if featured}
  <div class="h-0" style="flex-basis: 100%;" />
{/if}
