import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";
import React from "react";

interface PaginatorProps {
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  count: number;
}

export default function Paginator(props: PaginatorProps) {
  const router = useRouter();
  const prevEl = <span onClick={() => router.push((props.page-1).toString())}>&lt;</span>;
  const nextEl = <span onClick={() => router.push((props.page+1).toString())}>&gt;</span>;
  return (
    <Root>
      {props.hasPrev && prevEl}
      <span>{props.page}</span>
      {props.hasNext && nextEl}
    </Root>
  );
}

const Root = styled.div``;