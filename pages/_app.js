import "../styles/globals.css";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <style global jsx>{`
        html,
        body,
        div#__next {
          height: 100%;
          min-height: 100%;
        }
      `}</style>

      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
