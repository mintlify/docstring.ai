export default [
  {
    id: 'encrypt',
    languageId: 'python',
    format: 'reST',
    code: `def encrypt_char(c):
  if c in ascii_uppercase:
      ltrs = ascii_uppercase
  elif c in ascii_lowercase:
      ltrs = ascii_lowercase
  else:
      return c
  new_index = (ltrs.index(c) + 13) % 26
  return ltrs[new_index]`,
  },
  {
    id: 'treeVertex',
    languageId: 'python',
    format: 'reST',
    code: `def create_tree(tree, vertex_values):
  nodes = {value: TreeNode(value) for value in vertex_values}
  for i, row in enumerate(tree):
    node = nodes[vertex_values[i]]
    for j, is_connected in enumerate(row):
      if j <= i:
        continue
      if is_connected:
        node.connected.append(nodes[vertex_values[j]])
  head = nodes[vertex_values[0]]
  return head`,
  },
  {
    id: 'TSFirstNode',
    languageId: 'typescript',
    format: 'JSDoc',
    code: `export const getFirstNodeByValue = (node: TreeNode | null, value: string): TreeNode | null => {
  if (node?.children == null) {
    return null;
  }
  if (node.value === value.trim()) {
    return node;
  }

  let i = 0;
  let result = null;
  for(i = 0; result == null && i < node.children.length; i++){
    result = getFirstNodeByValue(node.children[i], value);
  }
  return result;
}`,
  },
  {
    id: 'binarySearch',
    languageId: 'javascript',
    format: 'JSDoc',
    code: `function binarySearch(array, target, start = 0, end = array.length - 1) {

  const isOrdered = array.every((num, i, arr) => !i || num >= arr[i - 1]);
  if (!isOrdered) return error;
  
  const middleIndex = Math.floor((start + end) / 2);
  const middleValue = array[middleIndex];
  const newIndexes = target < middleValue ? [start, middleIndex - 1] : [middleIndex + 1, end];
  
  return middleValue === target
    ? true
    : start >= end
      ? false
      : binarySearch(array, target, ...newIndexes);
  };`,
  },
  {
    id: 'orgToken',
    languageId: 'javascript',
    format: 'Google',
    code: `async function getOrganizationFromToken(token) {
  const authToken = await AuthToken.findOne({ promptlyToken: token });

  if (authToken == null) throw new Error('Invalid token');
  const organization = await Organization.findOne({
    members: authToken.email,
  });

  if (organization == null) throw new Error('No organization found');

  return organization;
}`,
  },
];
