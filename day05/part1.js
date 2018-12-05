module.exports = input => {
  const regex = new RegExp([...new Set([...input.toUpperCase()])]
    .map(e => `${e.toLowerCase()}${e}|${e}${e.toLowerCase()}`).join('|'), 'g');

  let replaced = input;
  let length = input.length;

  do {
    length = replaced.length;
    replaced = replaced.replace(regex, '');
  } while (replaced.length != length);

  return length;
}