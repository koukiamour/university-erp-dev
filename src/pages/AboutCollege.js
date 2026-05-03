import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AboutCollege({ lang }) {
  const [about, setAbout] = useState({
    intro_ar: "",
    intro_en: "",
    vision_ar: "",
    vision_en: "",
    mission_ar: "",
    mission_en: "",
    goals_intro_ar: "",
    goals_intro_en: "",
    goal1_ar: "",
    goal1_en: "",
    goal2_ar: "",
    goal2_en: "",
    goal3_ar: "",
    goal3_en: "",
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    const { data, error } = await supabase
      .from("about_college")
      .select("*")
      .eq("id", 1)
      .limit(1);

    console.log("About from Supabase:", data, error);

    if (error) return;

    if (data && data.length > 0) {
      setAbout(data[0]);
    }
  }

  const items = [
    {
      title_ar: "الرؤية",
      title_en: "Vision",
      text_ar: about.vision_ar,
      text_en: about.vision_en,
    },
    {
      title_ar: "الرسالة",
      title_en: "Mission",
      text_ar: about.mission_ar,
      text_en: about.mission_en,
    },
    {
      title_ar: "الأهداف",
      title_en: "Goals",
      text_ar: about.goals_intro_ar,
      text_en: about.goals_intro_en,
    },
  ];

  const goals = [
    { ar: about.goal1_ar, en: about.goal1_en },
    { ar: about.goal2_ar, en: about.goal2_en },
    { ar: about.goal3_ar, en: about.goal3_en },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#0f766e" }}>
        {lang === "ar" ? "عن الكلية" : "About the College"}
      </h2>

      <div
        style={{
          background: "#f8fafc",
          padding: "18px",
          borderRadius: "16px",
          lineHeight: 1.9,
          fontSize: "17px",
          fontWeight: "500",
          textAlign: "center",
          marginBottom: "18px",
          whiteSpace: "pre-line",
        }}
      >
        {lang === "ar" ? about.intro_ar : about.intro_en}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "16px",
              background: "white",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#0f766e", marginTop: 0 }}>
              {lang === "ar" ? item.title_ar : item.title_en}
            </h3>

            <p style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {lang === "ar" ? item.text_ar : item.text_en}
            </p>
          </div>
        ))}
      </div>

      <h3 style={{ textAlign: "center", marginTop: "22px", color: "#0f172a" }}>
        {lang === "ar" ? "الأهداف العامة" : "General Goals"}
      </h3>

      <div style={{ marginTop: "12px" }}>
        {goals.map((goal, i) => (
          <div
            key={i}
            style={{
              background: i % 2 === 0 ? "#ecfdf5" : "#f8fafc",
              borderRight: lang === "ar" ? "5px solid #0f766e" : "none",
              borderLeft: lang === "en" ? "5px solid #0f766e" : "none",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "10px",
              fontWeight: "500",
              whiteSpace: "pre-line",
            }}
          >
            <strong>
              {lang === "ar" ? `الهدف ${i + 1}: ` : `Goal ${i + 1}: `}
            </strong>
            {lang === "ar" ? goal.ar : goal.en}
          </div>
        ))}
      </div>
    </div>
  );
}