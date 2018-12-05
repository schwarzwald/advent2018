module.exports = input =>
  [...input].reduce((res, letter) => {
    if (res[res.length - 1] && res[res.length - 1] !== letter && res[res.length - 1].toUpperCase() === letter.toUpperCase()) {
      res.pop();
    } else {
      res.push(letter);
    }

    return res;
  }, []).length;