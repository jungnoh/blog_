import { GetStaticPropsResult } from "next";
import React from "react";
import TagList from "../../components/TagList";
import PostLoader from "../../lib/posts";

interface CategoryListPageProps {
  names: string[];
}

export default function CategoryListPage(props: CategoryListPageProps) {
  return (
    <TagList names={props.names} title="categories" />
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<CategoryListPageProps>> {
  await PostLoader.load();
  return {
    props: {
      names: PostLoader.categoryList().map(v => v.name)
    }
  };
}
