/**
 * @param {number[]} cost
 * @return {number}
 */
var minimumCost = function (cost) {
  cost.sort((a, b) => b - a);

  function dfs(i) {
    if (i >= cost.length) return 0;

    let cur = cost[i];

    if (i + 1 < cost.length) {
      cur += cost[i + 1];
    }

    return cur + dfs(i + 3);
  }

  return dfs(0);
};
