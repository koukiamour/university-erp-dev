import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StructurePage({ lang = "ar" }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchStructure();
  }, [lang]);

  async function fetchStructure() {
    const { data, error } = await supabase
      .from("organizational_structure")
      .select("image_url_ar,image_url_en")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.log("Structure fetch error:", error);
      setImageUrl(null);
      return;
    }

    // 🔥 هنا نختار فقط حسب اللغة
    if (lang === "ar") {
      setImageUrl(data?.image_url_ar || null);
    } else {
      setImageUrl(data?.image_url_en || null);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* 👇 لا يعرض أي شيء لين تجي الصورة */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="structure"
          style={{
            width: "100%",
            maxWidth: "1200px",
            height: "auto",
            objectFit: "contain",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        />
      )}
    </div>
  );
}