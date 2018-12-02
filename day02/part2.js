module.exports = input => {
  const lines = input.split('\n');

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      let common = '';
      for (let k = 0; k < lines[i].length; k++) {
        if (lines[i][k] === lines[j][k]) {
          common += lines[i][k];
        }
      }

      if (common.length == lines[i].length - 1) {
        return common;
      }
    }
  }
}