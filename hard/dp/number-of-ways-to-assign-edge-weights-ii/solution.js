/**
 * @param {number[][]} edges
 * @param {number[][]} queries
 * @return {number[]}
 */
var assignEdgeWeights = function (edges, queries) {
  const MOD = 1000000007;
  const n = edges.length + 1;

  const g = Array.from({ length: n + 1 }, () => []);

  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }

  const LOG = Math.ceil(Math.log2(n)) + 1;

  const depth = Array(n + 1).fill(0);
  const up = Array.from({ length: LOG }, () => Array(n + 1).fill(0));

  const q = [1];
  let head = 0;

  while (head < q.length) {
    const u = q[head++];

    for (const v of g[u]) {
      if (v === up[0][u]) continue;

      up[0][v] = u;
      depth[v] = depth[u] + 1;

      q.push(v);
    }
  }

  for (let j = 1; j < LOG; j++) {
    for (let i = 1; i <= n; i++) {
      up[j][i] = up[j - 1][up[j - 1][i]];
    }
  }

  function lca(a, b) {
    if (depth[a] < depth[b]) {
      [a, b] = [b, a];
    }

    let diff = depth[a] - depth[b];

    for (let j = LOG - 1; j >= 0; j--) {
      if (diff >= 1 << j) {
        a = up[j][a];
        diff -= 1 << j;
      }
    }

    if (a === b) return a;

    for (let j = LOG - 1; j >= 0; j--) {
      if (up[j][a] !== up[j][b]) {
        a = up[j][a];
        b = up[j][b];
      }
    }

    return up[0][a];
  }

  const pow2 = Array(n + 1).fill(1);

  for (let i = 1; i <= n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % MOD;
  }

  const ans = [];

  for (const [u, v] of queries) {
    const p = lca(u, v);

    const dist = depth[u] + depth[v] - 2 * depth[p];

    ans.push(dist === 0 ? 0 : pow2[dist - 1]);
  }

  return ans;
};
