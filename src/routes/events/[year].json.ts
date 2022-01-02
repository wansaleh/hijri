import cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import { smartypantsu } from 'smartypants';

const translations = {
  'Start of Fasting Ramadan': 'Start of Ramadhan',
  "Wuquf in 'Arafa (Hajj)": "Wuquf in 'Arafa",
  'Days of Tashriq': 'Day of Tashriq',
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
    const _row = $(row).find('td');
    if (
      $(row).hasClass('hevent') &&
      _row.eq(0).text().trim() !== 'Laylat al-Qadr'
    ) {
      events.push({
        name: smartypantsu(replaceTranslations(_row.eq(0).text().trim())),
        date: format(
          parse(_row.eq(3).text().trim(), 'dd MMMM yyyy', new Date()),
          'yyyy-MM-dd'
        ),
        gregorianDate: _row.eq(3).text().trim(),
        hijriDate: _row.eq(1).text().trim(),
        day: _row.eq(2).text().trim(),
      });
    }
  });

  return {
    body: { events },
  };
}
