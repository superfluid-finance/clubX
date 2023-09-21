import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />

          <meta httpEquiv="x-ua-compatible" content="ie=edge" />

          <link rel="manifest" href="/manifest.json" />

          <title>CLUBx</title>
          <meta name="description" content="The most exclusive club in web3." />

          <link rel="icon" href="/icon.svg" />

          <meta name="application-name" content="CLUBx" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="CLUBx" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="apple-touch-icon" href="/Logo.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/Logo.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/Logo.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/Logo.png" />

          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color="#000000"
          />
          <link rel="shortcut icon" href="/icon.svg" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://clubx.superfluid.finance" />
          <meta name="twitter:title" content="CLUBx" />
          <meta
            name="twitter:description"
            content="The most exclusive club in web3."
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="CLUBx" />
          <meta
            property="og:description"
            content="The most exclusive club in web3."
          />
          <meta property="og:site_name" content="CLUBx" />
          <meta property="og:url" content="https://clubx.superfluid.finance" />

          <link
            rel="apple-touch-startup-image"
            href="/Logo.png"
            sizes="512x512"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
