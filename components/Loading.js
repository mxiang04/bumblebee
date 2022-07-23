import React from "react";
import { BeatLoader } from "react-spinners";

export default function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="/assets/logo.png"
          alt=""
          style={{ marginBottom: 10 }}
          height={200}
        />
        <BeatLoader color="#000000" size={15} />
      </div>
    </center>
  );
}
