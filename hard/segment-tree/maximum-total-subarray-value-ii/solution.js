/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxTotalValue = function (nums, k) {
  const n = nums.length;

  const st = new SegmentTree(nums);

  const pq = new CustomMaxPriorityQueue((a, b) => b[0] - a[0]);

  const ansVal = st.query(0, n - 1);
  pq.offer([ansVal[1] - ansVal[0], 0, n - 1]);

  const visited = new Set();
  visited.add(0 * 100000 + (n - 1));

  let ans = 0;

  while (k > 0 && !pq.isEmpty()) {
    const curr = pq.poll();

    ans += curr[0];
    k--;

    const l = curr[1];
    const r = curr[2];

    if (l + 1 <= r) {
      const hash1 = (l + 1) * 100000 + r;
      if (!visited.has(hash1)) {
        const val = st.query(l + 1, r);
        visited.add(hash1);
        pq.offer([val[1] - val[0], l + 1, r]);
      }
    }

    if (l <= r - 1) {
      const hash2 = l * 100000 + (r - 1);
      if (!visited.has(hash2)) {
        const val = st.query(l, r - 1);
        visited.add(hash2);
        pq.offer([val[1] - val[0], l, r - 1]);
      }
    }
  }

  return ans;
};

class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.maxValues = new Array(4 * this.n);
    this.minValues = new Array(4 * this.n);
    if (this.n > 0) {
      this._build(1, 0, this.n - 1, nums);
    }
  }

  _build(node, lo, hi, nums) {
    if (lo === hi) {
      this.maxValues[node] = nums[lo];
      this.minValues[node] = nums[lo];
      return;
    }
    const mid = lo + Math.floor((hi - lo) / 2);
    this._build(2 * node, lo, mid, nums);
    this._build(2 * node + 1, mid + 1, hi, nums);
    this.maxValues[node] = Math.max(
      this.maxValues[2 * node],
      this.maxValues[2 * node + 1],
    );
    this.minValues[node] = Math.min(
      this.minValues[2 * node],
      this.minValues[2 * node + 1],
    );
  }

  query(l, r) {
    return this._query(1, 0, this.n - 1, l, r);
  }

  _query(node, lo, hi, l, r) {
    if (r < lo || l > hi) {
      return [Infinity, -Infinity];
    }

    if (l <= lo && hi <= r) {
      return [this.minValues[node], this.maxValues[node]];
    }

    const mid = lo + Math.floor((hi - lo) / 2);

    const left = this._query(2 * node, lo, mid, l, r);
    const right = this._query(2 * node + 1, mid + 1, hi, l, r);

    return [Math.min(left[0], right[0]), Math.max(left[1], right[1])];
  }
}

class CustomMaxPriorityQueue {
  constructor(compare) {
    this.heap = [];
    this.compare = compare;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  offer(val) {
    this.heap.push(val);
    this._bubbleUp();
  }

  poll() {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this._sinkDown();
    }
    return top;
  }

  _bubbleUp() {
    let idx = this.heap.length - 1;
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[parentIdx]) >= 0) break;
      this._swap(idx, parentIdx);
      idx = parentIdx;
    }
  }

  _sinkDown() {
    let idx = 0;
    const length = this.heap.length;
    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let swapIdx = null;

      if (leftIdx < length) {
        if (this.compare(this.heap[leftIdx], this.heap[idx]) < 0) {
          swapIdx = leftIdx;
        }
      }

      if (rightIdx < length) {
        if (
          (swapIdx === null &&
            this.compare(this.heap[rightIdx], this.heap[idx]) < 0) ||
          (swapIdx !== null &&
            this.compare(this.heap[rightIdx], this.heap[leftIdx]) < 0)
        ) {
          swapIdx = rightIdx;
        }
      }

      if (swapIdx === null) break;
      this._swap(idx, swapIdx);
      idx = swapIdx;
    }
  }

  _swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
