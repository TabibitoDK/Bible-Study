import fs from "fs";
import path from "path";

const BASE_URL = "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master";
const OUT_DIR = path.resolve(import.meta.dir, "../public/bible");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log("Fetching GitHub repository tree...");
  const treeRes = await fetch("https://api.github.com/repos/aruljohn/Bible-kjv/git/trees/master?recursive=1");
  const treeData = await treeRes.json();
  const jsonFiles: string[] = treeData.tree
    ? treeData.tree.map((t: any) => t.path).filter((p: string) => p.endsWith(".json") && p !== "Books.json")
    : [];

  console.log("Found JSON files in repository:", jsonFiles.length);
  console.log("Sample files with numbers/spaces:", jsonFiles.filter(f => f.match(/^\d|Song/i)));

  // Map book names to their remote filename
  const booksRes = await fetch(`${BASE_URL}/Books.json`);
  const books: string[] = await booksRes.json();
  fs.writeFileSync(path.join(OUT_DIR, "Books.json"), JSON.stringify(books, null, 2));

  for (const book of books) {
    const filePath = path.join(OUT_DIR, `${book}.json`);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100) {
      continue;
    }
    // Find matching file in tree
    const normalizedBook = book.replace(/\s+/g, "").toLowerCase();
    const match = jsonFiles.find(
      (f) => f.replace(/\.json$/, "").replace(/[\s_]+/g, "").toLowerCase() === normalizedBook
    );

    if (match) {
      console.log(`Downloading ${book} from ${match}...`);
      const res = await fetch(`${BASE_URL}/${encodeURIComponent(match)}`);
      if (res.ok) {
        const data = await res.json();
        fs.writeFileSync(filePath, JSON.stringify(data));
        console.log(`✓ Saved ${book}`);
      } else {
        console.error(`Failed ${match}: ${res.status}`);
      }
    } else {
      console.warn(`No match found for book: ${book}`);
    }
  }

  // Verify all 66 books are present in OUT_DIR
  const filesNow = fs.readdirSync(OUT_DIR).filter(f => f.endsWith(".json") && f !== "Books.json");
  console.log(`Total books saved in ${OUT_DIR}: ${filesNow.length} / ${books.length}`);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
