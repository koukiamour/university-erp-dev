export default function StructurePage({ lang = "ar", structure }) {
  const imageUrl =
    lang === "ar"
      ? structure?.image_url_ar
      : structure?.image_url_en;

  return (
    <div style={{ textAlign: "center" }}>
      {!imageUrl && (
        <p style={{ color: "#b45309", fontWeight: "bold" }}>
          {lang === "ar"
            ? "جارٍ تحميل الهيكل التنظيمي..."
            : "Loading organizational structure..."}
        </p>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt={lang === "ar" ? "الهيكل التنظيمي" : "Organizational Structure"}
          loading="lazy"
          decoding="async"
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