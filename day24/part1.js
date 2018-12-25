class Group {
  constructor(type, size, hp, weaknesses, immune, power, attackType, initiative) {
    this.type = type;
    this.size = size;
    this.hp = hp;
    this.weaknesses = weaknesses;
    this.immune = immune;
    this.power = power;
    this.attackType = attackType;
    this.initiative = initiative;
    this.target = null;
  }

  effectivePower() {
    return this.size * this.power;
  }

  attack() {
    if (this.target && this.size) {
      const damage = this.damage(this.target);
      const kills = Math.floor(damage / this.target.hp);

      this.target.size = Math.max(0, this.target.size - kills)
    }
  }

  multiplier(defender) {
    if (defender.immune.includes(this.attackType)) {
      return 0;
    }

    if (defender.weaknesses.includes(this.attackType)) {
      return 2;
    }

    return 1;
  }

  damage(defender) {
    return this.effectivePower() * this.multiplier(defender)
  }

}

module.exports = input => {
  let type = 'A';
  const groups = [];

  for (let line of input.split('\n')) {
    if (line.includes('Immune System:')) {
      type = 'A';
    } else if (line.includes('Infection:')) {
      type = 'B';
    } else if (line.trim().length) {
      let match = /(\d+) units each with (\d+) hit points (.*)?with an attack that does (\d+) (\w+) damage at initiative (\d+)/.exec(line);
      let [_, size, hp, attr, dmg, attackType, initiative] = match
      attr = attr ? attr.trim().replace('(', '').replace(')', '') : '';

      let weakness = [];
      let immune = [];
      attr.split('; ').forEach(t => {
        if (t.includes('weak')) {
          weakness = t.substring(8).split(', ');
        }

        if (t.includes('immune')) {
          immune = t.substring(10).split(', ');
        }
      });

      groups.push(new Group(type, +size, +hp, weakness, immune, +dmg, attackType, +initiative));
    }
  }

  while (groups.some(g => g.type == 'A' && g.size > 0) && groups.some(g => g.type == 'B' && g.size > 0)) {
    const inCombat = [];
    const sorted = groups.filter(g => g.size).sort((a, b) => (b.effectivePower() * 100 + b.initiative) - (a.effectivePower() * 100 + a.initiative));

    for (const group of sorted) {
      group.target = groups.filter(g => g.size && g.type != group.type && !inCombat.includes(g))
        .sort((a, b) => {
          if (group.multiplier(a) == group.multiplier(b)) {
            if (a.effectivePower() == b.effectivePower()) {
              return b.initiative - a.initiative;
            }
            return b.effectivePower() - a.effectivePower();
          }

          return group.multiplier(b) - group.multiplier(a);
        })[0];

      if (group.target) {
        inCombat.push(group.target);
      }
    }

    for (const group of groups.sort((a, b) => b.initiative - a.initiative)) {
      group.attack();
    }
  }

  return groups.map(g => g.size).reduce((sum, c) => sum + c);
}