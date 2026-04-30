import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function QualityPortal({
  activeModule,
  lang,
  cardStyle,
  sectionTitle,
  subTitle,
}) {
  const [qualityReports, setQualityReports] = useState([]);
  const [loadingQuality, setLoadingQuality] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  useEffect(() => {
    if (activeModule === "quality") {
      fetchQualityReports();
    }
  }, [activeModule]);

  async function fetchQualityReports() {
    setLoadingQuality(true);

    const { data, error } = await supabase
      .from("quality_reports_dev")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("QUALITY REPORTS ERROR:", error);
      setQualityReports([]);
      setLoadingQuality(false);
      return;
    }

    setQualityReports(data ?? []);
    setLoadingQuality(false);
  }

  if (activeModule !== "quality") return null;

  const total = qualityReports.length;

  const getProgress = (item) =>
    item.target_value
      ? Math.min(
          Math.round((Number(item.current_value) / Number(item.target_value)) * 100),
          100
        )
      : 0;

  const averageProgress =
    total > 0
      ? Math.round(
          qualityReports.reduce((sum, item) => sum + getProgress(item), 0) / total
        )
      : 0;

  const excellentCount = qualityReports.filter((item) => getProgress(item) >= 95).length;
  const followUpCount = qualityReports.filter((item) => getProgress(item) < 90).length;

  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }}>
      <div style={sectionTitle}>
        {lang === "ar" ? "الجودة والتحليلات" : "Quality & Analytics"}
      </div>

      <div style={subTitle}>
        {lang === "ar"
          ? "متابعة مؤشرات الجودة وتحليل الأداء الأكاديمي لدعم اتخاذ القرار."
          : "Monitoring quality indicators and academic performance to support decision making."}
      </div>

      <div style={{ ...cardStyle, marginBottom: "20px", background: "#f0fdfa" }}>
        <h3 style={{ marginTop: 0 }}>
          {lang === "ar" ? "عن وحدة الجودة" : "About Quality Unit"}
        </h3>

        <p style={{ lineHeight: 1.8, color: "#334155" }}>
          {lang === "ar"
            ? "تهدف وحدة الجودة إلى متابعة وتحسين الأداء الأكاديمي من خلال تحليل مؤشرات الأداء الرئيسية، وقياس مدى تحقيق المستهدفات، وتقديم توصيات تساعد في تطوير البرامج الأكاديمية."
            : "The quality unit aims to monitor and improve academic performance by analyzing key performance indicators, measuring target achievement, and providing recommendations to improve academic programs."}
        </p>
      </div>

      {loadingQuality && (
        <p>{lang === "ar" ? "جارٍ تحميل مؤشرات الجودة..." : "Loading quality indicators..."}</p>
      )}

      {!loadingQuality && qualityReports.length === 0 && (
        <p style={{ color: "#b45309" }}>
          {lang === "ar"
            ? "لا توجد مؤشرات جودة مضافة حاليًا."
            : "No quality indicators are currently available."}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {qualityReports.map((item) => {
          const title = lang === "ar" ? item.indicator_ar : item.indicator_en;
          const unit = lang === "ar" ? item.unit_ar : item.unit_en;
          const status = lang === "ar" ? item.status_ar : item.status_en;
          const progress = getProgress(item);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedIndicator(item)}
              style={{
                ...cardStyle,
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h3 style={{ marginTop: 0 }}>{title}</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  margin: "10px 0",
                  color: "#0f766e",
                }}
              >
                {item.current_value} {unit}
              </p>

              <p style={{ color: "#64748b" }}>
                {lang === "ar" ? "المستهدف:" : "Target:"}{" "}
                {item.target_value} {unit}
              </p>

              <div
                style={{
                  background: "#e5e7eb",
                  borderRadius: "999px",
                  height: "10px",
                  overflow: "hidden",
                  margin: "12px 0",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      progress >= 95
                        ? "#16a34a"
                        : progress >= 80
                        ? "#f59e0b"
                        : "#dc2626",
                  }}
                />
              </div>

              <p style={{ fontWeight: "bold", color: "#334155" }}>
                {status}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ ...cardStyle, background: "#f8fafc" }}>
        <h3 style={{ marginTop: 0 }}>
          {lang === "ar" ? "ملخص تحليل الجودة" : "Quality Analysis Summary"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <div style={cardStyle}>
            <strong>{lang === "ar" ? "عدد المؤشرات" : "Indicators"}</strong>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#0f766e" }}>
              {total}
            </p>
          </div>

          <div style={cardStyle}>
            <strong>{lang === "ar" ? "متوسط الإنجاز" : "Average Progress"}</strong>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#0f766e" }}>
              {averageProgress}%
            </p>
          </div>

          <div style={cardStyle}>
            <strong>{lang === "ar" ? "مؤشرات ممتازة" : "Excellent"}</strong>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#16a34a" }}>
              {excellentCount}
            </p>
          </div>

          <div style={cardStyle}>
            <strong>{lang === "ar" ? "تحتاج متابعة" : "Need Follow-up"}</strong>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#f59e0b" }}>
              {followUpCount}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            borderRadius: "14px",
            background: "#ecfdf5",
            border: "1px solid #99f6e4",
            color: "#134e4a",
            lineHeight: 1.8,
            fontWeight: "bold",
          }}
        >
          {lang === "ar"
            ? averageProgress >= 90
              ? "النتائج العامة جيدة، وتشير إلى أن مؤشرات الجودة تسير باتجاه إيجابي مع الحاجة إلى متابعة المؤشرات الأقل من المستهدف."
              : "تحتاج مؤشرات الجودة إلى متابعة وتحسين، خصوصًا المؤشرات التي لم تصل إلى المستوى المستهدف."
            : averageProgress >= 90
            ? "Overall results are good and indicate positive quality performance, with a need to follow up on indicators below target."
            : "Quality indicators need further monitoring and improvement, especially those below target."}
        </div>
      </div>

      {selectedIndicator && (
        <div
          onClick={() => setSelectedIndicator(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "24px",
              width: "90%",
              maxWidth: "600px",
            }}
          >
            <h2>
              {lang === "ar"
                ? selectedIndicator.indicator_ar
                : selectedIndicator.indicator_en}
            </h2>

            <p>
              <strong>{lang === "ar" ? "القيمة الحالية:" : "Current Value:"}</strong>{" "}
              {selectedIndicator.current_value}
            </p>

            <p>
              <strong>{lang === "ar" ? "القيمة المستهدفة:" : "Target Value:"}</strong>{" "}
              {selectedIndicator.target_value}
            </p>

            <p style={{ color: "#64748b", lineHeight: 1.7 }}>
              {lang === "ar"
                ? selectedIndicator.analysis_ar
                : selectedIndicator.analysis_en}
            </p>

            <p style={{ color: "#0f766e", lineHeight: 1.7 }}>
              <strong>{lang === "ar" ? "التوصية:" : "Recommendation:"}</strong>{" "}
              {lang === "ar"
                ? selectedIndicator.recommendation_ar
                : selectedIndicator.recommendation_en}
            </p>

            <button
              onClick={() => setSelectedIndicator(null)}
              style={{
                marginTop: "16px",
                background: "#0f766e",
                color: "white",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                  fontFamily: "Tajawal, sans-serif",
              }}
            >
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}