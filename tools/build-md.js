// Builds AWL.md and PHRASAL_VERBS.md from data.js: node tools/build-md.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const window = {};
new Function("window", fs.readFileSync(path.join(root, "data.js"), "utf8"))(window);

let awl = "# Academic Word List\n\n570 семейств слов (Coxhead, 2000) в 10 подсписках: подсписок 1 — самые частые слова в академических текстах, подсписок 10 — самые редкие.\n";
let total = 0;
for (const n of Object.keys(window.AWL)) {
  const rows = window.AWL[n].trim().split("\n").map(l => l.split(" — "));
  total += rows.length;
  awl += `\n## Подсписок ${n} (${rows.length})\n\n| Слово | Перевод |\n|---|---|\n` + rows.map(([w, t]) => `| **${w}** | ${t} |`).join("\n") + "\n";
}
fs.writeFileSync(path.join(root, "AWL.md"), awl);

const pv = window.PV.trim().split("\n").map(l => l.split("|").map(s => s.trim()));
const table = list => "| Глагол | Перевод | Пример |\n|---|---|---|\n" + list.map(([v, t, e]) => `| **${v}** | ${t} | *${e}* |`).join("\n") + "\n";
const acad = pv.filter(p => p[3] === "A"), daily = pv.filter(p => p[3] !== "A");
fs.writeFileSync(path.join(root, "PHRASAL_VERBS.md"),
  `# Фразовые глаголы\n\n${pv.length} частотных фразовых глаголов.\n\n## Для академического письма (${acad.length})\n\n${table(acad)}\n## Разговорные (${daily.length})\n\n${table(daily)}`);

const words = Object.values(window.AWL).flatMap(s => s.trim().split("\n").map(l => l.split(" — ")[0]));
const dup = words.filter((w, i) => words.indexOf(w) !== i);
const pvDup = pv.map(p => p[0]).filter((w, i, a) => a.indexOf(w) !== i);
console.log(`AWL: ${total} words, duplicates: ${dup.join(", ") || "none"}; PV: ${pv.length} (academic ${acad.length}), duplicates: ${pvDup.join(", ") || "none"}`);
