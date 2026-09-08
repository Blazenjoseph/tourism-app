import "../public/styles/globals.css";
import TravelCompanion from "../components/TravelCompanion";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <TravelCompanion />
    </>
  );
}
