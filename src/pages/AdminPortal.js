export default function AdminPortal({
  session,
  profile,
  lang,
  cardStyle,
  stats,
  setActiveModule,
}) {
  if (!session || profile?.role !== "admin") return null;

  const allowedModules = profile?.module || [];

  const infoCard = {
    background: "white",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ccfbf1",
  };

  return (
    <section
      style={{
        ...cardStyle,
        marginBottom: "24px",
        border: "2px solid #0f766e",
        background: "linear-gradient(180deg, #ffffff, #f0fdfa)",
      }}
    >
      <div
        style={{
          background: "#0f766e",
          color: "white",
          padding: "16px",
          borderRadius: "14px",
          marginBottom: "18px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {lang === "ar" ? "بوابة مسؤول النظام" : "Admin Portal"}
        </h2>
        <p style={{ marginBottom: 0 }}>
          {lang === "ar"
            ? "لوحة متابعة وإدارة بيانات النظام"
            : "System monitoring and management dashboard"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        {[
          [lang === "ar" ? "الاسم" : "Name", lang === "ar" ? profile.name_ar : profile.name_en],
          [lang === "ar" ? "الطلاب" : "Students", stats.students],
          [lang === "ar" ? "البرامج" : "Programs", stats.programs],
          [lang === "ar" ? "الأبحاث" : "Research", stats.research],
        ].map(([label, value]) => (
          <div key={label} style={infoCard}>
            <div style={{ color: "#0f766e", fontWeight: "bold", fontSize: "13px" }}>
              {label}
            </div>
            <div style={{ marginTop: "6px", fontWeight: "bold" }}>
              {value || 0}
            </div>
          </div>
        ))}
      </div>

      <h3>{lang === "ar" ? "الصلاحيات المتاحة" : "Allowed Modules"}</h3>

      {allowedModules.length === 0 ? (
        <p style={{ color: "#b45309", background: "#fffbeb", padding: "12px", borderRadius: "10px" }}>
          {lang === "ar" ? "لا توجد صلاحيات محددة." : "No permissions assigned."}
        </p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {allowedModules.map((moduleName) => (
            <button
              key={moduleName}
              onClick={() => setActiveModule(moduleName)}
              style={{
                background: "#0f766e",
                color: "white",
                border: "none",
                padding: "9px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontFamily: "Tajawal, sans-serif",
              }}
            >
              {moduleName}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}