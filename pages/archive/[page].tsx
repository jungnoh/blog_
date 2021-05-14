import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";
import PostList from "../../components/PostList";
import PostLoader from "../../lib/posts";
import { Pagination } from "../../lib/types";

export default function CategoryPage(props: Pagination) {
  return (
    <PostList {...props} title="archive" />
  );
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Pagination>> {
  await PostLoader.load();
  const paginator = PostLoader.archivePosts(parseInt(context.params.page as string));
  return {
    props: paginator
  };
}

export async function getStaticPaths() {
  await PostLoader.load();

  const result = [];
  for (let i=1; i<=PostLoader.archivePageCount(); i++) {
    result.push({params: {page: i.toString()}});
  }

  return {
    paths: result,
    fallback: false
  };
}