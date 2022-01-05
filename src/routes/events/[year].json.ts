// Data scraped from al-habib.info

import redis from '$lib/redis';
import cheerio from 'cheerio';
import { isBefore, parse } from 'date-fns';
import { smartypantsu } from 'smartypants';

const translations = {
  'Start of Fasting Ramadan': 'Ramadhan',
  "Wuquf in 'Arafa (Hajj)": 'Day of Wuquf',
  'Days of Tashriq': 'Day of Tashriq',
  'Islamic New Year': 'Awal Muharram',
  "Fasting 'Ashura": "Day of 'Ashura",
  'Mawlid (Birth) of the Prophet': 'Mawlidur Rasul',
};

const slugs = {
  "Isra' Mi'raj": 'isramiraj',
  "Nisfu Sha'ban": 'nisfushaaban',
  Ramadhan: 'ramadhan',
  "Nuzul-al Qur'an": 'nuzulquran',
  'Eid ul-Fitr': 'eidulfitr',
  'Day of Wuquf': 'wuquf',
  'Eid ul-Adha': 'eiduladha',
  'Days of Tashriq': 'tashriq',
  'Awal Muharram': 'muharram',
  "Day of 'Ashura": 'ashura',
  'Mawlidur Rasul': 'mawlid',
};

function replaceTranslations(text: string): string {
  let output = text;
  Object.keys(translations).forEach((key) => {
    output = output.replace(key, translations[key]);
  });
  return output;
}
function replaceSlugs(text: string): string {
  let output = text;
  Object.keys(slugs).forEach((key) => {
    output = output.replace(key, slugs[key]);
  });
  return output;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
  const { year } = params;

  if (year < 2000 || year > 2100) {
    return {
      body: {
        error: 'Invalid year',
      },
    };
  }

  // 1. check redis cache
  const cache = JSON.parse(await redis.hget('events', year));
  if (cache && cache?.length) {
    return {
      body: { events: cache, cache: 'hit' },
    };
  }

  const url = `https://www.al-habib.info/islamic-calendar/global/global-islamic-calendar-year-${year}-ce.htm`;

  const body = await fetch(url).then((response) => response.text());
  const $ = cheerio.load(body);

  const rows = $('#hijrievents table tbody tr');

  const events = [];
  rows.each((i, row) => {
    const tr = $(row).find('td');
    const _name = replaceTranslations(tr.eq(0).text().trim());
    const slug = replaceSlugs(_name);
    const name = smartypantsu(_name);
    const gregorianDate = tr.eq(3).text().trim();
    const hijriDate = tr.eq(1).text().trim();
    const day = tr.eq(2).text().trim();
    const date = parse(gregorianDate, 'dd MMMM yyyy', new Date());
    const isPassed = isBefore(date, new Date());

    if ($(row).hasClass('hevent') && name !== 'Laylat al-Qadr') {
      events.push({
        slug,
        name,
        date,
        gregorianDate,
        hijriDate,
        day,
        isPassed,
      });
    }
  });

  // 2. cache to redis
  await redis.hset('events', year, JSON.stringify(events));

  return {
    body: { events, cache: 'miss' },
  };
}
