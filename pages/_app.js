import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { ThemeProvider } from "next-themes";
import initAuth from "../initAuth";

initAuth();

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
