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

const instructions = [addi, addr, muli, mulr, bani, banr, bori, borr, seti, setr, gtir, gtri, gtrr, eqir, eqri, eqrr];

module.exports = input => {
  const lines = input.split('\n');
  const opcodes = new Map();

  for (let i = 0; i < 16; i++) {
    opcodes.set(i, instructions.map(instr => instr.name));
  }

  let offset = 0
  for (let i = 0; i < lines.length; i += 4) {
    if (!lines[i].includes('Before')) {
      offset = i;
      break;
    }

    const before = lines[i].substring(9, 19).split(', ').map(Number);
    const inputs = lines[i + 1].split(' ').map(Number);
    const after = lines[i + 2].substring(9, 19).split(', ').map(Number);

    let matching = [];

    for (const instr of instructions) {
      let result = instr(...inputs.slice(1), before);

      if (compare(after, result)) {
        matching.push(instr.name);
      }
    }

    opcodes.set(inputs[0], opcodes.get(inputs[0]).filter(instr => matching.includes(instr)));
  }

  const processed = new Map();

  while (processed.size < 16) {
    const [op, instrs] = [...opcodes.entries()].find(([i, instr]) => instr.length == 1 && !processed.has(i));
    processed.set(op, instrs[0]);

    for (let i = 0; i < 16; i++) {
      if (i == op) {
        continue;
      }

      opcodes.set(i, opcodes.get(i).filter(instr => instr !== instrs[0]));
    }
  }

  let registers = [0, 0, 0, 0];

  for (let i = offset + 2; i < lines.length; i++) {
    const inputs = lines[i].split(' ').map(Number);
    registers = instructions.find(i => i.name == processed.get(inputs[0]))(...inputs.slice(1), registers);
  }

  return registers[0];
}