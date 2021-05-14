import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";
import PostLoader from "../../lib/posts";
import { Post } from "../../lib/types";

export default function PostPage(props: Post) {
  return <div>{JSON.stringify(props)}</div>;
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Post>> {
  await PostLoader.load();
  return {
    props: await PostLoader.post(context.params.slug as string)
  };
}

export async function getStaticPaths() {
  await PostLoader.load();
  return {
    paths: PostLoader.postList().map(v => ({
      params: {slug: v}
    })),
    fallback: false
  };
}