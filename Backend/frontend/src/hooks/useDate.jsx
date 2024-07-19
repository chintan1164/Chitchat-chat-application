export const useDate = (timestamp) => {
  const locale = 'en';
  const date = new Date(timestamp);

  const day = date.toLocaleDateString(locale, { weekday: 'long' });
  const formattedDate = `${date.getDate()} ${date.toLocaleDateString(locale, { month: 'long' })}`;

  const time = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: false, minute: 'numeric' });

  return {
    date: formattedDate,
    time
  };
};
