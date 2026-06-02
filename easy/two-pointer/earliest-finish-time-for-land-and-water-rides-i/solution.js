/**
 * @param {number[]} landStartTime
 * @param {number[]} landDuration
 * @param {number[]} waterStartTime
 * @param {number[]} waterDuration
 * @return {number}
 */
var earliestFinishTime = function (
  landStartTime,
  landDuration,
  waterStartTime,
  waterDuration,
) {
  const n = landStartTime.length;
  const m = waterStartTime.length;

  function dfs(i, j, best) {
    if (i === n) return best;

    if (j === m) {
      return dfs(i + 1, 0, best);
    }

    let landFinish = landStartTime[i] + landDuration[i];

    let finish1 = Math.max(landFinish, waterStartTime[j]) + waterDuration[j];

    let waterFinish = waterStartTime[j] + waterDuration[j];

    let finish2 = Math.max(waterFinish, landStartTime[i]) + landDuration[i];

    best = Math.min(best, finish1, finish2);

    return dfs(i, j + 1, best);
  }

  return dfs(0, 0, Infinity);
};
