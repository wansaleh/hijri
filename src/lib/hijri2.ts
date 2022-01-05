function calc(date: Date, adjust: number) {
  let today = date;
  if (adjust) {
    const adjustmili = 1000 * 60 * 60 * 24 * adjust;
    const todaymili = today.getTime() + adjustmili;
    today = new Date(todaymili);
  }
  const wd = date.getDay() + 1;

  let day = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100.0);
  let b = 2 - a + Math.floor(a / 4.0);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524;

  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4.0);
  }
  const bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);
  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  const iyear = 10631.0 / 30.0;
  const epochastro = 1948084;
  // var epochcivil = 1948085; Not used

  const shift1 = 8.01 / 60.0;

  let z = jd - epochastro;
  const cyc = Math.floor(z / 10631.0);
  z = z - 10631 * cyc;
  const j = Math.floor((z - shift1) / iyear);
  const iy = 30 * cyc + j;
  z = z - Math.floor(j * iyear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) {
    im = 12;
  }
  const id = z - Math.floor(29.5001 * im - 29);

  return {
    day, //calculated day (CE)
    month: month - 1, //calculated month (CE)
    year, //calculated year (CE)
    jd: jd - 1, //julian day number
    wd: wd - 1, //weekday number
    id: id, //islamic date
    im: im - 1, //islamic month
    iy, //islamic year
  };
}

export default function Hijri(date: Date, adjustment: number) {
  const wdNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const iMonthNames = [
    'Muharram',
    'Safar',
    'Rabi I',
    'Rabi II',
    'Jumada I',
    'Jumada II',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qi'dah",
    'Dhu al-Hijjah',
  ];

  const iDate = calc(date, adjustment);

  return {
    dayOfWeek: wdNames[iDate.wd],
    dayOfMonth: iDate.id,
    month: iDate.im + 1,
    monthText: iMonthNames[iDate.im],
    year: iDate.iy,
  };
}
