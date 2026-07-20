import fs from "fs";
import path from "path";
import { isVercel, readJsonBlob, writeJsonBlob } from "./store";

export interface Post {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
}

const dataPath = path.join(process.cwd(), "data", "posts.json");
const BLOB_PATH = "data/posts.json";

function readLocalFile(): Post[] {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function getPosts(): Promise<Post[]> {
  if (isVercel) {
    const blobData = await readJsonBlob<Post[]>(BLOB_PATH);
    return blobData ?? readLocalFile();
  }
  return readLocalFile();
}

export async function savePosts(posts: Post[]): Promise<void> {
  if (isVercel) {
    await writeJsonBlob(BLOB_PATH, posts);
    return;
  }
  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), "utf-8");
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}
