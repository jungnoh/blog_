import frontMatter from "front-matter";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

const SINGLETON_KEY = Symbol("post_loader");

export interface Pagination {
  pageCount: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  posts: Post[];
}

interface BasePost {
  title: string;
  slug: string;
  tags: string[];
  category: string;
  content: string;
}

export interface Post extends BasePost {
  date: DateTime;
}

export interface SerializablePost extends BasePost {
  date: string;
}

interface InternalPost extends Post {
  path: string;
}

const PAGE_SIZE = 10;
const POST_EXTS = ["md", "mdx"];

export function toSerializable(...posts: Post[]): SerializablePost[] {
  return posts.map(v => ({
    ...v,
    date: v.date.toISO()
  }));
}

class PostLoader {
  private loaded = false;

  private postCount = 0;
  private posts: Map<string, InternalPost> = new Map();
  private tagMap: Map<string, string[]> = new Map();
  private categoryMap: Map<string, string[]> = new Map();
  private postViewOrder: string[] = [];

  async load() {
    if (this.loaded) {
      await Promise.resolve();
      return;
    }
    console.log("Reading post list");

    const fileSortList: {slug: string; date: DateTime}[] = [];

    const basePath = path.join(process.cwd(), "docs");
    const files = await fs.promises.readdir(basePath);
    for (const filename of files) {
      const filePath = path.join(basePath, filename);
      if (!POST_EXTS.includes(path.extname(filePath).toLowerCase().substring(1)))  {
        continue;
      }
      const stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) {
        continue;
      }
      console.log(filename);
      const file = await fs.promises.readFile(filePath, "utf-8");
      const fmContent = frontMatter<Partial<Post>>(file);
      if (!fmContent.attributes.title || !fmContent.attributes.slug || !fmContent.attributes.date) {
        console.log(`Skipping ${filename}: Missing required metadata attributes`);
        continue;
      }
      const newPost: InternalPost = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title: fmContent.attributes.title!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        slug: fmContent.attributes.slug!,
        date: DateTime.fromFormat(fmContent.attributes.date as unknown as string, "yyyy-MM-dd hh:mm", {zone: "Asia/Seoul"}),
        tags: (fmContent.attributes.tags as unknown as string ?? "").split(",").map(v => v.trim()),
        category: fmContent.attributes.category ?? "Uncategorized",
        content: fmContent.body,
        path: filePath,
      };

      if (this.posts.has(newPost.slug)) {
        console.log(`Skipping ${filename}: Duplicate slug with ${this.posts.get(newPost.slug).title}`);
      }
      this.posts.set(newPost.slug, newPost);
      fileSortList.push({slug: newPost.slug, date: newPost.date});
    }
    // Sort and populate tag and category maps
    this.postViewOrder = fileSortList.sort((a, b) => b.date > a.date ? -1 : b.date == a.date ? 0 : 1).map(v => v.slug);
    for (const slug of this.postViewOrder) {
      const post = this.posts.get(slug);
      if (!this.categoryMap.has(post.category)) {
        this.categoryMap.set(post.category, []);
      }
      this.categoryMap.set(post.category, [...this.categoryMap.get(post.category), slug]);
      for (const tag of post.tags) {
        if (!this.tagMap.has(tag)) {
          this.tagMap.set(tag, []);
        }
        this.tagMap.set(tag, [...this.tagMap.get(tag), slug]);
      }
    }
    this.postCount = fileSortList.length;
  }

  archivePosts(page = 1): Pagination {
    const pageCount = Math.floor(Math.max(0, this.postCount - 1) / PAGE_SIZE);
    return {
      currentPage: page,
      pageCount,
      hasNext: page < pageCount,
      hasPrev: page > 1,
      posts: this.postViewOrder.slice((page - 1)*PAGE_SIZE, page*PAGE_SIZE).map(v => this.posts.get(v))
    };
  }

  categoryList(): string[] {
    return [...this.categoryMap.keys()];
  }
  categoryPage(name: string, page = 1): Pagination {
    return {
      currentPage: 5,
      pageCount: 10,
      hasNext: true,
      hasPrev: true,
      posts: []
    };
  }

  tagList(): string[] {
    return [...this.tagMap.keys()];
  }
  tagPosts(name: string, page = 1): Pagination {
    return {
      currentPage: 5,
      pageCount: 10,
      hasNext: true,
      hasPrev: true,
      posts: []
    };
  }

  post(slug: string): Post {
    return this.posts.get(slug);
  }
  postList(): string[] {
    return [...this.postViewOrder];
  }
}

const loader = new PostLoader();
export default loader;
