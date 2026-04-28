import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/gods-gift-logo.png" />
        <link rel="shortcut icon" href="/gods-gift-logo.png" />
        <link rel="apple-touch-icon" href="/gods-gift-logo.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
