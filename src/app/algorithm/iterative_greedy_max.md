## Iterative Method for Generating Combinations

We maintain an array `comb[0..m-1]` that holds the current combination in **lexicographic order**.  Each step does two things:

1. **Output** a copy of `comb`.
2. **Increment** `comb` to the next combination:

   * Find the rightmost position `i` such that `comb[i] < i + n - m`.
   * Increase `comb[i]` by 1.
   * For each position `j > i`, set `comb[j] = comb[j-1] + 1` to reset the tail to the smallest possible values.

This runs in $O(m)$ per combination and uses $O(m)$ extra space.

---

### Example: $n=5, m=3$

All combinations in lexicographic order:

```
[0,1,2]
[0,1,3]
[0,1,4]
[0,2,3]
[0,2,4]
[0,3,4]
[1,2,3]
[1,2,4]
[1,3,4]
[2,3,4]
```

We’ll illustrate three key transitions using diagrams where **Before** is above and **After** below.  Each row of nodes shows the combination, and the pivot index is highlighted.

---

#### 1. Initialization (`comb = [0,1,2]`)

```mermaid
digraph FullIterations {
  rankdir=LR;
  node [shape=record];

  C0 [label="{<0>0 | <1>1 | <2>2}"];
  C1 [label="{<0>0 | <1>1 | <2>3}"];
  C2 [label="{<0>0 | <1>1 | <2>4}"];
  C3 [label="{<0>0 | <1>2 | <2>3}"];
  C4 [label="{<0>0 | <1>2 | <2>4}"];
  C5 [label="{<0>0 | <1>3 | <2>4}"];
  C6 [label="{<0>1 | <1>2 | <2>3}"];
  C7 [label="{<0>1 | <1>2 | <2>4}"];
  C8 [label="{<0>1 | <1>3 | <2>4}"];
  C9 [label="{<0>2 | <1>3 | <2>4}"];

  C0 -> C1 [label="pivot i=2: comb[2]++"];
  C1 -> C2 [label="pivot i=2: comb[2]++"];
  C2 -> C3 [label="i=2 max → pivot i=1: comb[1]++, reset comb[2]"];
  C3 -> C4 [label="pivot i=2: comb[2]++"];
  C4 -> C5 [label="pivot i=2: comb[2]++"];
  C5 -> C6 [label="i=2 max → i=1 max → pivot i=0: comb[0]++, reset tail"];
  C6 -> C7 [label="pivot i=2: comb[2]++"];
  C7 -> C8 [label="pivot i=2: comb[2]++"];
  C8 -> C9 [label="i=2 max → pivot i=1: comb[1]++, reset comb[2]"];
}
```

### Full JavaScript Implementation

```js
function generateCombinations(n, m) {
  const result = [];
  const comb = Array.from({ length: m }, (_, i) => i);

  while (true) {
    result.push(comb.slice());
    let i = m - 1;
    while (i >= 0 && comb[i] === i + n - m) {
      i--;
    }
    if (i < 0) break;
    comb[i]++;
    for (let j = i + 1; j < m; j++) {
      comb[j] = comb[j - 1] + 1;
    }
  }
  return result;
}
```
