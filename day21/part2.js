module.exports = input => {
  let [r0, r1, r2, r3, r4, r5] = [0, 0, 0, 0, 0, 0];
  const results = [];

  r5 = 0

  while (true) {
    r3 = r5 | 65536
    r5 = 9010242

    while (true) {
      r5 = ((r5 + (r3 % 256)) * 65899) % 16777216

      if (256 > r3) {
        if (results.includes(r5)) {
          return results.pop();
        } else {
          results.push(r5)
        }
        break;
      } else {
        r3 = r3 / 256 | 0;
      }
    }
  }
}