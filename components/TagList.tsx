import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";
import React from "react";

interface PageListProps {
  title: string;
  names: string[];
}

export default function TagList(props: PageListProps) {
  const router = useRouter();
  const onClick = (name: string) => {
    router.push(`${router.pathname}/${name}/1`);
  };
  return (
    <Root>
      <Header>{props.title}</Header>
      <List>
        {props.names.map(v => <Item key={v} onClick={() => onClick(v)}>{v}</Item>)}
      </List>
    </Root>
  );
}

const Root = styled.div`

`;

const Header = styled.div`

`;

const List = styled.ul`

`;

const Item = styled.li`
  cursor: pointer;
`;
