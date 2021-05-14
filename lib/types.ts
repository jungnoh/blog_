
export interface Pagination {
  pageCount: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  posts: Post[];
}

export interface Post {
  title: string;
  slug: string;
  tags: string[];
  category: string;
  content: string;
  date: string;
}

export interface InternalPost extends Post {
  path: string;
}