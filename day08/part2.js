const read = (input, head) => {
  const children = [];
  const meta = [];

  let childCount = input[head++];
  let metaCount = input[head++];

  for (let i = 0; i < childCount; i++) {
    [node, head] = read(input, head);
    children.push(node);
  }

  for (let i = 0; i < metaCount; i++) {
    meta.push(input[head++]);
  }

  return [{ children, meta }, head];
}

const count = node =>
  node.children.length ?
    node.meta.reduce((sum, i) => sum + (node.children[i - 1] ? count(node.children[i - 1]) : 0), 0) :
    node.meta.reduce((sum, a) => sum + a);

module.exports = input => count(read(input.split(' ').map(Number), 0)[0])