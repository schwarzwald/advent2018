module.exports = input => {
  const letters = [...new Set([...input.toUpperCase()])];
  const regex = new RegExp(letters.map(e => `${e.toLowerCase()}${e}|${e}${e.toLowerCase()}`).join('|'), 'g');

  return letters.reduce((min, letter) => {
    let replaced = input.replace(new RegExp(letter, 'ig'), '');
    let length = replaced.length;

    do {
      length = replaced.length;
      replaced = replaced.replace(regex, '');
    } while (replaced.length != length);

    return Math.min(length, min);
  }, input.length);
}