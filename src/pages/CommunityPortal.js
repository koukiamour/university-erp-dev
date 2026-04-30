import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CommunityPortal({ activeModule, lang, cardStyle }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (activeModule === "community") fetchCommunity();
  }, [activeModule]);

  async function fetchCommunity() {
    const { data, error } = await supabase
      .from("community_initiatives")
      .select("*")
      .order("date", { ascending: true });

    if (!error) setItems(data ?? []);
  }

  if (activeModule !== "community") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isUpcoming(item) {
    const itemDate = new Date(item.date + "T00:00:00");
    return itemDate >= today;
  }

  const upcoming = items.filter((item) => isUpcoming(item));
  const past = items.filter((item) => !isUpcoming(item));

  function getTitle(item) {
    return lang === "ar" ? item.title_ar : item.title_en;
  }

  function getDescription(item) {
    return lang === "ar" ? item.description_ar : item.description_en;
  }

  function InitiativeCard({ item }) {
    const upcomingStatus = isUpcoming(item);

    return (
      <div
        style={{
          ...cardStyle,
          display: "grid",
          gridTemplateColumns: "160px 1fr",
          gap: "18px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        {item.image_url && (
          <img
            src={item.image_url}
            alt={getTitle(item)}
            style={{
              width: "160px",
              height: "160px",
              objectFit: "contain",
              borderRadius: "14px",
              background: "#f1f5f5",
            }}
          />
        )}

        <div>
          <span
            style={{
              display: "inline-block",
              background: upcomingStatus ? "#fef3c7" : "#dcfce7",
              color: upcomingStatus ? "#92400e" : "#166534",
              padding: "5px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {upcomingStatus
              ? lang === "ar"
                ? "قادمة"
                : "Upcoming"
              : lang === "ar"
              ? "منتهية"
              : "Completed"}
          </span>

          <h3 style={{ marginTop: 0 }}>{getTitle(item)}</h3>

          <p style={{ color: "#64748b", lineHeight: 1.8 }}>
            {getDescription(item)}
          </p>

          <p style={{ color: "#0f766e", fontWeight: "bold" }}>
            📅 {item.date}
          </p>

          {item.registration_url && upcomingStatus && (
            <a
              href={item.registration_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: "8px",
                background: "#0f766e",
                color: "white",
                padding: "9px 14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {lang === "ar" ? "التسجيل في المبادرة" : "Register"}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }}>
      <h2 style={{ marginTop: 0 }}>
        🌱 {lang === "ar" ? "المسؤولية المجتمعية" : "Community Responsibility"}
      </h2>

      <p style={{ color: "#64748b", lineHeight: 1.7 }}>
        {lang === "ar"
          ? "تعرض هذه الصفحة المبادرات المجتمعية القادمة للتسجيل، بالإضافة إلى توثيق المبادرات والورش التي تم تنفيذها سابقًا."
          : "This page displays upcoming initiatives for registration and documents previous initiatives."}
      </p>

      <h3>{lang === "ar" ? "📢 المبادرات القادمة" : "📢 Upcoming Initiatives"}</h3>
      {upcoming.length === 0 ? (
        <p style={{ color: "#b45309" }}>
          {lang === "ar" ? "لا توجد مبادرات قادمة حاليًا." : "No upcoming initiatives."}
        </p>
      ) : (
        upcoming.map((item) => <InitiativeCard key={item.id} item={item} />)
      )}

      <h3 style={{ marginTop: "28px" }}>
        {lang === "ar" ? "📌 مبادرات وورش سابقة" : "📌 Previous Initiatives"}
      </h3>
      {past.length === 0 ? (
        <p style={{ color: "#b45309" }}>
          {lang === "ar" ? "لا توجد مبادرات سابقة حاليًا." : "No previous initiatives."}
        </p>
      ) : (
        past.map((item) => <InitiativeCard key={item.id} item={item} />)
      )}
    </section>
  );
}