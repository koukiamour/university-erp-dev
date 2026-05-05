export default function AboutCollege({ lang, about }) {
  if (!about) {
    return <p style={{ textAlign: "center" }}>جارٍ تحميل البيانات...</p>;
  }

  const items = [
    ["الرؤية", "Vision", about.vision_ar, about.vision_en],
    ["الرسالة", "Mission", about.mission_ar, about.mission_en],
    ["الأهداف", "Goals", about.goals_intro_ar, about.goals_intro_en],
  ];

  const goals = [
    [about.goal1_ar, about.goal1_en],
    [about.goal2_ar, about.goal2_en],
    [about.goal3_ar, about.goal3_en],
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#0f766e" }}>
        {lang === "ar" ? "عن الكلية" : "About the College"}
      </h2>

      <div style={{
        background: "#f8fafc",
        padding: "18px",
        borderRadius: "16px",
        lineHeight: 1.9,
        fontSize: "17px",
        fontWeight: "500",
        textAlign: "center",
        marginBottom: "18px",
        whiteSpace: "pre-line",
      }}>
        {lang === "ar" ? about.intro_ar : about.intro_en}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
      }}>
        {items.map(([titleAr, titleEn, textAr, textEn], i) => (
          <div key={i} style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
            background: "white",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}>
            <h3 style={{ color: "#0f766e", marginTop: 0 }}>
              {lang === "ar" ? titleAr : titleEn}
            </h3>
            <p style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {lang === "ar" ? textAr : textEn}
            </p>
          </div>
        ))}
      </div>

      <h3 style={{ textAlign: "center", marginTop: "22px", color: "#0f172a" }}>
        {lang === "ar" ? "الأهداف العامة" : "General Goals"}
      </h3>

      <div style={{ marginTop: "12px" }}>
        {goals.map(([ar, en], i) => (
          <div key={i} style={{
            background: i % 2 === 0 ? "#ecfdf5" : "#f8fafc",
            borderRight: lang === "ar" ? "5px solid #0f766e" : "none",
            borderLeft: lang === "en" ? "5px solid #0f766e" : "none",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "10px",
            fontWeight: "500",
            whiteSpace: "pre-line",
          }}>
            <strong>{lang === "ar" ? `الهدف ${i + 1}: ` : `Goal ${i + 1}: `}</strong>
            {lang === "ar" ? ar : en}
          </div>
        ))}
      </div>
    </div>
  );
}