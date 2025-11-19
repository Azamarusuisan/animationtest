import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tipsディレクトリのパス
const tipsDir = path.join(__dirname, '../src/content/tips');

// 各カテゴリーに応じた具体的な指示を生成
function generateClaudeInstructions(tip) {
  const instructions = {
    animation: [
      '1. CSSまたはJavaScriptでアニメーションを実装',
      '2. パフォーマンスを考慮してtransform/opacityを使用',
      '3. prefers-reduced-motionに対応',
      '4. レスポンシブデザインに対応',
      '5. サンプルコードとデモを提供',
    ],
    ui: [
      '1. アクセシビリティ（ARIA属性、キーボード操作）を考慮',
      '2. レスポンシブデザインで実装',
      '3. ダークモード対応',
      '4. クロスブラウザ互換性を確保',
      '5. コンポーネントの使用例を提供',
    ],
    performance: [
      '1. パフォーマンス指標（LCP、FID、CLS等）を改善',
      '2. 実装前後のベンチマーク結果を提示',
      '3. Chrome DevToolsでの検証方法を説明',
      '4. 最適化の理由と効果を明確に',
      '5. トレードオフがあれば説明',
    ],
    security: [
      '1. セキュリティのベストプラクティスに従う',
      '2. 潜在的な脆弱性を排除',
      '3. OWASP Top 10を考慮',
      '4. 実装例とNG例を両方提示',
      '5. テスト方法を説明',
    ],
    react: [
      '1. React 18+の最新機能を活用',
      '2. TypeScriptで型安全に実装',
      '3. Hooksを適切に使用',
      '4. パフォーマンス最適化（memo、useMemo等）',
      '5. テストコードも提供',
    ],
    styling: [
      '1. モダンCSSの機能を活用',
      '2. クロスブラウザ対応を確認',
      '3. CSS変数で柔軟に実装',
      '4. レスポンシブデザインに対応',
      '5. フォールバック戦略を提供',
    ],
    forms: [
      '1. バリデーションを実装',
      '2. ユーザーフレンドリーなエラー表示',
      '3. アクセシビリティを考慮',
      '4. 送信中の状態管理',
      '5. キーボード操作に対応',
    ],
    advanced: [
      '1. 最新のWeb標準に準拠',
      '2. ブラウザサポート状況を明記',
      '3. ポリフィルや代替案を提供',
      '4. 実装の複雑さを説明',
      '5. 実用的な使用例を提示',
    ],
    default: [
      '1. 明確で理解しやすいコードを書く',
      '2. コメントで重要な箇所を説明',
      '3. エッジケースを考慮',
      '4. ベストプラクティスに従う',
      '5. 実装例とドキュメントを提供',
    ],
  };

  return instructions[tip.category] || instructions['default'];
}

// MDXファイルを更新
function updateMdxFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // frontmatterを解析
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`⏭️  スキップ: ${path.basename(filePath)} (frontmatterなし)`);
      return false;
    }

    const frontmatter = frontmatterMatch[1];
    const bodyContent = content.substring(frontmatterMatch[0].length);

    // frontmatterからカテゴリーを取得
    const categoryMatch = frontmatter.match(/category:\s*(\w+)/);
    const category = categoryMatch ? categoryMatch[1] : 'default';

    // タイトルを取得
    const titleMatch = frontmatter.match(/title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1] : '';

    // 説明を取得
    const descriptionMatch = frontmatter.match(/description:\s*(.+)/);
    const description = descriptionMatch ? descriptionMatch[1] : '';

    // 既に「Claude Codeへの指示」セクションがあるかチェック
    if (bodyContent.includes('## Claude Codeへの指示')) {
      console.log(`⏭️  スキップ: ${path.basename(filePath)} (既に指示あり)`);
      return false;
    }

    // 指示を生成
    const instructions = generateClaudeInstructions({ category });
    const instructionsList = instructions.map(inst => `- ${inst}`).join('\n');

    // 新しいセクションを追加
    const newSection = `

## Claude Codeへの指示

このTipsをClaude Codeに実装してもらう場合、以下の点を指示してください：

${instructionsList}

### プロンプト例

\`\`\`
${title}を実装してください。

要件：
${description}

以下の点を守ってください：
${instructions.map((inst, i) => `${i + 1}. ${inst.replace(/^\d+\.\s*/, '')}`).join('\n')}
\`\`\`
`;

    // 「## Claude Codeへのプロンプト」セクションの前に挿入
    let newContent;
    if (bodyContent.includes('## Claude Codeへのプロンプト')) {
      newContent = content.replace(
        /## Claude Codeへのプロンプト/,
        newSection + '\n## Claude Codeへのプロンプト'
      );
    } else {
      // プロンプトセクションがない場合は末尾に追加
      newContent = content.trimEnd() + newSection + '\n';
    }

    // ファイルを更新
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ 更新: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ エラー: ${path.basename(filePath)} - ${error.message}`);
    return false;
  }
}

// メイン処理
function main() {
  console.log('Claude Codeへの指示リストを追加中...\n');

  const files = fs.readdirSync(tipsDir)
    .filter(file => file.endsWith('.mdx'))
    .sort();

  let updated = 0;
  let skipped = 0;

  files.forEach(file => {
    const filePath = path.join(tipsDir, file);
    const result = updateMdxFile(filePath);
    if (result) {
      updated++;
    } else {
      skipped++;
    }
  });

  console.log(`\n🎉 完了: ${updated}個のファイルを更新`);
  console.log(`⏭️  スキップ: ${skipped}個のファイル`);
  console.log(`📁 合計: ${files.length}個のTIPSファイル`);
}

main();
