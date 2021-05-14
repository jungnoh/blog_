import { GetStaticPropsResult } from "next";
import React from "react";
import PostLoader from "../../lib/posts";

interface CategoryListPageProps {
  names: string[];
}

export default function CategoryList(props: CategoryListPageProps) {
  return (
    <div>
      <ul>
        {props.names.map(v => (<li key={v}><a href={`/category/${v}/1`}>{v}</a></li>))}
      </ul>
    </div>
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
