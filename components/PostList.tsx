import styled from "@emotion/styled";
import React from "react";
import { Pagination } from "../lib/types";
import Paginator from "./Paginator";
import PostListItem from "./PostListItem";

interface PostListProps extends Pagination {
  title: string;
}

export default function PostList(props: PostListProps) {
  return (
    <Root>
      <Header>{props.title}</Header>
      <List>
        {props.posts.map(v => <PostListItem key={v.slug} {...v} />)}
      </List>
      <Paginator
        hasNext={props.hasNext}
        hasPrev={props.hasPrev}
        page={props.currentPage}
        count={props.pageCount}
      />
    </Root>
  );
}

const Root = styled.div`

`;

const Header = styled.div`

`;

const List = styled.div`

`;
