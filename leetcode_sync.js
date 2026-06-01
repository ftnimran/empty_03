const fs = require("fs");
const path = require("path");
const axios = require("axios");
const readline = require("readline");
const { execSync } = require("child_process");
const TurndownService = require("turndown");

// ===== INPUT =====
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((resolve) => rl.question(q, (ans) => resolve(ans)));
}

// ===== TURNDOWN =====
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// ===== PRESERVE CODE BLOCKS =====
turndownService.addRule("codeBlock", {
  filter: ["pre"],
  replacement: (content) => `\n\`\`\`\n${content}\n\`\`\`\n`,
});

// ===== FIX POWER FORMAT =====
function fixMathPower(text) {
  return text
    .replace(/([a-zA-Z0-9]+)\^([0-9]+)/g, "$1<sup>$2</sup>")
    .replace(/([a-zA-Z0-9]+)\^\{([0-9]+)\}/g, "$1<sup>$2</sup>")

    .replace(/10⁰/g, "10<sup>0</sup>")
    .replace(/10¹/g, "10<sup>1</sup>")
    .replace(/10²/g, "10<sup>2</sup>")
    .replace(/10³/g, "10<sup>3</sup>")
    .replace(/10⁴/g, "10<sup>4</sup>")
    .replace(/10⁵/g, "10<sup>5</sup>")
    .replace(/10⁶/g, "10<sup>6</sup>")
    .replace(/10⁷/g, "10<sup>7</sup>")
    .replace(/10⁸/g, "10<sup>8</sup>")
    .replace(/10⁹/g, "10<sup>9</sup>")

    .replace(/([a-zA-Z0-9])²/g, "$1<sup>2</sup>")
    .replace(/([a-zA-Z0-9])³/g, "$1<sup>3</sup>")
    .replace(/([a-zA-Z0-9])¹/g, "$1<sup>1</sup>")
    .replace(/([a-zA-Z0-9])⁴/g, "$1<sup>4</sup>")
    .replace(/([a-zA-Z0-9])⁵/g, "$1<sup>5</sup>")
    .replace(/([a-zA-Z0-9])⁶/g, "$1<sup>6</sup>")
    .replace(/([a-zA-Z0-9])⁷/g, "$1<sup>7</sup>")
    .replace(/([a-zA-Z0-9])⁸/g, "$1<sup>8</sup>")
    .replace(/([a-zA-Z0-9])⁹/g, "$1<sup>9</sup>")
    .replace(/([a-zA-Z0-9])⁰/g, "$1<sup>0</sup>");
}

// ===== CLEAN ESCAPES =====
function cleanEscapes(text) {
  return text
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\`/g, "`");
}

// ===== AUTO DETECT REPO =====
function getRepoURL() {
  try {
    let url = execSync("git config --get remote.origin.url")
      .toString()
      .trim();

    if (!url) throw new Error();

    // git@github.com:user/repo.git
    if (url.startsWith("git@")) {
      url = url.replace("git@github.com:", "https://github.com/");
    }

    return url.replace(".git", "");
  } catch {
    console.log("⚠️ Git repo detect nahi hua");
    return "https://github.com/ftnimran/leetcode-solutions";
  }
}

// ===== AUTO DETECT BRANCH =====
function getBranch() {
  try {
    return (
      execSync("git branch --show-current")
        .toString()
        .trim() || "main"
    );
  } catch {
    return "main";
  }
}

// ===== LANGUAGE MAP =====
const langMap = {
  cpp: "solution.cpp",
  c: "solution.c",
  java: "Solution.java",
  python: "solution.py",
  js: "solution.js",
  csharp: "Solution.cs",
};

const displayLangMap = {
  cpp: "C++",
  js: "JavaScript",
};

// ===== CATEGORY =====
function getCategory(tags, title) {
  const tagsLower = tags.map((t) => t.toLowerCase());
  const titleLower = title.toLowerCase();

  const mapping = [
    ["dynamic programming", "DP"],
    ["segment tree", "Segment Tree"],
    ["fenwick tree", "Binary Indexed Tree"],
    ["graph", "Graph"],
    ["topological sort", "Graph"],
    ["trie", "Trie"],
    ["union find", "Union Find"],
    ["backtracking", "Backtracking"],
    ["recursion", "Backtracking"],
    ["tree", "Tree"],
    ["binary search tree", "Tree"],
    ["linked list", "Linked List"],
    ["monotonic stack", "Monotonic Stack"],
    ["sliding window", "Sliding Window"],
    ["two pointers", "Two Pointer"],
    ["prefix sum", "Prefix Sum"],
    ["binary search", "Binary Search"],
    ["heap", "Heap"],
    ["greedy", "Greedy"],
    ["stack", "Stack"],
    ["queue", "Queue"],
    ["hash table", "Hashing"],
    ["bit manipulation", "Bit Manipulation"],
    ["matrix", "Matrix"],
    ["geometry", "Geometry"],
    ["game theory", "Game Theory"],
    ["database", "SQL"],
    ["shell", "Shell"],
    ["design", "Design"],
    ["array", "Array"],
    ["string", "String"],
    ["math", "Math"],
    ["simulation", "Simulation"],
    ["sorting", "Sorting"],
  ];

  for (let [key, val] of mapping) {
    if (tagsLower.includes(key)) return val;
  }

  if (titleLower.includes("counter") || titleLower.includes("closure"))
    return "Closure";

  if (titleLower.includes("promise")) return "Promise";

  if (titleLower.includes("function")) return "Basics";

  return "General";
}

// ===== SAFE NAME =====
function safeName(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// ===== TITLE FORMAT =====
function formatTitle(title, maxLength = 37) {
  title = title.replace(/\|/g, "");

  return title.length <= maxLength
    ? title
    : title.slice(0, maxLength - 3) + "...";
}

// ===== DATE =====
function getDate() {
  const d = new Date();

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `${dd}-${mm}-${yy}`;
}

// ===== MAIN =====
(async () => {
  const urlInput = (await ask("Paste LeetCode URL: ")).trim();

  const language = (await ask("Language: "))
    .trim()
    .toLowerCase();

  if (!langMap[language]) {
    console.log("❌ Invalid language!");
    process.exit();
  }

  const displayLanguage =
    displayLangMap[language] || language.toUpperCase();

  const match = urlInput.match(/problems\/([^/]+)/);

  if (!match) {
    console.log("❌ Invalid URL!");
    process.exit();
  }

  const slug = match[1];

  // ===== FETCH =====
  const res = await axios.post(
    "https://leetcode.com/graphql",
    {
      query: `
      query getQuestion($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionFrontendId
          title
          difficulty
          content
          topicTags { name }
        }
      }
    `,
      variables: { titleSlug: slug },
    }
  );

  const q = res.data.data.question;

  if (!q) {
    console.log("❌ Problem not found!");
    process.exit();
  }

  const title = q.title;
  const number = q.questionFrontendId;
  const difficulty = q.difficulty.toLowerCase();

  const tags = q.topicTags.map((t) => t.name);

  // ===== LEETCODE LINK =====
  const leetcodeLink = `https://leetcode.com/problems/${slug}/`;

  const category = getCategory(tags, title);

  // ===== PATH =====
  const folder = path.join(
    difficulty,
    safeName(category),
    slug
  );

  fs.mkdirSync(folder, {
    recursive: true,
  });

  const solutionPath = path.join(
    folder,
    langMap[language]
  );

  // ===== CREATE SOLUTION FILE =====
  if (!fs.existsSync(solutionPath)) {
    fs.writeFileSync(
      solutionPath,
      `// ${title}
// ${leetcodeLink}
// Difficulty: ${difficulty}

`
    );
  }

  console.log("✅ Folder ready:", folder);

  // ===== DESCRIPTION =====
  let desc = turndownService.turndown(q.content);

  desc = fixMathPower(desc);
  desc = cleanEscapes(desc);

  desc = desc.replace(/\n{3,}/g, "\n\n");

  // ===== README (PROBLEM) =====
  const problemReadme = path.join(
    folder,
    "README.md"
  );

  if (!fs.existsSync(problemReadme)) {
    fs.writeFileSync(
      problemReadme,
      `# ${number}. ${title}

🔗 [Problem Link](${leetcodeLink})
📊 Difficulty: ${difficulty}
📂 Category: ${category}

## 📝 Description

${desc}
`
    );
  }

  console.log("📄 Problem README created");

  // ===== OPEN VS CODE =====
  try {
    execSync(`code -r "${solutionPath}"`);
  } catch {}

  await ask("Paste your code and press ENTER...");

  // ===== MAIN README =====
  const mainReadme = "README.md";

  if (!fs.existsSync(mainReadme)) {
    fs.writeFileSync(
      mainReadme,
      `# 🚀 LeetCode Solutions

| # | Problem | Difficulty | Language | Category | Link | Date |
|---|----------|------------|----------|----------|------|------|
`
    );
  }

  let lines = fs
    .readFileSync(mainReadme, "utf-8")
    .split("\n");

  if (
    lines.some((line) =>
      line.includes(`/${slug}/`)
    )
  ) {
    console.log("⚠️ Already exists in README.");
  } else {
    const count = lines.filter(
      (l) =>
        l.startsWith("|") &&
        !l.includes("Problem") &&
        !l.includes("---")
    ).length;

    // ===== YOUR GITHUB SOLUTION LINK =====
    const repo = getRepoURL();
    const branch = getBranch();

    const solutionLink = `${repo}/tree/${branch}/${folder.replace(
      /\\/g,
      "/"
    )}`;

    const row = `| ${count + 1} | ${formatTitle(
      title
    )} | ${difficulty} | ${displayLanguage} | ${category} | [Link](${solutionLink}) | ${getDate()} |`;

    fs.appendFileSync(mainReadme, row + "\n");

    console.log("📊 README updated!");
  }

  // ===== GIT =====
  try {
    execSync("git add .");

    execSync("git diff --cached --quiet");

    console.log("⚠️ No changes to commit.");
  } catch {
    try {
      execSync(
        `git commit -m "Added ${title} | ${difficulty} | ${displayLanguage}"`
      );

      execSync("git push");

      console.log("🚀 Successfully pushed!");
    } catch {
      console.log("❌ Push failed.");
    }
  }

  rl.close();
})();