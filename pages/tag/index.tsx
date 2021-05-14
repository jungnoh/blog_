import { GetStaticPropsResult } from "next";
import React from "react";
import PostLoader from "../../lib/posts";

interface TagListPageProps {
  names: string[];
}

export default function TagList(props: TagListPageProps) {
  return (
    <div>
      <ul>
        {props.names.map(v => (<li key={v}><a href={`/tag/${v}/1`}>{v}</a></li>))}
      </ul>
    </div>
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
