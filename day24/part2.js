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
      const damage = this.effectivePower() * this.multiplier(this.target);
      const kills = Math.floor(damage / this.target.hp);

      this.target.size = Math.max(0, this.target.size - kills);

      return kills;
    }

    return 0;
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

  clone() {
    return new Group(this.type, this.size, this.hp, this.weaknesses, this.immune, this.power, this.attackType, this.initiative);
  }

}

const simulate = (groups, boost) => {
  groups = groups.map(g => g.clone());
  groups.filter(g => g.type == 'A').forEach(g => g.power += boost);

  while (groups.some(g => g.type == 'A' && g.size > 0) && groups.some(g => g.type == 'B' && g.size > 0)) {
    const inCombat = [];
    const sorted = groups.filter(g => g.size).sort((a, b) => {
      if (b.effectivePower() == a.effectivePower()) {
        return b.initiative - a.initiative;
      }

      return b.effectivePower() - a.effectivePower();
    });

    for (const group of sorted) {
      group.target = groups.filter(g => g.size && g.type != group.type && !inCombat.includes(g))
        .sort((a, b) => {
          if (group.damage(a) == group.damage(b)) {
            if (a.effectivePower() == b.effectivePower()) {
              return b.initiative - a.initiative;
            }
            return b.effectivePower() - a.effectivePower();
          }

          return group.damage(b) - group.damage(a);
        })[0];

      if (group.target && group.damage(group.target) == 0) {
        group.target = null;
      }

      if (group.target) {
        inCombat.push(group.target);
      }
    }


    let totalKills = 0;
    for (const group of groups.sort((a, b) => b.initiative - a.initiative)) {
      totalKills += group.attack();
    }

    if (totalKills == 0) {
      return 0;
    }
  }

  return groups.filter(g => g.type == 'A').map(g => g.size).reduce((sum, c) => sum + c);;
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

  let boost = 0;
  while (true) {
    let result = simulate(groups, boost);
    if (result) {
      return result;
    }

    boost++;
  }
}