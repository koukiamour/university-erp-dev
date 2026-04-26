export default function InstructorPortal({
  session,
  profile,
  lang,
  cardStyle,
  instructorCourses,
}) {
  if (!session || profile?.role !== "instructor") return null;

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
          {lang === "ar" ? "بوابة عضو هيئة التدريس" : "Instructor Portal"}
        </h2>
        <p style={{ marginBottom: 0 }}>
          {lang === "ar"
            ? "بيانات عضو هيئة التدريس وجدول المحاضرات"
            : "Instructor information and teaching schedule"}
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
          [lang === "ar" ? "الرقم الوظيفي" : "Instructor ID", profile.instructor_id],
          [lang === "ar" ? "القسم" : "Department", lang === "ar" ? profile.department_ar : profile.department_en],
          [lang === "ar" ? "المسمى" : "Title", lang === "ar" ? profile.title_ar : profile.title_en],
        ].map(([label, value]) => (
          <div key={label} style={infoCard}>
            <div style={{ color: "#0f766e", fontWeight: "bold", fontSize: "13px" }}>
              {label}
            </div>
            <div style={{ marginTop: "6px", fontWeight: "bold" }}>
              {value || "-"}
            </div>
          </div>
        ))}
      </div>

      <h3>{lang === "ar" ? "جدول المحاضرات" : "Teaching Schedule"}</h3>

      {instructorCourses.length === 0 ? (
        <p style={{ color: "#b45309", background: "#fffbeb", padding: "12px", borderRadius: "10px" }}>
          {lang === "ar" ? "لا توجد مواد مسجلة لعضو هيئة التدريس." : "No courses found."}
        </p>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid #ccfbf1" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ background: "#0f766e", color: "white" }}>
                <th style={{ padding: "12px" }}>#</th>
                <th style={{ padding: "12px" }}>{lang === "ar" ? "رمز المادة" : "Code"}</th>
                <th style={{ padding: "12px" }}>{lang === "ar" ? "اسم المادة" : "Course"}</th>
                <th style={{ padding: "12px" }}>{lang === "ar" ? "اليوم" : "Day"}</th>
                <th style={{ padding: "12px" }}>{lang === "ar" ? "الوقت" : "Time"}</th>
                <th style={{ padding: "12px" }}>{lang === "ar" ? "القاعة" : "Room"}</th>
              </tr>
            </thead>

            <tbody>
              {instructorCourses.map((course, index) => (
                <tr
                  key={course.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                  }}
                >
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  <td style={{ padding: "12px", color: "#0f766e", fontWeight: "bold" }}>
                    {course.course_code}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {lang === "ar" ? course.course_name_ar : course.course_name_en}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {lang === "ar" ? course.day_ar : course.day_en}
                  </td>
                  <td style={{ padding: "12px" }}>{course.time_text}</td>
                  <td style={{ padding: "12px" }}>{course.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}