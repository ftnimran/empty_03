/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[][]} descriptions
 * @return {TreeNode}
 */
var createBinaryTree = function (descriptions) {
  const graph = new Map();
  const children = new Set();

  for (const [parent, child, isLeft] of descriptions) {
    if (!graph.has(parent)) graph.set(parent, []);

    graph.get(parent).push([child, isLeft]);
    children.add(child);
  }

  let rootVal;

  for (const [parent] of descriptions) {
    if (!children.has(parent)) {
      rootVal = parent;
      break;
    }
  }

  const created = new Map();

  function dfs(val) {
    if (!created.has(val)) created.set(val, new TreeNode(val));

    const node = created.get(val);

    if (!graph.has(val)) return node;

    for (const [child, isLeft] of graph.get(val)) {
      const childNode = dfs(child);

      if (isLeft) node.left = childNode;
      else node.right = childNode;
    }

    return node;
  }

  return dfs(rootVal);
};
