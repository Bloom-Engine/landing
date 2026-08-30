#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
let failures = 0;
const fail = (message) => {
  console.error(`FAIL  ${message}`);
  failures += 1;
};

const expectedModules = [
  "core", "shapes", "textures", "text", "audio", "models", "math",
  "physics", "scene", "mobile", "world", "vfx", "quality",
];
const numberWords = {
  en: ["nine", "thirteen"],
  de: ["neun", "dreizehn"],
  es: ["nueve", "trece"],
  fr: ["neuf", "treize"],
  id: ["sembilan", "tiga belas"],
  it: ["nove", "tredici"],
  ja: ["9 ", "13 "],
  ko: ["9", "13"],
  pt: ["nove", "treze"],
  th: ["เก้า", "สิบสาม"],
  tr: ["dokuz", "on üç"],
  vi: ["chín", "mười ba"],
  "zh-Hans": ["九", "十三"],
};

const messageDir = path.join(root, "src/messages");
const messageFiles = fs.readdirSync(messageDir).filter((name) => name.endsWith(".json"));
for (const file of messageFiles) {
  const locale = file.slice(0, -5);
  const messages = JSON.parse(read(`src/messages/${file}`));
  const ids = messages.home.modules.items.map((item) => item.id);
  if (JSON.stringify(ids) !== JSON.stringify(expectedModules)) {
    fail(`${file}: expected ${expectedModules.length} modules, got ${ids.join(", ")}`);
  }
  const [nine, thirteen] = numberWords[locale];
  if (!messages.home.heroDesc.toLocaleLowerCase(locale).includes(nine)) {
    fail(`${file}: hero does not state the nine-target platform count`);
  }
  if (!messages.home.modules.desc.toLocaleLowerCase(locale).includes(thirteen)) {
    fail(`${file}: module copy does not state the thirteen-module count`);
  }
  for (const platform of ["Android", "watchOS", "visionOS"]) {
    if (!messages.home.why.shipEverywhere.desc.includes(platform)) {
      fail(`${file}: ship-everywhere copy omits ${platform}`);
    }
  }
  if (!messages.meta.defaultDescription.includes("WebAssembly") ||
      !messages.home.why.desc.includes("WebAssembly")) {
    fail(`${file}: native-versus-Web copy does not explain the WebAssembly target`);
  }
}

const sourceFiles = [
  "src/pages/docs.astro",
  "src/components/HomePage.astro",
  "src/components/BlogPostWhereBloomStands.astro",
];
const source = sourceFiles.map((file) => `${file}\n${read(file)}`).join("\n");
for (const [label, pattern] of [
  ["removed Colors.RAYWHITE constant", /Colors\.<span class="prop">RAYWHITE/],
  ["legacy bloom package import", /<span class="str">"bloom(?:\/|"<)/],
  ["legacy module label", /module-import">bloom\//],
  ["numeric Camera3D projection", /projection:\s*<span class="num">[01](?:\.0)?<\/span>/],
]) {
  if (pattern.test(source)) fail(`site source contains ${label}`);
}

const docs = read("src/pages/docs.astro");
for (const id of expectedModules) {
  if (!docs.includes(`id="${id}"`)) fail(`docs page omits the ${id} module`);
  if (!docs.includes(`@bloomengine/engine/${id}`)) fail(`docs page omits the ${id} public import`);
}
for (const required of [
  'pathWithoutLocale="/docs"',
  "localizedPathAvailable={false}",
  "technical reference is maintained in English",
]) {
  if (!docs.includes(required)) fail(`docs language policy omits: ${required}`);
}

const home = read("src/components/HomePage.astro");
if (!home.includes('<span class="proof-number">9</span>')) fail("home platform count is not 9");
if (!home.includes('<span class="proof-number">13</span>')) fail("home module count is not 13");

const layout = read("src/layouts/Layout.astro");
if (!layout.includes("alternateLocales") || !layout.includes("languageMenuPath")) {
  fail("layout does not distinguish localized and English-only pages");
}
if (!read("src/pages/[lang]/docs.astro").includes('Astro.redirect("/docs", 308)')) {
  fail("localized docs routes do not redirect to the English reference");
}

const stableRoot = "node_modules/@bloomengine/engine";
const stableTypes = read(`${stableRoot}/src/core/types.ts`);
const stableColors = read(`${stableRoot}/src/core/colors.ts`);
const stableModels = read(`${stableRoot}/src/models/index.ts`);
if (!/projection:\s*"perspective"\s*\|\s*"orthographic"/.test(stableTypes)) {
  fail("stable npm package does not accept the documented Camera3D projection strings");
}
if (!/^\s*SNOW:\s+Color\.Snow,/m.test(stableColors)) {
  fail("stable npm package does not contain the documented Colors.SNOW constant");
}
if (!/export function drawModel\([^)]*model:\s*Model,[^)]*position:\s*Vec3,[^)]*scale:\s*number,[^)]*tint:\s*Color[^)]*\)/s.test(stableModels)) {
  fail("stable npm package drawModel signature differs from the website smoke test");
}
if (!/export function updateModelAnimation\([^)]*handle:\s*number,[^)]*animIndex:\s*number,[^)]*time:\s*number,[^)]*scale:\s*number,[^)]*px:\s*number,[^)]*py:\s*number,[^)]*pz:\s*number,[^)]*rotY:\s*number[^)]*\)/s.test(stableModels)) {
  fail("stable npm package updateModelAnimation signature differs from the website smoke test");
}

console.log(`${messageFiles.length} locales checked; ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
