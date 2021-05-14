import { GetStaticPropsResult } from "next";
import React from "react";
import TagList from "../../components/TagList";
import PostLoader from "../../lib/posts";

interface TagListPageProps {
  names: string[];
}

export default function TagListPage(props: TagListPageProps) {
  return (
    <TagList names={props.names} title="tags" />
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<TagListPageProps>> {
  await PostLoader.load();
  return {
    props: {
      names: PostLoader.tagList().map(v => v.name)
    }
  };
}
