import cheerio from 'cheerio';
import { format, isBefore, parse } from 'date-fns';
import { smartypantsu } from 'smartypants';

const translations = {
  'Start of Fasting Ramadan': 'Ramadhan',
  "Wuquf in 'Arafa (Hajj)": 'Day of Wuquf',
  'Days of Tashriq': 'Day of Tashriq',
  'Islamic New Year': 'Awal Muharram',
  "Fasting 'Ashura": "Day of 'Ashura",
  'Mawlid (Birth) of the Prophet': 'Mawlidur Rasul',
};

function replaceTranslations(text: string): string {
  let output = text;
  Object.keys(translations).forEach((key) => {
    output = output.replace(key, translations[key]);
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

  const url = `https://www.al-habib.info/islamic-calendar/global/global-islamic-calendar-year-${year}-ce.htm`;

  const body = await fetch(url).then((response) => response.text());
  const $ = cheerio.load(body);

  const rows = $('#hijrievents table tbody tr');

  const events = [];
  rows.each((i, row) => {
    const tr = $(row).find('td');
    const name = smartypantsu(replaceTranslations(tr.eq(0).text().trim()));
    const gregorianDate = tr.eq(3).text().trim();
    const hijriDate = tr.eq(1).text().trim();
    const day = tr.eq(2).text().trim();
    const date = parse(gregorianDate, 'dd MMMM yyyy', new Date());
    const isPassed = isBefore(date, new Date());

    if ($(row).hasClass('hevent') && name !== 'Laylat al-Qadr') {
      events.push({
        name,
        date,
        gregorianDate,
        hijriDate,
        day,
        isPassed,
      });
    }
  });

  return {
    body: { events },
  };
}
