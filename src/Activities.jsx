import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Activities({ lang = "ar" }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel("activities-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activities" },
        () => fetchActivities()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("activity_date", { ascending: true });

    if (error) {
      console.error("Error fetching activities:", error.message);
      return;
    }

    setActivities(data || []);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = activities
  .filter((a) => {
    const activityDate = new Date(a.activity_date + "T00:00:00");
    return activityDate >= today;
  })
  .slice(0, 1);

const past = activities.filter((a) => {
  const activityDate = new Date(a.activity_date + "T00:00:00");
  return activityDate < today;
});

  return (
    <div style={pageStyle} dir={lang === "ar" ? "rtl" : "ltr"}>
      <h1 style={mainTitle}>
        {lang === "ar" ? "الأنشطة الطلابية" : "Student Activities"}
      </h1>

      <p style={introText}>
        {lang === "ar"
          ? "تعرفي على أحدث الأنشطة والفعاليات الطلابية داخل الكلية."
          : "Explore the latest student activities and college events."}
      </p>

      <h2 style={sectionTitle}>
        {lang === "ar" ? "فعالية حالية للتسجيل" : "Current Activity for Registration"}
      </h2>

      <div style={gridStyle}>
        {upcoming.length === 0 ? (
          <p style={emptyText}>
            {lang === "ar"
              ? "لا توجد أنشطة قادمة حاليًا."
              : "No upcoming activities at the moment."}
          </p>
        ) : (
          upcoming.map((act) => (
            <ActivityCard key={act.id} act={act} lang={lang} showRegister />
          ))
        )}
      </div>

      <h2 style={{ ...sectionTitle, marginTop: "36px" }}>
        {lang === "ar" ? "فعاليات منفذة سابقًا" : "Completed Activities"}
      </h2>

      <div style={gridStyle}>
        {past.length === 0 ? (
          <p style={emptyText}>
            {lang === "ar"
              ? "لا توجد أنشطة سابقة حاليًا."
              : "No past activities at the moment."}
          </p>
        ) : (
          past.map((act) => (
            <ActivityCard key={act.id} act={act} lang={lang} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityCard({ act, lang, showRegister = false }) {
  const title = lang === "ar" ? act.title_ar : act.title_en;
  const details = lang === "ar" ? act.details_ar : act.details_en;
  const place = lang === "ar" ? act.activity_place_ar : act.activity_place_en;

  return (
    <div style={cardStyle}>
      {act.image_url ? (
        <img src={act.image_url} alt={title} style={imageStyle} />
      ) : (
        <div style={placeholderImage}>
          {lang === "ar" ? "صورة النشاط" : "Activity Image"}
        </div>
      )}
      {showRegister && (
        <div style={openBadge}>
          🔥 {lang === "ar" ? "التسجيل مفتوح" : "Registration Open"}
        </div>
      )}
      <div style={dateBadge}>{act.activity_date}</div>

      <h3 style={cardTitle}>{title}</h3>

      <p style={detailsStyle}>{details}</p>

      <p style={placeStyle}>
        📍 {place || (lang === "ar" ? "غير محدد" : "Not specified")}
      </p>

      {showRegister && act.registration_url && (
        <a
          href={act.registration_url}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
          
        >
          
          <button style={buttonStyle}>
            {lang === "ar" ? "التسجيل في النشاط" : "Register"}
          </button>
        </a>
      )}
    </div>
  );
}

export default Activities;

const pageStyle = {
  padding: "24px",
  background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
  minHeight: "100vh",
};

const mainTitle = {
  margin: "0 0 8px",
  color: "#0f172a",
  fontSize: "32px",
};

const introText = {
  marginBottom: "24px",
  color: "#475569",
  fontSize: "16px",
};

const sectionTitle = {
  color: "#0f766e",
  marginBottom: "16px",
  fontSize: "24px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
  border: "1px solid #e2e8f0",
  padding: "16px",
  position: "relative",
};

const imageStyle = {
  width: "100%",
  height: "170px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "14px",
};

const placeholderImage = {
  width: "100%",
  height: "170px",
  borderRadius: "14px",
  marginBottom: "14px",
  background: "linear-gradient(135deg, #ccfbf1, #ddd6fe)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0f766e",
  fontWeight: "700",
};

const dateBadge = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#ecfeff",
  color: "#0f766e",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "10px",
};

const cardTitle = {
  margin: "0 0 10px",
  color: "#111827",
  fontSize: "20px",
};

const detailsStyle = {
  color: "#475569",
  lineHeight: "1.8",
  minHeight: "90px",
};

const placeStyle = {
  color: "#334155",
  fontWeight: "600",
};

const buttonStyle = {
  width: "100%",
  marginTop: "12px",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
};
const emptyText = {
  color: "#64748b",
  background: "#ffffff",
  padding: "18px",
  borderRadius: "14px",
  border: "1px dashed #cbd5e1",
};