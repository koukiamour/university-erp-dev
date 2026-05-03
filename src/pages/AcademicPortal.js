import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AcademicPortal({ activeModule, lang, cardStyle, profile }) {
  const [showAcademicForm, setShowAcademicForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState("requests");

  const [calendar, setCalendar] = useState([]);
  const [grades, setGrades] = useState([]);
  const [exams, setExams] = useState([]);

  const [form, setForm] = useState({
    student_name: "",
    university_id: "",
    request_type: "add",
  });

  const [courses, setCourses] = useState([
    { course_name: "", course_code: "", section_number: "" },
  ]);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("academic_affairs_items")
      .select("*")
      .order("id", { ascending: false });

    if (error) return alert(error.message);
    setRequests(data || []);
  }

  async function fetchExtraData() {
    const [cal, ex, gr] = await Promise.all([
      supabase.from("academic_calendar").select("*").order("event_date"),
      supabase.from("exam_schedule").select("*").order("exam_date"),
      supabase.from("student_grades").select("*").order("id", { ascending: false }),
    ]);

    if (!cal.error) setCalendar(cal.data || []);
    if (!ex.error) setExams(ex.data || []);
    if (!gr.error) setGrades(gr.data || []);
  }

  useEffect(() => {
    if (activeModule === "academic") {
      fetchRequests();
      fetchExtraData();
    }
  }, [activeModule]);

  async function submit(e) {
    e.preventDefault();

    const { error } = await supabase.from("academic_affairs_items").insert([
      {
        student_name: form.student_name,
        university_id: form.university_id,
        request_type: form.request_type,
        courses: JSON.stringify(courses),
        status: "جديد",
        reason: "",
        archived: false,
        is_deleted: false,
      },
    ]);

    if (error) return alert(error.message);

    alert(lang === "ar" ? "تم إرسال الطلب بنجاح" : "Request submitted");

    setForm({
      student_name: "",
      university_id: "",
      request_type: "add",
    });

    setCourses([{ course_name: "", course_code: "", section_number: "" }]);
    setShowAcademicForm(false);
    fetchRequests();
  }

  function printReport() {
    const reportContent = document.getElementById("report-section");

    if (!reportContent) {
      alert(lang === "ar" ? "لا يوجد تقرير للطباعة" : "No report to print");
      return;
    }

    const win = window.open("", "", "width=1000,height=700");

    win.document.write(`
      <html dir="${lang === "ar" ? "rtl" : "ltr"}">
        <head>
          <title>${lang === "ar" ? "تقرير الشؤون الأكاديمية" : "Academic Report"}</title>
          <style>
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: Arial, sans-serif; }
            h2 { color: #0f766e; text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; vertical-align: top; }
            th { background: #0f766e; color: white; }
            .print-date { margin-bottom: 16px; color: #475569; text-align: center; }
          </style>
        </head>
        <body>
          <h2>${lang === "ar" ? "تقرير طلبات الشؤون الأكاديمية" : "Academic Affairs Requests Report"}</h2>
          <div class="print-date">
            ${lang === "ar" ? "تاريخ الطباعة:" : "Print Date:"} ${new Date().toLocaleString()}
          </div>
          ${reportContent.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  }

  const visibleRequests = requests.filter((r) => !r.is_deleted);

  if (activeModule !== "academic") return null;

  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }}>
      <h2 style={{ color: "#0f766e" }}>
        {lang === "ar" ? "الشؤون الأكاديمية" : "Academic Affairs"}
      </h2>

      <p style={{ color: "#64748b", lineHeight: 1.8 }}>
        {lang === "ar"
          ? "إدارة الطلبات الأكاديمية، التقويم الأكاديمي، الدرجات، ومواعيد الاختبارات."
          : "Manage academic requests, academic calendar, grades, and exam schedules."}
      </p>

      <div style={tabsContainer}>
        <button type="button" onClick={() => setTab("requests")} style={tabBtn(tab === "requests")}>
          {lang === "ar" ? "📌 الطلبات" : "📌 Requests"}
        </button>

        <button type="button" onClick={() => setTab("calendar")} style={tabBtn(tab === "calendar")}>
          {lang === "ar" ? "📅 التقويم" : "📅 Calendar"}
        </button>

        {profile && (
          <button type="button" onClick={() => setTab("grades")} style={tabBtn(tab === "grades")}>
            {lang === "ar" ? "📊 الدرجات" : "📊 Grades"}
          </button>
        )}

        {profile && (
          <button type="button" onClick={() => setTab("exams")} style={tabBtn(tab === "exams")}>
            {lang === "ar" ? "📝 الاختبارات" : "📝 Exams"}
          </button>
        )}
      </div>

      {tab === "requests" && (
        <>
          {profile && (
            <>
              <button
                type="button"
                onClick={() => setShowAcademicForm(!showAcademicForm)}
                style={{ ...buttonStyle, marginBottom: "12px", background: "#0f766e" }}
              >
                {showAcademicForm
                  ? lang === "ar"
                    ? "إغلاق نموذج الطلب"
                    : "Close Request Form"
                  : lang === "ar"
                  ? "فتح نموذج الطلب"
                  : "Open Request Form"}
              </button>

              {showAcademicForm && (
                <form onSubmit={submit} style={formBoxStyle}>
                  <input
                    placeholder={lang === "ar" ? "اسم الطالبة" : "Student Name"}
                    value={form.student_name}
                    onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                    style={inputStyle}
                    required
                  />

                  <input
                    placeholder={lang === "ar" ? "الرقم الجامعي" : "University ID"}
                    value={form.university_id}
                    onChange={(e) => setForm({ ...form, university_id: e.target.value })}
                    style={inputStyle}
                    required
                  />

                  <select
                    value={form.request_type}
                    onChange={(e) => setForm({ ...form, request_type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="add">طلب إضافة مقررات</option>
                    <option value="drop">طلب حذف مقررات</option>
                  </select>

                  <h3 style={{ color: "#0f172a" }}>
                    {lang === "ar" ? "بيانات المقررات" : "Courses Information"}
                  </h3>

                  {courses.map((course, index) => (
                    <div key={index} style={courseBox}>
                      <input
                        placeholder={lang === "ar" ? "اسم المقرر" : "Course Name"}
                        value={course.course_name}
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[index].course_name = e.target.value;
                          setCourses(updated);
                        }}
                        style={inputStyle}
                        required
                      />

                      <input
                        placeholder={lang === "ar" ? "رمز المقرر" : "Course Code"}
                        value={course.course_code}
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[index].course_code = e.target.value;
                          setCourses(updated);
                        }}
                        style={inputStyle}
                        required
                      />

                      <input
                        placeholder={lang === "ar" ? "رقم الشعبة" : "Section Number"}
                        value={course.section_number}
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[index].section_number = e.target.value;
                          setCourses(updated);
                        }}
                        style={inputStyle}
                        required
                      />

                      {courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCourses(courses.filter((_, i) => i !== index))}
                          style={dangerButton}
                        >
                          {lang === "ar" ? "حذف هذا المقرر" : "Remove Course"}
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCourses([
                        ...courses,
                        { course_name: "", course_code: "", section_number: "" },
                      ])
                    }
                    style={{ ...buttonStyle, marginBottom: "12px", background: "#134e4a" }}
                  >
                    {lang === "ar" ? "➕ إضافة مقرر آخر" : "➕ Add Another Course"}
                  </button>

                  <button type="submit" style={buttonStyle}>
                    {lang === "ar" ? "إرسال الطلب" : "Submit Request"}
                  </button>
                </form>
              )}
            </>
          )}

          {profile?.role === "admin" && (
            <>
              <h3 style={{ marginTop: "28px", color: "#0f766e" }}>
                {lang === "ar" ? "إدارة طلبات الشؤون الأكاديمية" : "Academic Requests Management"}
              </h3>

              <div style={scrollBox}>
                {visibleRequests.length === 0 ? (
                  <p>{lang === "ar" ? "لا توجد طلبات حالياً" : "No requests"}</p>
                ) : (
                  visibleRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      lang={lang}
                      fetchRequests={fetchRequests}
                    />
                  ))
                )}
              </div>

              <h3 style={{ marginTop: "28px", color: "#0f766e" }}>
                {lang === "ar" ? "تقرير الطلبات" : "Requests Report"}
              </h3>

              <button type="button" onClick={printReport} style={printButton}>
                {lang === "ar" ? "🖨️ طباعة التقرير" : "🖨️ Print Report"}
              </button>

              <ReportTable requests={requests} lang={lang} />
            </>
          )}

          {!profile && (
            <p style={emptyMessageStyle}>
              {lang === "ar"
                ? "يرجى تسجيل الدخول لإرسال طلب أكاديمي."
                : "Please login to submit an academic request."}
            </p>
          )}
        </>
      )}

      {tab === "calendar" && (
        <div style={calendarGrid}>
          {calendar.length === 0 ? (
            <p>{lang === "ar" ? "لا توجد أحداث في التقويم حالياً" : "No calendar events"}</p>
          ) : (
            calendar.map((item) => (
              <div key={item.id} style={miniCard}>
                <div style={miniHeader}>
                  <span style={{ color: item.badge_color || "#0f766e" }}>
                    {item.title}
                  </span>
                </div>

                <div style={miniDate}>{item.event_date}</div>

                {item.week_label && (
                  <div
                    style={{
                      ...miniBadge,
                      background: "#e2e8f0",
                      color: "#334155",
                    }}
                  >
                    {item.week_label}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "grades" && profile && (
        <div style={tableScrollBox}>
          <table style={reportTable}>
            <thead>
              <tr>
                <th style={tableHeader}>{lang === "ar" ? "اسم الطالبة" : "Student"}</th>
                <th style={tableHeader}>{lang === "ar" ? "الرقم الجامعي" : "Student ID"}</th>
                <th style={tableHeader}>{lang === "ar" ? "المقرر" : "Course"}</th>
                <th style={tableHeader}>{lang === "ar" ? "الدرجة" : "Grade"}</th>
                <th style={tableHeader}>{lang === "ar" ? "التقدير" : "Letter"}</th>
              </tr>
            </thead>

            <tbody>
              {grades.length === 0 ? (
                <tr>
                  <td style={tableCell} colSpan="5">
                    {lang === "ar" ? "لا توجد درجات حالياً" : "No grades found"}
                  </td>
                </tr>
              ) : (
                grades.map((g) => (
                  <tr key={g.id}>
                    <td style={tableCell}>{g.student_name || "-"}</td>
                    <td style={tableCell}>{g.student_id || g.university_id || "-"}</td>
                    <td style={tableCell}>{g.course_name || "-"}</td>
                    <td style={tableCell}>{g.grade ?? "-"}</td>
                    <td style={tableCell}>{g.letter_grade || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "exams" && profile && (
        <div style={tableScrollBox}>
          <table style={reportTable}>
            <thead>
              <tr>
                <th style={tableHeader}>{lang === "ar" ? "المقرر" : "Course"}</th>
                <th style={tableHeader}>{lang === "ar" ? "التاريخ" : "Date"}</th>
                <th style={tableHeader}>{lang === "ar" ? "الوقت" : "Time"}</th>
                <th style={tableHeader}>{lang === "ar" ? "القاعة" : "Room"}</th>
                <th style={tableHeader}>{lang === "ar" ? "نوع الاختبار" : "Exam Type"}</th>
              </tr>
            </thead>

            <tbody>
              {exams.length === 0 ? (
                <tr>
                  <td style={tableCell} colSpan="5">
                    {lang === "ar" ? "لا توجد اختبارات حالياً" : "No exams found"}
                  </td>
                </tr>
              ) : (
                exams.map((e) => (
                  <tr key={e.id}>
                    <td style={tableCell}>{e.course_name || "-"}</td>
                    <td style={tableCell}>{e.exam_date || "-"}</td>
                    <td style={tableCell}>{e.exam_time || "-"}</td>
                    <td style={tableCell}>{e.room || "-"}</td>
                    <td style={tableCell}>{e.exam_type || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function RequestCard({ request, lang, fetchRequests }) {
  let parsedCourses = [];

  try {
    parsedCourses = JSON.parse(request.courses || "[]");
  } catch {
    parsedCourses = [];
  }

  async function updateRequest(values) {
    const { error } = await supabase
      .from("academic_affairs_items")
      .update(values)
      .eq("id", request.id);

    if (error) return alert(error.message);
    fetchRequests();
  }

  function rejectRequest() {
    const reason = prompt(
      lang === "ar" ? "اكتب سبب الرفض / عدم التنفيذ" : "Enter rejection reason"
    );

    if (!reason) return;

    updateRequest({
      status: "مرفوض",
      reason,
    });
  }

  function deleteFromList() {
    if (!request.archived) {
      alert(
        lang === "ar"
          ? "يجب رفع الطلب في التقرير قبل حذفه من القائمة"
          : "Request must be added to report first"
      );
      return;
    }

    updateRequest({
      is_deleted: true,
    });
  }

  return (
    <div style={requestCard}>
      <strong>{request.student_name}</strong>

      <div style={infoRow}>
        <span>
          {lang === "ar" ? "الرقم الجامعي:" : "ID:"} {request.university_id}
        </span>

        <span>
          {lang === "ar" ? "نوع الطلب:" : "Type:"} {" "}
          {request.request_type === "add"
            ? lang === "ar"
              ? "إضافة"
              : "Add"
            : lang === "ar"
            ? "حذف"
            : "Drop"}
        </span>

        <span>
          {lang === "ar" ? "الحالة:" : "Status:"} <strong>{request.status}</strong>
        </span>
      </div>

      {request.reason && (
        <p style={{ color: "#b91c1c" }}>
          {lang === "ar" ? "السبب: " : "Reason: "}
          {request.reason}
        </p>
      )}

      <div style={{ marginTop: "8px" }}>
        {parsedCourses.map((course, index) => (
          <div key={index} style={courseItem}>
            📘 {course.course_name} - {course.course_code} - {lang === "ar" ? "شعبة" : "Section"} {course.section_number}
          </div>
        ))}
      </div>

      <div style={actionsRow}>
        <button
          type="button"
          style={{ ...buttonStyle, background: "#06a497" }}
          onClick={() => updateRequest({ status: "معتمد" })}
        >
          {lang === "ar" ? "اعتماد الطلب" : "Approve"}
        </button>

        <button
          type="button"
          style={{ ...buttonStyle, background: "#1b92d2" }}
          onClick={() => updateRequest({ status: "منفذ" })}
        >
          {lang === "ar" ? "تم التنفيذ" : "Mark as Done"}
        </button>

        <button
          type="button"
          style={{ ...buttonStyle, background: "#b91c1c" }}
          onClick={rejectRequest}
        >
          {lang === "ar" ? "رفض / لم يتم التنفيذ" : "Reject / Not Done"}
        </button>

        <button
          type="button"
          style={{ ...buttonStyle, background: "#e858c1" }}
          onClick={() => updateRequest({ archived: true })}
        >
          {lang === "ar" ? "رفع في التقرير" : "Add to Report"}
        </button>

        <button
          type="button"
          style={{ ...buttonStyle, background: "#a215b8" }}
          onClick={deleteFromList}
        >
          {lang === "ar" ? "حذف من القائمة بعد التقرير" : "Delete After Report"}
        </button>
      </div>
    </div>
  );
}

function ReportTable({ requests, lang }) {
  const reportRows = requests.filter(
    (r) => r.archived || r.status !== "جديد" || r.is_deleted
  );

  return (
    <div id="report-section" style={tableScrollBox}>
      {reportRows.length === 0 ? (
        <p>{lang === "ar" ? "لا يوجد تقرير بعد" : "No report yet"}</p>
      ) : (
        <table style={reportTable}>
          <thead>
            <tr>
              <th style={tableHeader}>#</th>
              <th style={tableHeader}>{lang === "ar" ? "اسم الطالبة" : "Student"}</th>
              <th style={tableHeader}>{lang === "ar" ? "الرقم الجامعي" : "University ID"}</th>
              <th style={tableHeader}>{lang === "ar" ? "نوع الطلب" : "Type"}</th>
              <th style={tableHeader}>{lang === "ar" ? "المقررات" : "Courses"}</th>
              <th style={tableHeader}>{lang === "ar" ? "الحالة" : "Status"}</th>
              <th style={tableHeader}>{lang === "ar" ? "السبب" : "Reason"}</th>
              <th style={tableHeader}>{lang === "ar" ? "مرفوع بالتقرير" : "In Report"}</th>
              <th style={tableHeader}>{lang === "ar" ? "محذوف من القائمة" : "Deleted"}</th>
            </tr>
          </thead>

          <tbody>
            {reportRows.map((request, index) => {
              let parsedCourses = [];

              try {
                parsedCourses = JSON.parse(request.courses || "[]");
              } catch {
                parsedCourses = [];
              }

              return (
                <tr key={request.id}>
                  <td style={tableCell}>{index + 1}</td>
                  <td style={tableCell}>{request.student_name}</td>
                  <td style={tableCell}>{request.university_id}</td>

                  <td style={tableCell}>
                    {request.request_type === "add"
                      ? lang === "ar"
                        ? "إضافة"
                        : "Add"
                      : lang === "ar"
                      ? "حذف"
                      : "Drop"}
                  </td>

                  <td style={tableCell}>
                    {parsedCourses.length === 0
                      ? "-"
                      : parsedCourses.map((course, i) => (
                          <div key={i}>
                            {course.course_name} - {course.course_code} - {lang === "ar" ? "شعبة" : "Section"} {course.section_number}
                          </div>
                        ))}
                  </td>

                  <td style={tableCell}>
                    <span style={statusBadge(request.status)}>{request.status}</span>
                  </td>

                  <td style={tableCell}>{request.reason || "-"}</td>
                  <td style={tableCell}>{request.archived ? "نعم" : "لا"}</td>
                  <td style={tableCell}>{request.is_deleted ? "نعم" : "لا"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tabsContainer = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const tabBtn = (active) => ({
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  background: active ? "#0f766e" : "#e2e8f0",
  color: active ? "white" : "#0f172a",
  fontFamily: "Tajawal, sans-serif",
  fontWeight: "700",
});

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "10px",
};

const miniCard = {
  background: "#f8fafc",
  borderRadius: "12px",
  padding: "10px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  minHeight: "90px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const miniHeader = {
  fontSize: "13px",
  fontWeight: "700",
  lineHeight: "1.4",
};

const miniDate = {
  fontSize: "12px",
  color: "#64748b",
};

const miniBadge = {
  padding: "3px 8px",
  borderRadius: "999px",
  fontSize: "11px",
  alignSelf: "flex-start",
  fontWeight: "700",
};

const formBoxStyle = {
  background: "#f8fafc",
  border: "1px solid #ccfbf1",
  borderRadius: "16px",
  padding: "14px",
  marginBottom: "18px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  fontSize: "18px",
  fontWeight: "500",
  color: "#334155",
  marginTop: "6px",
  flexWrap: "wrap",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginBottom: "12px",
  boxSizing: "border-box",
  fontFamily: "Tajawal, sans-serif",
};

const buttonStyle = {
  width: "auto",
  minWidth: "110px",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12.5px",
  border: "none",
  background: "#64748b",
  color: "white",
  fontFamily: "Tajawal, sans-serif",
  transition: "all 0.2s ease",
};

const printButton = {
  background: "#334155",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "12px",
  fontWeight: "bold",
  fontFamily: "Tajawal, sans-serif",
};

const dangerButton = {
  ...buttonStyle,
  background: "#134e4a",
  marginBottom: "8px",
};

const courseBox = {
  background: "#f8fafc",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ccfbf1",
  marginBottom: "12px",
};

const scrollBox = {
  maxHeight: "300px",
  overflowY: "auto",
  background: "#f8fafc",
  border: "1px solid #ccfbf1",
  borderRadius: "16px",
  padding: "12px",
};

const requestCard = {
  background: "white",
  borderRadius: "14px",
  padding: "12px",
  marginBottom: "10px",
  borderRight: "5px solid #0f766e",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  lineHeight: 1.6,
};

const courseItem = {
  background: "#ecfdf5",
  padding: "8px",
  borderRadius: "8px",
  marginBottom: "6px",
};

const actionsRow = {
  display: "flex",
  justifyContent: "center",
  gap: "6px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const tableScrollBox = {
  maxHeight: "380px",
  overflow: "auto",
  background: "#f8fafc",
  border: "1px solid #ccfbf1",
  borderRadius: "16px",
  padding: "12px",
};

const reportTable = {
  width: "100%",
  minWidth: "950px",
  borderCollapse: "collapse",
  background: "white",
  fontFamily: "Tajawal, sans-serif",
};

const tableHeader = {
  background: "#0f766e",
  color: "white",
  padding: "10px",
  textAlign: "center",
  position: "sticky",
  top: 0,
  zIndex: 1,
  border: "1px solid #ccfbf1",
};

const tableCell = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ccfbf1",
  verticalAlign: "top",
  fontSize: "14px",
};

const emptyMessageStyle = {
  color: "#b45309",
  background: "#fffbeb",
  border: "1px solid #fde68a",
  padding: "12px",
  borderRadius: "12px",
};

const statusBadge = (status) => {
  const styles = {
    منفذ: {
      background: "#e6f4f1",
      color: "#0f766e",
    },
    معتمد: {
      background: "#e6f0fa",
      color: "#1d4ed8",
    },
    مرفوض: {
      background: "#fdecec",
      color: "#b91c1c",
    },
    جديد: {
      background: "#f1f5f9",
      color: "#475569",
    },
  };

  const s = styles[status] || styles["جديد"];

  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background: s.background,
    color: s.color,
  };
};
