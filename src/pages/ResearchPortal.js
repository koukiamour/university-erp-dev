import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ResearchPortal({
  session,
  profile,
  lang,
  cardStyle,
  setActiveModule,
}) {
  const [research, setResearch] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const groupWrapper = {
    display: "grid",
    gap: "18px",
  };

  const departmentBox = {
    padding: "18px",
    borderRadius: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
  };

  const departmentTitle = {
    margin: "0 0 14px",
    color: "#0f766e",
    fontSize: "22px",
    fontWeight: "900",
  };

  const authorBox = {
    marginBottom: "12px",
    padding: "12px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
  };

  const authorTitle = {
    cursor: "pointer",
    fontWeight: "900",
    color: "#1e293b",
    fontSize: "16px",
  };

  const smallResearchGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  };

  const smallResearchCard = {
    padding: "14px",
    borderRadius: "14px",
    background: "white",
    border: "1px solid #e2e8f0",
  };

  const smallResearchTitle = {
    margin: "0 0 8px",
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#0f172a",
  };

  const [newResearch, setNewResearch] = useState({
    title_ar: "",
    title_en: "",
    author: "",
    department: "",
    journal: "",
    year: "",
    abstract_ar: "",
    abstract_en: "",
    research_url: "",
    pdf_url: "",
    gender: "",
  });

  const canAdd = !!session;

  useEffect(() => {
    fetchResearch();
  }, []);

  async function fetchResearch() {
    setLoading(true);

    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .order("year", { ascending: false });

    if (!error && data) setResearch(data);

    setLoading(false);
  }

  function handleChange(e) {
    setNewResearch({
      ...newResearch,
      [e.target.name]: e.target.value,
    });
  }

  async function handleAddResearch(e) {
    e.preventDefault();

    if (!session?.user?.id) {
      alert(lang === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first");
      return;
    }

    if (!newResearch.title_ar || !newResearch.author) {
      alert(
        lang === "ar"
          ? "العنوان العربي واسم الباحث مطلوبة"
          : "Arabic title and author are required"
      );
      return;
    }

    if (!newResearch.research_url && !newResearch.pdf_url) {
      alert(
        lang === "ar"
          ? "أضيفي رابط البحث أو رابط PDF"
          : "Please add research link or PDF link"
      );
      return;
    }

    setSaving(true);

    const payload = {
      ...newResearch,
      year: newResearch.year ? Number(newResearch.year) : null,
      status: "approved",
      created_by: newResearch.created_by || session.user.id,
    };

    const { error } = newResearch.id
      ? await supabase
          .from("research_projects")
          .update(payload)
          .eq("id", newResearch.id)
      : await supabase.from("research_projects").insert([payload]);

    setSaving(false);

    if (error) {
      alert(lang === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving research");
      console.log(error);
      return;
    }

    alert(lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");

    setNewResearch({
      title_ar: "",
      title_en: "",
      author: "",
      department: "",
      journal: "",
      year: "",
      abstract_ar: "",
      abstract_en: "",
      research_url: "",
      pdf_url: "",
      gender: "",
    });

    setShowForm(false);
    fetchResearch();
  }

  async function handleDeleteResearch(id) {
    const confirmDelete = window.confirm(
      lang === "ar" ? "هل تريد حذف هذا البحث؟" : "Delete this research?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("research_projects")
      .delete()
      .eq("id", id);

    if (error) {
      alert(lang === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting research");
      console.log(error);
      return;
    }

    alert(lang === "ar" ? "تم حذف البحث" : "Research deleted");
    fetchResearch();
  }

  const fixedDepartments = [
    "علوم الحاسب",
    "إدارة الأعمال",
    "اللغات والترجمة",
    "الأحياء",
    "العلوم الأساسية",
  ];

  const departments = [
    "all",
    ...new Set([
      ...fixedDepartments,
      ...research.map((r) => r.department).filter(Boolean),
    ]),
  ];

  const filteredResearch =
    selectedDept === "all"
      ? research
      : research.filter((r) => r.department === selectedDept);

  return (
    <section
      style={{
        ...cardStyle,
        direction: lang === "ar" ? "rtl" : "ltr",
        background: "linear-gradient(180deg,#ffffff,#f8fafc)",
      }}
    >
      <button onClick={() => setActiveModule(null)} style={backButton}>
        {lang === "ar" ? "← رجوع للرئيسية" : "← Back Home"}
      </button>

      <h2 style={titleStyle}>
        {lang === "ar" ? "البحث العلمي" : "Scientific Research"}
      </h2>

      <p style={descStyle}>
        {lang === "ar"
          ? "منصة لعرض وإضافة الأبحاث العلمية لأعضاء هيئة التدريس والطلاب."
          : "A portal for viewing and submitting research by faculty members and students."}
      </p>

      {canAdd && (
        <button onClick={() => setShowForm(!showForm)} style={addButton}>
          {showForm
            ? lang === "ar"
              ? "إغلاق نموذج الإضافة"
              : "Close Form"
            : lang === "ar"
            ? "➕ إضافة بحث"
            : "➕ Add Research"}
        </button>
      )}

      {canAdd && showForm && (
        <form id="research-form" onSubmit={handleAddResearch} style={formBox}>
          <input
            name="title_ar"
            value={newResearch.title_ar}
            onChange={handleChange}
            placeholder="عنوان البحث بالعربي *"
            style={inputStyle}
          />

          <input
            name="title_en"
            value={newResearch.title_en}
            onChange={handleChange}
            placeholder="Research Title in English"
            style={inputStyle}
          />

          <input
            name="author"
            value={newResearch.author}
            onChange={handleChange}
            placeholder="اسم الباحث *"
            style={inputStyle}
          />

          <select
            name="gender"
            value={newResearch.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">الجنس</option>
            <option value="female">أنثى 👩</option>
            <option value="male">ذكر 👨</option>
          </select>

          <select
            name="department"
            value={newResearch.department}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">اختاري القسم</option>
            {fixedDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <input
            name="journal"
            value={newResearch.journal}
            onChange={handleChange}
            placeholder="اسم المجلة"
            style={inputStyle}
          />

          <input
            name="year"
            type="number"
            value={newResearch.year}
            onChange={handleChange}
            placeholder="السنة"
            style={inputStyle}
          />

          <textarea
            name="abstract_ar"
            value={newResearch.abstract_ar}
            onChange={handleChange}
            placeholder="ملخص البحث بالعربي"
            style={textareaStyle}
          />

          <textarea
            name="abstract_en"
            value={newResearch.abstract_en}
            onChange={handleChange}
            placeholder="Research Abstract in English"
            style={textareaStyle}
          />

          <input
            name="research_url"
            value={newResearch.research_url}
            onChange={handleChange}
            placeholder="رابط البحث"
            style={inputStyle}
          />

          <input
            name="pdf_url"
            value={newResearch.pdf_url}
            onChange={handleChange}
            placeholder="رابط PDF إن وجد"
            style={inputStyle}
          />

          <button type="submit" disabled={saving} style={saveButton}>
            {saving
              ? lang === "ar"
                ? "جاري الحفظ..."
                : "Saving..."
              : lang === "ar"
              ? newResearch.id
                ? "تحديث البحث"
                : "حفظ البحث"
              : newResearch.id
              ? "Update Research"
              : "Save Research"}
          </button>

          {newResearch.id && (
            <button
              type="button"
              onClick={() => {
                setNewResearch({
                  title_ar: "",
                  title_en: "",
                  author: "",
                  department: "",
                  journal: "",
                  year: "",
                  abstract_ar: "",
                  abstract_en: "",
                  research_url: "",
                  pdf_url: "",
                  gender: "",
                });
                setShowForm(false);
              }}
              style={saveButton}
            >
              {lang === "ar" ? "إلغاء التعديل" : "Cancel Edit"}
            </button>
          )}
        </form>
      )}

      <div style={filterBox}>
        <label style={{ fontWeight: "bold" }}>
          {lang === "ar" ? "فلترة حسب القسم:" : "Filter by Department:"}
        </label>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={selectStyle}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "all"
                ? lang === "ar"
                  ? "كل الأقسام"
                  : "All Departments"
                : dept}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>{lang === "ar" ? "جاري تحميل الأبحاث..." : "Loading research..."}</p>
      ) : filteredResearch.length === 0 ? (
        <p>
          {lang === "ar"
            ? "لا توجد أبحاث معتمدة حالياً."
            : "No approved research found."}
        </p>
      ) : (
        <div style={groupWrapper}>
          {Object.entries(
            filteredResearch.reduce((groups, item) => {
              const dept = item.department || "غير محدد";
              const author = item.author || "باحث غير محدد";

              if (!groups[dept]) groups[dept] = {};
              if (!groups[dept][author]) groups[dept][author] = [];

              groups[dept][author].push(item);
              return groups;
            }, {})
          ).map(([dept, authors]) => (
            <div key={dept} style={departmentBox}>
              <h3 style={departmentTitle}>🏛️ {dept}</h3>

              {Object.entries(authors).map(([author, items]) => {
                const genderIcon =
                  items[0]?.gender === "female"
                    ? "👩"
                    : items[0]?.gender === "male"
                    ? "👨"
                    : "👤";

                return (
                  <details key={author} style={authorBox}>
                    <summary style={authorTitle}>
                      {genderIcon} {author} — {items.length} بحث
                    </summary>

                    <div style={smallResearchGrid}>
                      {items.map((item) => {
                        const finalLink =
                          item.research_url || item.pdf_url || item.link;

                        return (
                          <div key={item.id} style={smallResearchCard}>
                            <h4 style={smallResearchTitle}>
                              {lang === "ar"
                                ? item.title_ar
                                : item.title_en || item.title_ar}
                            </h4>

                            <p style={metaStyle}>
                              {item.journal && `${item.journal} • `}
                              {item.year || ""}
                            </p>

                            <>
                              {finalLink && (
                                <a
                                  href={finalLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={smallLinkButton}
                                >
                                  {lang === "ar"
                                    ? "فتح البحث"
                                    : "Open Research"}
                                </a>
                              )}

                              <button
                                onClick={() => {
                                  setNewResearch(item);
                                  setShowForm(true);
                                  setTimeout(() => {
                                    document
                                      .getElementById("research-form")
                                      ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                  }, 100);
                                }}
                                style={{
                                  marginTop: "8px",
                                  padding: "8px",
                                  borderRadius: "10px",
                                  border: "none",
                                  background: "#d39bcc",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  width: "100%",
                                }}
                              >
                                {lang === "ar" ? "تعديل" : "Edit"}
                              </button>

                              <button
                                onClick={() => handleDeleteResearch(item.id)}
                                style={{
                                  marginTop: "8px",
                                  padding: "8px",
                                  borderRadius: "10px",
                                  border: "none",
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  width: "100%",
                                }}
                              >
                                {lang === "ar" ? "حذف" : "Delete"}
                              </button>
                            </>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {selectedResearch && (
        <div style={popupOverlay}>
          <div style={popupBox}>
            <button
              onClick={() => setSelectedResearch(null)}
              style={closeButton}
            >
              ×
            </button>

            <h2 style={{ color: "#0f766e" }}>
              {lang === "ar"
                ? selectedResearch.title_ar
                : selectedResearch.title_en || selectedResearch.title_ar}
            </h2>

            <p>
              <strong>الباحث:</strong> {selectedResearch.author || "-"}
            </p>
            <p>
              <strong>القسم:</strong> {selectedResearch.department || "-"}
            </p>
            <p>
              <strong>المجلة:</strong> {selectedResearch.journal || "-"}
            </p>
            <p>
              <strong>السنة:</strong> {selectedResearch.year || "-"}
            </p>

            <p style={{ lineHeight: 1.9 }}>
              {lang === "ar"
                ? selectedResearch.abstract_ar || "لا يوجد ملخص."
                : selectedResearch.abstract_en ||
                  selectedResearch.abstract_ar ||
                  "No abstract."}
            </p>

            {(selectedResearch.research_url || selectedResearch.pdf_url) && (
              <a
                href={selectedResearch.research_url || selectedResearch.pdf_url}
                target="_blank"
                rel="noreferrer"
                style={linkButton}
              >
                {lang === "ar" ? "فتح رابط البحث" : "Open Research Link"}
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const titleStyle = {
  fontSize: "30px",
  fontWeight: "900",
  color: "#0f766e",
  marginBottom: "8px",
};

const descStyle = {
  color: "#475569",
  fontSize: "16px",
  marginBottom: "18px",
  lineHeight: 1.8,
};

const backButton = {
  marginBottom: "18px",
  padding: "10px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#0f766e",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const addButton = {
  marginBottom: "20px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#0f766e",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 6px 15px rgba(15,118,110,0.3)",
  transition: "0.2s",
};

const formBox = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "12px",
  padding: "18px",
  borderRadius: "18px",
  background: "#f0fdfa",
  border: "1px solid #99f6e4",
  marginBottom: "22px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "90px",
  gridColumn: "1 / -1",
};

const saveButton = {
  padding: "13px",
  borderRadius: "12px",
  border: "none",
  background: "#0f766e",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const filterBox = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  minWidth: "220px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px",
};

const researchCard = {
  padding: "18px",
  borderRadius: "20px",
  background: "white",
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 22px rgba(15,23,42,0.08)",
};

const badgeStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#ccfbf1",
  color: "#0f766e",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const researchTitle = {
  fontSize: "18px",
  fontWeight: "900",
  color: "#1e293b",
  lineHeight: 1.5,
};

const authorStyle = {
  color: "#0f766e",
  fontWeight: "bold",
};

const metaStyle = {
  color: "#64748b",
  fontSize: "14px",
};

const summaryStyle = {
  color: "#475569",
  lineHeight: 1.7,
  fontSize: "14px",
  maxHeight: "75px",
  overflow: "hidden",
};

const detailsButton = {
  marginTop: "12px",
  width: "100%",
  padding: "11px",
  borderRadius: "12px",
  border: "none",
  background: "#0f766e",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const smallLinkButton = {
  display: "block",
  marginTop: "10px",
  textAlign: "center",
  padding: "10px",
  borderRadius: "12px",
  background: "#e0f2fe",
  color: "#0369a1",
  textDecoration: "none",
  fontWeight: "bold",
};

const popupOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  padding: "20px",
};

const popupBox = {
  position: "relative",
  background: "white",
  borderRadius: "24px",
  padding: "28px",
  maxWidth: "720px",
  width: "100%",
  maxHeight: "85vh",
  overflowY: "auto",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
};

const closeButton = {
  position: "absolute",
  top: "14px",
  insetInlineEnd: "18px",
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  fontSize: "22px",
  cursor: "pointer",
};

const linkButton = {
  display: "inline-block",
  marginTop: "16px",
  padding: "12px 18px",
  borderRadius: "12px",
  background: "#0f766e",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};