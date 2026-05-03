import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DeanMessage({ lang, cardStyle }) {
  const [dean, setDean] = useState(null);

  useEffect(() => {
  async function fetchDean() {
    const { data, error } = await supabase
      .from("dean_message")
      .select("*")
      .eq("id", 1)
      .limit(1);

    console.log("Dean from Supabase:", data, error); // 👈 الآن صحيح

    if (data && data.length > 0) {
      setDean(data[0]);
    }
  }

  fetchDean();
}, []);

  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }}>
      <h2 style={{ marginTop: 0 }}>
        {lang === "ar" ? "كلمة العميد" : "Dean Message"}
      </h2>

      <img
        src={dean?.image_url || "/dean.jpg"}
        alt="Dean"
        style={{
          width: "60%",
          maxWidth: "200px",
          margin: "0 auto",
          display: "block",
          height: "auto",
          objectFit: "cover",
          borderRadius: "16px",
        }}
      />

      <div
        style={{
          lineHeight: 1.8,
          fontSize: "15px",
          color: "#334155",
          fontWeight: "bold",
          textAlign: "center",
          maxWidth: "800px",
          margin: "24px auto 0",
          whiteSpace: "pre-line",
        }}
      >
        {lang === "ar" ? dean?.message_ar : dean?.message_en}

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#0f172a",
          }}
        >
          {dean?.name}
        </div>
      </div>
    </section>
  );
}