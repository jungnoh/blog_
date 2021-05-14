import frontMatter from "front-matter";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { InternalPost, Pagination, Post } from "./types";

interface TagListItem {
  name: string;
  pages: number;
}

const PAGE_SIZE = 10;
const POST_EXTS = ["md", "mdx"];

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
    this.loaded = true;
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
        date: fmContent.attributes.date as unknown as string,
        tags: (fmContent.attributes.tags as unknown as string ?? "").split(",").map(v => v.trim()).filter(v => v !== ""),
        category: fmContent.attributes.category ?? "Uncategorized",
        content: fmContent.body,
        path: filePath,
      };

      if (this.posts.has(newPost.slug)) {
        console.log(`Skipping ${filename}: Duplicate slug with ${this.posts.get(newPost.slug).title}`);
      }
      this.posts.set(newPost.slug, newPost);
      fileSortList.push({slug: newPost.slug, date: DateTime.fromFormat(newPost.date, "yyyy-MM-dd hh:mm", {zone: "Asia/Seoul"})});
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

  private postPage(slugList: string[], page: number): Post[] {
    return slugList.slice((page - 1)*PAGE_SIZE, page*PAGE_SIZE).map(v => this.posts.get(v));
  }

  private pageCount(totalCount: number): number {
    return Math.floor(Math.max(0, (totalCount - 1) / PAGE_SIZE) + 1);
  }

  archivePosts(page = 1): Pagination {
    const pages = this.pageCount(this.postCount);
    return {
      currentPage: page,
      pageCount: pages,
      hasNext: page < pages,
      hasPrev: page > 1,
      posts: this.postPage(this.postViewOrder, page)
    };
  }
  archivePageCount() {
    return this.pageCount(this.postCount);
  }

  categoryList(): TagListItem[] {
    const result = [];
    this.categoryMap.forEach((value, key) => {
      result.push({
        name: key,
        pages: this.pageCount(value.length)
      });
    });
    return result;
  }
  categoryPage(name: string, page = 1): Pagination | undefined {
    if (!this.categoryMap.has(name)) {
      return undefined;
    }
    const categoryItems = this.categoryMap.get(name);
    const pages = this.pageCount(categoryItems.length);
    return {
      currentPage: page,
      pageCount: pages,
      hasNext: page < pages,
      hasPrev: page > 1,
      posts: this.postPage(categoryItems, page)
    };
  }

  tagList(): TagListItem[] {
    const result = [];
    this.tagMap.forEach((value, key) => {
      result.push({
        name: key,
        pages: this.pageCount(value.length)
      });
    });
    return result;
  }
  tagPage(name: string, page = 1): Pagination {
    if (!this.tagMap.has(name)) {
      return undefined;
    }
    const tagItems = this.tagMap.get(name);
    const pages = this.pageCount(tagItems.length);
    return {
      currentPage: page,
      pageCount: pages,
      hasNext: page < pages,
      hasPrev: page > 1,
      posts: this.postPage(tagItems, page)
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
