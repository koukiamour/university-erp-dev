import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StructurePage({ lang = "ar" }) {
  const [imageUrl, setImageUrl] = useState("/structure.png");

  useEffect(() => {
    fetchStructure();
  }, []);

  async function fetchStructure() {
    const { data, error } = await supabase
      .from("organizational_structure")
      .select("image_url_ar,image_url_en")
      .eq("id", 1)
      .limit(1);

    if (error) {
      console.log("Structure fetch error:", error);
      return;
    }

    if (data && data.length > 0) {
  const row = data[0];

  const selected =
    lang === "ar"
      ? row.image_url_ar
      : row.image_url_en;

  setImageUrl(selected || "/structure.png");
}
  }

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={imageUrl || "/structure.png"}
        alt="structure"
        style={{
          width: "100%",
          maxWidth: "1200px",//هنا عدلت جودة الصورة عشان تكون مناسبة للشاشات الكبيرة

          height: "auto",
          objectFit: "contain",
          imageRendering: "auto",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}