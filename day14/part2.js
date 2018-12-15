module.exports = input => {
  const recipes = [3, 7];
  const pattern = [...input].map(Number);

  let elf1 = 0;
  let elf2 = 1;
  let i = 0;
  let p = 0;

  while (pattern.length != p) {
    p += recipes[i] == pattern[p] ? 1 : -p;
    i++;

    const combined = recipes[elf1] + recipes[elf2];

    if (combined > 9) {
      recipes.push(1);
    }
    recipes.push(combined % 10);

    elf1 = (elf1 + 1 + recipes[elf1]) % recipes.length;
    elf2 = (elf2 + 1 + recipes[elf2]) % recipes.length;
  }

  return i - p;
}