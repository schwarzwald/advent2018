module.exports = input =>
  input.split('\n')
    .reduce(([two, three], curr) => {
      const letters = [...curr];
      let twos = false;
      let threes = false;

      for (let x of letters) {
        twos = twos || letters.filter(e => e === x).length == 2;
        threes = threes || letters.filter(e => e === x).length == 3;
      }
      return [two + (twos ? 1 : 0), three + (threes ? 1 : 0)];
    }, [0, 0])
    .reduce((res, curr) => res *= curr, 1);