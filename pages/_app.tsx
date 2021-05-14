import React from "react";
import type { AppProps } from "next/app";
import Link from "next/link";
import styled from "@emotion/styled";

const Root = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const Header = styled.header`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > a {
    margin-left: 0.5em;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Root>
      <Header>
        <Link href="/archive">archive</Link>
        <Link href="/category">category</Link>
        <Link href="/tag">tag</Link>
        <Link href="/about">about</Link>
      </Header>
      <Component {...pageProps} />
    </Root>
  );
}

export default MyApp;
