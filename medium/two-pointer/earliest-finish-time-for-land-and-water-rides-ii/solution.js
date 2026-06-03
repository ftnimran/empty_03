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
  function preprocess(start, dur) {
    const rides = [];

    for (let i = 0; i < start.length; i++) {
      rides.push([start[i], dur[i]]);
    }

    rides.sort((a, b) => a[0] - b[0]);

    const n = rides.length;

    const starts = new Array(n);
    const pref = new Array(n);
    const suf = new Array(n);

    for (let i = 0; i < n; i++) {
      starts[i] = rides[i][0];

      pref[i] = i ? Math.min(pref[i - 1], rides[i][1]) : rides[i][1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const cur = rides[i][0] + rides[i][1];

      suf[i] = i === n - 1 ? cur : Math.min(cur, suf[i + 1]);
    }

    return [starts, pref, suf];
  }

  function upperBound(arr, target, l, r) {
    if (l > r) return r;

    const mid = (l + r) >> 1;

    if (arr[mid] <= target) {
      return upperBound(arr, target, mid + 1, r);
    }

    return upperBound(arr, target, l, mid - 1);
  }

  function getBest(T, starts, pref, suf) {
    const pos = upperBound(starts, T, 0, starts.length - 1);

    let ans = Infinity;

    if (pos >= 0) {
      ans = T + pref[pos];
    }

    if (pos + 1 < starts.length) {
      ans = Math.min(ans, suf[pos + 1]);
    }

    return ans;
  }

  const [wStarts, wPref, wSuf] = preprocess(waterStartTime, waterDuration);

  const [lStarts, lPref, lSuf] = preprocess(landStartTime, landDuration);

  let ans = Infinity;

  for (let i = 0; i < landStartTime.length; i++) {
    ans = Math.min(
      ans,
      getBest(landStartTime[i] + landDuration[i], wStarts, wPref, wSuf),
    );
  }

  for (let i = 0; i < waterStartTime.length; i++) {
    ans = Math.min(
      ans,
      getBest(waterStartTime[i] + waterDuration[i], lStarts, lPref, lSuf),
    );
  }

  return ans;
};
