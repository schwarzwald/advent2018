module.exports = input => {
  const recipes = [3, 7];
  let elf1 = 0;
  let elf2 = 1;

  while (recipes.length < +input + 10) {
    let combined = recipes[elf1] + recipes[elf2];

    if (combined > 9) {
      recipes.push(1);
    }
    recipes.push(combined % 10);

    elf1 = (elf1 + 1 + recipes[elf1]) % recipes.length;
    elf2 = (elf2 + 1 + recipes[elf2]) % recipes.length;
  }

  return recipes.slice(+input, +input + 10).join('');
}