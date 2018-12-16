const addr = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] + reg[b] : v);
const addi = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] + b : v);

const mulr = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] * reg[b] : v);
const muli = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] * b : v);

const banr = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] & reg[b] : v);
const bani = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] & b : v);

const borr = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] | reg[b] : v);
const bori = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] | b : v);

const setr = (a, b, c, reg) => reg.map((v, i) => i == c ? reg[a] : v);
const seti = (a, b, c, reg) => reg.map((v, i) => i == c ? a : v);

const gtir = (a, b, c, reg) => reg.map((v, i) => i == c ? (a > reg[b] ? 1 : 0) : v);
const gtri = (a, b, c, reg) => reg.map((v, i) => i == c ? (reg[a] > b ? 1 : 0) : v);
const gtrr = (a, b, c, reg) => reg.map((v, i) => i == c ? (reg[a] > reg[b] ? 1 : 0) : v);

const eqir = (a, b, c, reg) => reg.map((v, i) => i == c ? (a == reg[b] ? 1 : 0) : v);
const eqri = (a, b, c, reg) => reg.map((v, i) => i == c ? (reg[a] == b ? 1 : 0) : v);
const eqrr = (a, b, c, reg) => reg.map((v, i) => i == c ? (reg[a] == reg[b] ? 1 : 0) : v);

const compare = (arr1, arr2) => arr1.length == arr2.length && arr1.every((v, i) => arr2[i] == v);

module.exports = input => {
  const lines = input.split('\n');
  let threeAndMore = 0;

  for (let i = 0; i < lines.length; i += 4) {
    if (!lines[i].includes('Before')) {
      break;
    }

    const before = lines[i].substring(9, 19).split(', ').map(Number);
    const inputs = lines[i + 1].split(' ').map(Number).slice(1);
    const after = lines[i + 2].substring(9, 19).split(', ').map(Number);

    let matching = 0;

    for (const instr of [addi, addr, muli, mulr, bani, banr, bori, borr, seti, setr, gtir, gtri, gtrr, eqir, eqri, eqrr]) {
      let result = instr(...inputs, before);

      if (compare(after, result)) {
        matching++;
      }
    }

    if (matching >= 3) {
      threeAndMore++;
    }
  }

  return threeAndMore;
}