import { GetStaticPropsContext } from "next";
import React from "react";
import PostLoader, { SerializablePost, toSerializable } from "../../lib/posts";

type PostProps = SerializablePost;

export default function PostPage(props: PostProps) {
  return <div>{JSON.stringify(props)}</div>;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  await PostLoader.load();
  return {
    props: toSerializable(await PostLoader.post(context.params.slug as string))[0] 
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