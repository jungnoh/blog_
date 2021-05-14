import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";
import PostList from "@/components/PostList";
import PostLoader from "@/lib/posts";
import { Pagination } from "@/lib/types";

interface TagPageProps extends Pagination {
  title: string;
}

export default function TagPage(props: TagPageProps) {
  return <PostList {...props} />;
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<TagPageProps>> {
  await PostLoader.load();
  return {
    props: {
      ...PostLoader.tagPage(
        context.params.name as string,
        parseInt(context.params.page as string)
      ),
      title: context.params.name as string,
    },
  };
}

export async function getStaticPaths() {
  await PostLoader.load();

  const pathList = PostLoader.tagList()
    .map((v) => {
      const result = [];
      for (let i = 1; i <= v.pages; i++) {
        result.push({ params: { name: v.name, page: i.toString() } });
      }
      return result;
    })
    .flat();

  return {
    paths: pathList,
    fallback: false,
  };
}
