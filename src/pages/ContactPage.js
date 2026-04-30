export default function ContactPage({ lang }) {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        {lang === "ar" ? "تواصل معنا" : "Contact Us"}
      </h2>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          lineHeight: 2,
          fontSize: "18px",
        }}
      >
        <p>
          📍 {lang === "ar" ? "الكلية الجامعية بتيماء - جامعة تبوك" : "Tayma - University of Tabuk"}
        </p>

        <p>
          📧 Email: example@ut.edu.sa
        </p>

        <p>
          📞 Phone: 014-xxxxxxx
        </p>

        <p>
          🌐 Website: www.ut.edu.sa
        </p>
      </div>
    </div>
  );
}