import cheerio from 'cheerio';

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
    if ($(row).hasClass('hevent')) {
      const _row = $(row).find('td');
      events.push({
        event: _row.eq(0).text().trim(),
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
