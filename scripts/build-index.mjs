import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '..', 'src', 'content');
const outputFile = path.join(__dirname, '..', 'public', 'index.json');

const collections = ['modules', 'tips', 'sites'];
const allItems = [];

collections.forEach(collection => {
  const collectionPath = path.join(contentDir, collection);

  if (!fs.existsSync(collectionPath)) {
    console.log(`スキップ: ${collection} (ディレクトリが存在しません)`);
    return;
  }

  const files = fs.readdirSync(collectionPath).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(collectionPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    const slug = file.replace(/\.(mdx|md)$/, '');
    const url = `/${collection}/${slug}`;

    allItems.push({
      title: data.title || 'Untitled',
      description: data.description || '',
      tags: data.tags || [],
      url: url,
      collection: collection,
    });
  });
});

fs.writeFileSync(outputFile, JSON.stringify(allItems, null, 2), 'utf-8');
console.log(`✅ 検索インデックスを生成しました: ${outputFile}`);
console.log(`   合計 ${allItems.length} アイテムをインデックス化しました。`);
