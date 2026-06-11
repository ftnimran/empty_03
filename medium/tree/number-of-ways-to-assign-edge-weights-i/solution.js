/**
 * @param {number[][]} edges
 * @return {number}
 */
var assignEdgeWeights = function (edges) {
  const MOD = 1000000007n;
  const n = edges.length + 1;

  const adj = Array.from({ length: n + 1 }, () => []);

  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  let maxDepth = 0;

  const dfs = (node, parent, depth) => {
    maxDepth = Math.max(maxDepth, depth);

    for (const nxt of adj[node]) {
      if (nxt !== parent) {
        dfs(nxt, node, depth + 1);
      }
    }
  };

  dfs(1, 0, 0);

  let ans = 1n;
  let base = 2n;
  let exp = BigInt(maxDepth - 1);

  while (exp > 0n) {
    if (exp & 1n) ans = (ans * base) % MOD;
    base = (base * base) % MOD;
    exp >>= 1n;
  }

  return Number(ans);
};
