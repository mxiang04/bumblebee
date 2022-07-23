import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>BumbleBee | Talking to your friends on the fly.</title>
      </Head>

      <Sidebar />
    </div>
  );
}
