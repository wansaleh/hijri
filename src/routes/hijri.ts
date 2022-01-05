const islamicDates = [
  {
    date: '01-01',
    event: 'Awwal Muharram',
  },
  {
    date: '01-10',
    event: "Day of 'Ashura",
  },
  {
    date: '03-12',
    event: 'Mawlidur Rasul',
  },
  {
    date: '07-27',
    event: "Isra' Mi'raj",
  },
  {
    date: '08-15',
    event: "Nisfu Sha'ban",
  },
  {
    date: '09-01',
    event: 'Ramadhan',
  },
  {
    date: '09-17',
    event: "Nuzul al-Qur'an",
  },
  {
    date: '10-01',
    event: 'Eid ul-Fitr',
  },
  {
    date: '12-09',
    event: 'Day of Wuquf',
  },
  {
    date: '12-10',
    event: 'Eid ul-Adha',
  },
  {
    date: '12-11',
    event: 'Days of Tashriq',
  },
];

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }) {
  // const date = url.searchParams.get('date');
  // const [year, month, day] = date.split('-');

  const today = new Date();
  const tDay = today.getDate();
  const tMonth = today.getMonth() + 1;
  const tYear = today.getFullYear();

  const result = await fetch(
    `https://api.aladhan.com/v1/gToH?date=${tDay}-${tMonth}-${tYear}`
  ).then((response) => response.json());

  const hYear = result.data.hijri.year;

  const holidays = await Promise.all(
    islamicDates.map(async ({ date, event }) => {
      const [month, day] = date.split('-');

      const dateResult = await fetch(
        `https://api.aladhan.com/v1/hToG?date=${day}-${month}-${hYear}`
      ).then((response) => response.json());

      if (!dateResult || !dateResult.data) {
        return {
          body: { error: 'Invalid' },
        };
      }

      const [gDay, gMonth, gYear] = dateResult.data.gregorian.date.split('-');
      const [hDay, hMonth] = dateResult.data.hijri.date.split('-');

      return {
        event,
        date: {
          day: dateResult.data.gregorian.weekday.en,
          gregorian: `${gYear}-${gMonth}-${gDay}`,
          hijri: `${hYear}-${hMonth}-${hDay}`,
        },
      };
    })
  );

  return {
    body: {
      holidays,
    },
  };
}
