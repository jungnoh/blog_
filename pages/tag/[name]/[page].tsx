import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";
import PostLoader from "../../../lib/posts";
import { Pagination } from "../../../lib/types";

export default function CategoryPage(props: Pagination) {
  return <div>{JSON.stringify(props, null, 2)}</div>;
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Pagination>> {
  await PostLoader.load();
  return {
    props: PostLoader.tagPage(context.params.name as string, parseInt(context.params.page as string))
  };
}

export async function getStaticPaths() {
  await PostLoader.load();

  const pathList = PostLoader.tagList().map(v => {
    const result = [];
    for (let i=1; i<=v.pages; i++) {
      result.push({params: {name: v.name, page: i.toString()}});
    }
    return result;
  }).flat();
  
  return {
    paths: pathList,
    fallback: false
  };
}