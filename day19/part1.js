const addr = (a, b, c, reg) => reg[c] = reg[a] + reg[b];
const addi = (a, b, c, reg) => reg[c] = reg[a] + b;

const mulr = (a, b, c, reg) => reg[c] = reg[a] * reg[b];
const muli = (a, b, c, reg) => reg[c] = reg[a] * b;

const banr = (a, b, c, reg) => reg[c] = reg[a] & reg[b];
const bani = (a, b, c, reg) => reg[c] = reg[a] & b;

const borr = (a, b, c, reg) => reg[c] = reg[a] | reg[b];
const bori = (a, b, c, reg) => reg[c] = reg[a] | b;

const setr = (a, b, c, reg) => reg[c] = reg[a];
const seti = (a, b, c, reg) => reg[c] = a;

const gtir = (a, b, c, reg) => reg[c] = (a > reg[b] ? 1 : 0);
const gtri = (a, b, c, reg) => reg[c] = (reg[a] > b ? 1 : 0);
const gtrr = (a, b, c, reg) => reg[c] = (reg[a] > reg[b] ? 1 : 0);

const eqir = (a, b, c, reg) => reg[c] = (a == reg[b] ? 1 : 0);
const eqri = (a, b, c, reg) => reg[c] = (reg[a] == b ? 1 : 0);
const eqrr = (a, b, c, reg) => reg[c] = (reg[a] == reg[b] ? 1 : 0);

const instructions = [addi, addr, muli, mulr, bani, banr, bori, borr, seti, setr, gtir, gtri, gtrr, eqir, eqri, eqrr];

module.exports = input => {
  const lines = input.split('\n');
  const program = lines.slice(1).map(e => e.trim().split(' ').map((e, i) => i > 0 ? +e : e));

  const map = new Map();
  instructions.forEach(i => map.set(i.name, i));

  let ipr = +lines[0].match(/(\d+)/)[1]
  let ip = 0;

  let registers = [0, 0, 0, 0, 0, 0];

  while (ip >= 0 && ip < program.length) {
    registers[ipr] = ip;
    console.log(registers)
    const args = program[ip];

    map.get(args[0])(args[1], args[2], args[3], registers);
    ip = registers[ipr] + 1;
  };

  return registers[0];
}