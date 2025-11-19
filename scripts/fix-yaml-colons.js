import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tipsDir = path.join(__dirname, '../src/content/tips');

function fixYamlColons(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // frontmatterを抽出
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return false;

  let frontmatter = frontmatterMatch[1];
  let changed = false;

  // titleとdescriptionを全てクォートで囲む（@で始まる、コロンを含む、など特殊文字対応）
  frontmatter = frontmatter.replace(/^(title|description): (.+)/gm, (match, key, value) => {
    // 既にクォートされている場合はスキップ
    if (value.trim().startsWith('"') && value.trim().endsWith('"')) {
      return match;
    }
    changed = true;
    return `${key}: "${value.trim()}"`;
  });

  if (changed) {
    content = content.replace(/^---\n[\s\S]*?\n---/, `---\n${frontmatter}\n---`);
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

const files = fs.readdirSync(tipsDir).filter(f => f.endsWith('.mdx'));
let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(tipsDir, file);
  if (fixYamlColons(filePath)) {
    fixedCount++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files with YAML colon issues`);
