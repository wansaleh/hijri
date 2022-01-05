import redis from '$lib/redis';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }) {
  const year = url.searchParams.get('year');

  let yearStart, yearEnd;

  // 1. check redis cache
  const cache = JSON.parse(await redis.hget('hijriyears', year));
  if (cache && cache.yearStart && cache.yearEnd) {
    yearStart = cache.yearStart;
    yearEnd = cache.yearEnd;
  } else {
    const ys = await fetch(
      `https://api.aladhan.com/v1/gToH?date=01-01-${year}`
    ).then((r) => r.json());
    const ye = await fetch(
      `https://api.aladhan.com/v1/gToH?date=31-12-${year}`
    ).then((r) => r.json());

    yearStart = ys?.data?.hijri.year;
    yearEnd = ye?.data?.hijri.year;

    // 2. cache to redis
    await redis.hset(
      'hijriyears',
      year,
      JSON.stringify({
        yearStart: yearStart,
        yearEnd: yearEnd,
      })
    );
  }

  return {
    body: {
      yearStart,
      yearEnd,
    },
  };
}
