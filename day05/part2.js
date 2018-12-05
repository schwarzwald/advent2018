module.exports = input =>
  [...new Set([...input.toUpperCase()])].reduce((min, letter) =>
    Math.min(min, [...input.replace(new RegExp(letter, 'ig'), '')]
      .reduce((res, letter) => {
        if (res[res.length - 1] && res[res.length - 1] !== letter && res[res.length - 1].toUpperCase() === letter.toUpperCase()) {
          res.pop();
        } else {
          res.push(letter);
        }

        return res;
      }, []).length), input.length);