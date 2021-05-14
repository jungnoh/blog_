import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";
import React from "react";

interface PostListItemProps {
  title: string;
  slug: string;
  date: string;
}

export default function PostListItem(props: PostListItemProps) {
  const router = useRouter();
  return (
    <Item>
      <Title onClick={() => router.push(`/post/${props.slug}`)}>{props.title}</Title>
    </Item>
  );
}

const Item = styled.div`

`;

const Title = styled.span`
  cursor: pointer;
`;
