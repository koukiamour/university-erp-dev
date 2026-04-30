export default function AboutCollege({ lang }) {
  const items = [
     {
      title_ar: "الرؤية",
      title_en: "Vision",
      text_ar: "التميز في العملية التعليمية والبحثية وخدمة المجتمع.",
      text_en:
        "Excellence in education, research, and community service.",
    },
    {
      title_ar: "الرسالة",
      title_en: "Mission",
      text_ar:
        "الارتقاء بالعمل على كافة مستويات العملية التعليمية والبحث العلمي والشراكة المجتمعية في نشر وتوطين المعرفة وتلبية احتياجات المجتمع في التخصصات المختلفة.",
      text_en:
        "Enhancing all levels of the educational process, scientific research, and community partnership in spreading and localizing knowledge and meeting community needs in various specializations.",
    },
  
    {
      title_ar: "الأهداف",
      title_en: "Goals",
      text_ar:
        "نضع رؤيتنا موضع التنفيذ عبر مجموعة من الأهداف العامة التي توجه مسيرتنا نحو التميز.",
      text_en:
        "We put our vision into practice through a set of goals that guide our journey toward excellence.",
    },
  ];

  const goals = [
    {
      ar: "تطوير البرامج والخطط والمقررات الدراسية.",
      en: "Developing academic programs, study plans, and courses.",
    },
    {
      ar: "دعم البحوث الإبداعية للمساهمة في بناء اقتصاد المعرفة.",
      en: "Supporting creative research to contribute to building a knowledge economy.",
    },
    {
      ar: "تعزيز الشراكة مع مؤسسات وأفراد المجتمع المحلي.",
      en: "Strengthening partnerships with local community institutions and individuals.",
    },
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
        }}
      >
        {lang === "ar"
          ? "تأسست الكلية الجامعية بمحافظة تيماء في عام 2009 لتوفير فرص الدراسة في المحافظة والمناطق المجاورة، وتضم الكلية ستة أقسام أكاديمية: الدراسات الإسلامية، اللغات والترجمة، الرياضيات، الأحياء، الإدارة، والحاسب الآلي."
          : "Tayma University College was established in 2009 to provide study opportunities in Tayma and nearby areas. The college includes six academic departments: Islamic Studies, Languages and Translation, Mathematics, Biology, Management, and Computer Science."}
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
            <p style={{ lineHeight: 1.8 }}>
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