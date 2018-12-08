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

const count = node => node.meta.reduce((sum, a) => sum + a) + node.children.reduce((sum, child) => sum + count(child), 0);

module.exports = input => count(read(input.split(' ').map(Number), 0)[0])