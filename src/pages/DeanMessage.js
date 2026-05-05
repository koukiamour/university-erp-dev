export default function DeanMessage({ lang, cardStyle, dean }) {
  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }}>
      <h2 style={{ marginTop: 0 }}>
        {lang === "ar" ? "كلمة العميد" : "Dean Message"}
      </h2>

      <img
        src={dean?.image_url || "/dean.jpg"}
        alt="Dean"
        loading="lazy"
        decoding="async"
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