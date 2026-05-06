import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminPortal from "./AdminPortal";

export default function Dashboard({
  session,
  profile,
  lang,
  cardStyle,
  setActiveModule,
  stats = {},
}) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);

  const [deanForm, setDeanForm] = useState({
    name: "",
    message_ar: "",
    message_en: "",
    image_url: "",
  });

  const [aboutForm, setAboutForm] = useState({
    intro_ar: "",
    intro_en: "",
    vision_ar: "",
    vision_en: "",
    mission_ar: "",
    mission_en: "",
    goals_intro_ar: "",
    goals_intro_en: "",
    goal1_ar: "",
    goal1_en: "",
    goal2_ar: "",
    goal2_en: "",
    goal3_ar: "",
    goal3_en: "",
  });

  const [structureForm, setStructureForm] = useState({
  image_url_ar: "",
  image_url_en: "",
});

  const emptyForms = {
    programs: {
      name_ar: "",
      name_en: "",
      hours: "",
      status_ar: "نشط",
      status_en: "Active",
      image_url: "",
      description_ar: "",
      description_en: "",
      study_plan_url: "",
      admission_requirements_ar: "",
      admission_requirements_en: "",
      degree_ar: "بكالوريوس",
      degree_en: "Bachelor",
      duration: "4 years",
      duration_ar: "4 سنوات",
    },
    activities: {
      title_ar: "",
      title_en: "",
      activity_date: "",
      activity_place_ar: "",
      activity_place_en: "",
      registration_url: "",
      details_ar: "",
      details_en: "",
      image_url: "",
      link: "",
    },
    research: {
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
      status: "approved",
    },
    community: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      date: "",
      volunteer_hours: "",
      image_url: "",
      registration_url: "",
    },
    academic: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      image_url: "",
      student_name: "",
      university_id: "",
      course_name: "",
      course_code: "",
      section_number: "",
      request_type: "add",
      status: "جديد",
      courses: "",
      reason: "",
    },
    quality: {
      indicator_ar: "",
      indicator_en: "",
      current_value: "",
      target_value: "",
      unit_ar: "",
      unit_en: "",
      status_ar: "",
      status_en: "",
      report_link: "",
      analysis_ar: "",
      analysis_en: "",
      recommendation_ar: "",
      recommendation_en: "",
      color: "",
      icon: "",
    },
    faculty: {
      name_ar: "",
      name_en: "",
      email: "",
      phone: "",
      department_ar: "",
      department_en: "",
      title_ar: "",
      title_en: "",
      status_ar: "نشط",
      status_en: "Active",
    },
  };

  const [contentForm, setContentForm] = useState(emptyForms.programs);

  const dashboardSections = [
    { id: "dean", icon: "👤", title_ar: "كلمة العميد", title_en: "Dean Message", desc_ar: "تعديل اسم العميد والنص والصورة.", desc_en: "Edit dean name, text, and image." },
    { id: "about", icon: "🏫", title_ar: "عن الكلية", title_en: "About College", desc_ar: "تعديل المقدمة والرؤية والرسالة والأهداف.", desc_en: "Edit intro, vision, mission, and goals." },
    { id: "users", icon: "👥", title_ar: "إدارة المستخدمين", title_en: "Users Management", desc_ar: "إضافة وحذف الطلاب وأعضاء هيئة التدريس والأدمن.", desc_en: "Manage users." },
    { id: "programs", icon: "📚", title_ar: "البرامج الأكاديمية", title_en: "Academic Programs", desc_ar: "إضافة وتعديل وحذف البرامج.", desc_en: "Manage academic programs." },
    { id: "activities", icon: "🎯", title_ar: "الأنشطة الطلابية", title_en: "Student Activities", desc_ar: "إضافة وتعديل الأنشطة والفعاليات.", desc_en: "Manage activities." },
    { id: "research", icon: "🔬", title_ar: "البحث العلمي", title_en: "Scientific Research", desc_ar: "إضافة وتعديل الأبحاث.", desc_en: "Manage research projects." },
    { id: "community", icon: "🤝", title_ar: "المسؤولية المجتمعية", title_en: "Community Responsibility", desc_ar: "إدارة المبادرات المجتمعية.", desc_en: "Manage community initiatives." },
    { id: "academic", icon: "🗂️", title_ar: "الشؤون الأكاديمية", title_en: "Academic Affairs", desc_ar: "إدارة طلبات الشؤون الأكاديمية.", desc_en: "Manage academic affairs requests." },
    { id: "quality", icon: "📊", title_ar: "الجودة والتحليلات", title_en: "Quality & Analytics", desc_ar: "إدارة مؤشرات الجودة.", desc_en: "Manage quality indicators." },
    { id: "faculty", icon: "👩‍🏫", title_ar: "أعضاء هيئة التدريس", title_en: "Faculty Members", desc_ar: "إدارة بيانات أعضاء هيئة التدريس.", desc_en: "Manage faculty members." },
    { id: "contact", icon: "☎️", title_ar: "تواصل معنا", title_en: "Contact Us", desc_ar: "لا يوجد جدول مطابق حالياً في Supabase.", desc_en: "No matching table currently in Supabase." },
    { id: "structure", icon: "🏛️", title_ar: "الهيكل التنظيمي", title_en: "Organizational Structure", desc_ar: "لا يوجد جدول مطابق حالياً في Supabase.", desc_en: "No matching table currently in Supabase." },
  ];

  const configs = {
    programs: {
      table: "programs",
      pk: "id",
      order: "id",
      fields: [
        ["name_ar", "اسم البرنامج عربي"],
        ["name_en", "Program name English"],
        ["hours", "عدد الساعات", "number"],
        ["status_ar", "الحالة عربي"],
        ["status_en", "Status English"],
        ["degree_ar", "الدرجة عربي"],
        ["degree_en", "Degree English"],
        ["duration_ar", "المدة عربي"],
        ["duration", "Duration English"],
        ["study_plan_url", "رابط الخطة الدراسية"],
        ["image_url", "رابط الصورة"],
        ["description_ar", "الوصف عربي", "textarea"],
        ["description_en", "Description English", "textarea"],
        ["admission_requirements_ar", "شروط القبول عربي", "textarea"],
        ["admission_requirements_en", "Admission Requirements English", "textarea"],
      ],
    },
    activities: {
      table: "activities",
      pk: "id",
      order: "id",
      fields: [
        ["title_ar", "عنوان النشاط عربي"],
        ["title_en", "Activity title English"],
        ["activity_date", "تاريخ النشاط", "date"],
        ["activity_place_ar", "مكان النشاط عربي"],
        ["activity_place_en", "Activity place English"],
        ["registration_url", "رابط التسجيل"],
        ["link", "رابط إضافي"],
        ["image_url", "رابط الصورة"],
        ["details_ar", "التفاصيل عربي", "textarea"],
        ["details_en", "Details English", "textarea"],
      ],
    },
    research: {
      table: "research_projects",
      pk: "id",
      order: "id",
      fields: [
        ["title_ar", "عنوان البحث عربي"],
        ["title_en", "Research title English"],
        ["author", "اسم الباحث"],
        ["department", "القسم"],
        ["journal", "المجلة / الجهة"],
        ["year", "السنة", "number"],
        ["status", "الحالة"],
        ["research_url", "رابط البحث"],
        ["pdf_url", "رابط PDF"],
        ["gender", "الفئة / النوع"],
        ["abstract_ar", "الملخص عربي", "textarea"],
        ["abstract_en", "Abstract English", "textarea"],
      ],
    },
    community: {
      table: "community_initiatives",
      pk: "id",
      order: "id",
      fields: [
        ["title_ar", "عنوان المبادرة عربي"],
        ["title_en", "Initiative title English"],
        ["date", "التاريخ", "date"],
        ["volunteer_hours", "الساعات التطوعية", "number"],
        ["registration_url", "رابط التسجيل"],
        ["image_url", "رابط الصورة"],
        ["description_ar", "الوصف عربي", "textarea"],
        ["description_en", "Description English", "textarea"],
      ],
    },
    academic: {
      table: "academic_affairs_items",
      pk: "id",
      order: "id",
      fields: [
        ["title_ar", "العنوان عربي"],
        ["title_en", "Title English"],
        ["student_name", "اسم الطالب/الطالبة"],
        ["university_id", "الرقم الجامعي"],
        ["course_name", "اسم المقرر"],
        ["course_code", "رمز المقرر"],
        ["section_number", "رقم الشعبة", "number"],
        ["request_type", "نوع الطلب"],
        ["status", "الحالة"],
        ["courses", "المقررات / ملاحظات", "textarea"],
        ["reason", "السبب / الملاحظة", "textarea"],
        ["description_ar", "الوصف عربي", "textarea"],
        ["description_en", "Description English", "textarea"],
        ["image_url", "رابط الصورة"],
      ],
    },
    quality: {
      table: "quality_reports_dev",
      pk: "id",
      order: "id",
      fields: [
        ["indicator_ar", "اسم المؤشر عربي"],
        ["indicator_en", "Indicator name English"],
        ["current_value", "القيمة الحالية", "number"],
        ["target_value", "القيمة المستهدفة", "number"],
        ["unit_ar", "الوحدة عربي"],
        ["unit_en", "Unit English"],
        ["status_ar", "الحالة عربي"],
        ["status_en", "Status English"],
        ["report_link", "رابط التقرير"],
        ["analysis_ar", "التحليل عربي", "textarea"],
        ["analysis_en", "Analysis English", "textarea"],
        ["recommendation_ar", "التوصية عربي", "textarea"],
        ["recommendation_en", "Recommendation English", "textarea"],
        ["color", "اللون"],
        ["icon", "الأيقونة"],
      ],
    },
    faculty: {
      table: "instructors",
      pk: "instructor_id",
      order: "instructor_id",
      fields: [
        ["name_ar", "اسم العضو عربي"],
        ["name_en", "Faculty name English"],
        ["title_ar", "المسمى عربي"],
        ["title_en", "Title English"],
        ["department_ar", "القسم عربي"],
        ["department_en", "Department English"],
        ["email", "البريد الإلكتروني"],
        ["phone", "رقم الجوال"],
        ["status_ar", "الحالة عربي"],
        ["status_en", "Status English"],
      ],
    },
  };

  useEffect(() => {
  if (session && profile?.role === "admin") fetchDean();
}, [session, profile]);

useEffect(() => {
  if (!session || profile?.role !== "admin" || !selectedSection) return;

  if (selectedSection === "dean") fetchDean();

  if (selectedSection === "about") fetchAbout();

  if (selectedSection === "structure") fetchStructure();

  if (configs[selectedSection]) {
    setEditingId(null);
    setContentForm(emptyForms[selectedSection]);
    fetchItems(selectedSection);
  }
}, [selectedSection, session, profile]);

async function fetchDean() {
  const { data, error } = await supabase
    .from("dean_message")
    .select("id,name,message_ar,message_en,image_url")
    .eq("id", 1)
    .limit(1);

  if (error) {
    alert("خطأ في جلب كلمة العميد: " + error.message);
    return;
  }

  if (data && data.length > 0) {
    setDeanForm(data[0]);
  }
}

  async function fetchAbout() {
  const { data, error } = await supabase
    .from("about_college")
    .select("*")
    .eq("id", 1)
    .limit(1);

  if (error) {
    alert("خطأ في جلب بيانات عن الكلية: " + error.message);
    return;
  }

  if (data && data.length > 0) {
    setAboutForm(data[0]);
  }
}

  async function fetchItems(sectionId) {
    const config = configs[sectionId];
    if (!config) return;

    setLoading(true);

    const { data, error } = await supabase
      .from(config.table)
      .select("*")
      .order(config.order || config.pk || "id", { ascending: false });

    setLoading(false);

    if (error) {
      console.log(error);
      setItems([]);
      alert("خطأ في جلب البيانات: " + error.message);
      return;
    }

    setItems(data || []);
  }

  function changeContentField(name, value) {
    setContentForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetContentForm() {
    setEditingId(null);
    setContentForm(emptyForms[selectedSection]);
  }

  function cleanPayload(formObject, config) {
    const payload = {};
    const allowedFields = config.fields.map(([name]) => name);

    allowedFields.forEach((key) => {
      payload[key] = formObject[key] ?? null;
      if (payload[key] === "") payload[key] = null;
    });

    const numericFields = [
      "hours",
      "year",
      "volunteer_hours",
      "section_number",
      "current_value",
      "target_value",
    ];

    numericFields.forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== "") {
        payload[key] = Number(payload[key]);
      }
    });

    return payload;
  }

  async function saveContent(e) {
    e.preventDefault();

    const config = configs[selectedSection];
    if (!config) return;

    const payload = cleanPayload(contentForm, config);
    const allowedFields = config.fields.map(([name]) => name);
    const firstField = allowedFields[0];

    if (!payload[firstField]) {
      alert(lang === "ar" ? "عبّي أول حقل على الأقل قبل الحفظ" : "Please fill the first field before saving");
      return;
    }

    const pk = config.pk || "id";

    let result;
    if (editingId) {
      result = await supabase.from(config.table).update(payload).eq(pk, editingId);
    } else {
      if (selectedSection === "faculty") {
        payload.instructor_id = "I" + Date.now();
      }

      result = await supabase.from(config.table).insert([payload]);
    }

    if (result.error) {
      alert("خطأ: " + result.error.message);
      console.log(result.error);
      return;
    }

    alert(lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
    resetContentForm();
    fetchItems(selectedSection);
  }

  async function deleteContent(id) {
    const ok = window.confirm(lang === "ar" ? "هل تريدين الحذف؟" : "Delete this item?");
    if (!ok) return;

    const config = configs[selectedSection];
    const pk = config.pk || "id";

    const { error } = await supabase.from(config.table).delete().eq(pk, id);

    if (error) {
      alert("خطأ: " + error.message);
      return;
    }

    alert(lang === "ar" ? "تم الحذف" : "Deleted");
    fetchItems(selectedSection);
  }
async function saveDean() {
  const { data, error } = await supabase
    .from("dean_message")
    .update({
      name: deanForm.name,
      message_ar: deanForm.message_ar,
      message_en: deanForm.message_en,
      image_url: deanForm.image_url,
    })
    .eq("id", 1)
    .select();

  if (error) {
    alert("خطأ: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("ما تم تعديل أي صف (تأكدي من RLS أو id)");
    return;
  }

  setDeanForm(data[0]);

  alert("تم تحديث كلمة العميد");
}
 async function saveAbout() {
  const payload = {
    intro_ar: aboutForm.intro_ar,
    intro_en: aboutForm.intro_en,
    vision_ar: aboutForm.vision_ar,
    vision_en: aboutForm.vision_en,
    mission_ar: aboutForm.mission_ar,
    mission_en: aboutForm.mission_en,
    goals_intro_ar: aboutForm.goals_intro_ar,
    goals_intro_en: aboutForm.goals_intro_en,
    goal1_ar: aboutForm.goal1_ar,
    goal1_en: aboutForm.goal1_en,
    goal2_ar: aboutForm.goal2_ar,
    goal2_en: aboutForm.goal2_en,
    goal3_ar: aboutForm.goal3_ar,
    goal3_en: aboutForm.goal3_en,
  };

  const { data, error } = await supabase
    .from("about_college")
    .update(payload)
    .eq("id", 1)
    .select();

  if (error) return alert("خطأ: " + error.message);

  if (data && data.length > 0) {
    setAboutForm(data[0]);
  }

  alert(lang === "ar" ? "تم تحديث بيانات عن الكلية" : "About college updated");
}

async function fetchStructure() {
  const { data, error } = await supabase
    .from("organizational_structure")
    .select("id,image_url_ar,image_url_en")
    .eq("id", 1)
    .limit(1);

  if (error) {
    alert("خطأ في جلب الهيكل التنظيمي: " + error.message);
    return;
  }

  if (data && data.length > 0) {
    setStructureForm(data[0]);
  }
}

async function saveStructure() {
  const { data, error } = await supabase
    .from("organizational_structure")
    .update({
      image_url_ar: structureForm.image_url_ar,
      image_url_en: structureForm.image_url_en,
    })
    .eq("id", 1)
    .select();

  if (error) {
    alert("خطأ: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("ما تم تعديل أي صف. تأكدي من id = 1 أو RLS");
    return;
  }

  setStructureForm(data[0]);
  alert(lang === "ar" ? "تم تحديث الهيكل التنظيمي" : "Structure updated");
}

  if (!session || profile?.role !== "admin") return null;

  const currentSection = dashboardSections.find((item) => item.id === selectedSection);
  const currentConfig = configs[selectedSection];

  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div style={topBarStyle}>
        <div>
          <h2 style={{ margin: 0 }}>{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</h2>
          <p style={{ color: "#64748b", marginTop: "6px" }}>
            {lang === "ar" ? "اختاري القسم ثم أضيفي أو عدّلي البيانات." : "Choose a section to add or edit data."}
          </p>
        </div>

        {setActiveModule && (
          <button type="button" onClick={() => setActiveModule("programs")} style={{ ...smallButtonStyle, background: "#1e293b" }}>
            {lang === "ar" ? "العودة للموقع" : "Back to Website"}
          </button>
        )}
      </div>

      <div style={gridStyle}>
        {dashboardSections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedSection(item.id)}
            style={{
              ...dashboardCardButtonStyle,
              border: selectedSection === item.id ? "2px solid #0f766e" : "1px solid #e5e7eb",
              background: selectedSection === item.id ? "#ecfdf5" : "#ffffff",
            }}
          >
            <span style={{ fontSize: "28px" }}>{item.icon}</span>
            <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
              {lang === "ar" ? item.title_ar : item.title_en}
            </strong>
            <span style={cardDescStyle}>{lang === "ar" ? item.desc_ar : item.desc_en}</span>
          </button>
        ))}
      </div>

      {!selectedSection && (
        <div style={emptyStateStyle}>
          {lang === "ar" ? "لم يتم اختيار أي قسم بعد." : "No section selected yet."}
        </div>
      )}

      {selectedSection && (
        <div style={{ marginBottom: "14px" }}>
          <button type="button" onClick={() => setSelectedSection(null)} style={{ ...smallButtonStyle, background: "#334155" }}>
            {lang === "ar" ? "رجوع للأزرار" : "Back"}
          </button>
        </div>
      )}

      {selectedSection === "users" && (
        <AdminPortal
          session={session}
          profile={profile}
          lang={lang}
          cardStyle={{ ...cardStyle, boxShadow: "none", border: "none" }}
          stats={stats}
          setActiveModule={() => {}}
        />
      )}

      {selectedSection === "dean" && (
        <div style={formBoxStyle}>
          <h3>{lang === "ar" ? "تعديل كلمة العميد" : "Edit Dean Message"}</h3>
          <Input label="اسم العميد" value={deanForm.name} onChange={(v) => setDeanForm({ ...deanForm, name: v })} />
          <Input label="النص العربي" textarea value={deanForm.message_ar} onChange={(v) => setDeanForm({ ...deanForm, message_ar: v })} />
          <Input label="English message" textarea value={deanForm.message_en} onChange={(v) => setDeanForm({ ...deanForm, message_en: v })} />
          <Input label="رابط الصورة" value={deanForm.image_url} onChange={(v) => setDeanForm({ ...deanForm, image_url: v })} />
          <button onClick={saveDean} style={{ ...buttonStyle, background: "#0f766e" }}>{lang === "ar" ? "حفظ" : "Save"}</button>
        </div>
      )}

      {selectedSection === "about" && (
        <div style={formBoxStyle}>
          <h3>{lang === "ar" ? "تعديل عن الكلية" : "Edit About College"}</h3>
          {[
            ["intro_ar", "المقدمة عربي", true],
            ["intro_en", "English intro", true],
            ["vision_ar", "الرؤية عربي", true],
            ["vision_en", "English vision", true],
            ["mission_ar", "الرسالة عربي", true],
            ["mission_en", "English mission", true],
            ["goals_intro_ar", "مقدمة الأهداف عربي", true],
            ["goals_intro_en", "Goals intro English", true],
            ["goal1_ar", "الهدف الأول عربي"],
            ["goal1_en", "Goal 1 English"],
            ["goal2_ar", "الهدف الثاني عربي"],
            ["goal2_en", "Goal 2 English"],
            ["goal3_ar", "الهدف الثالث عربي"],
            ["goal3_en", "Goal 3 English"],
          ].map(([name, label, textarea]) => (
            <Input
              key={name}
              label={label}
              textarea={textarea}
              value={aboutForm[name] || ""}
              onChange={(v) => setAboutForm({ ...aboutForm, [name]: v })}
            />
          ))}
          <button onClick={saveAbout} style={{ ...buttonStyle, background: "#0f766e" }}>{lang === "ar" ? "حفظ" : "Save"}</button>
        </div>
      )}

      {selectedSection === "structure" && (
        <div style={formBoxStyle}>
          <h3>
            {lang === "ar"
              ? "تعديل الهيكل التنظيمي"
              : "Edit Organizational Structure"}
          </h3>

          <Input
  label="رابط صورة الهيكل عربي"
  value={structureForm.image_url_ar}
  onChange={(v) =>
    setStructureForm({ ...structureForm, image_url_ar: v })
  }
/>

<Input
  label="رابط صورة الهيكل إنجليزي"
  value={structureForm.image_url_en}
  onChange={(v) =>
    setStructureForm({ ...structureForm, image_url_en: v })
  }
/>

          <button
            onClick={saveStructure}
            style={{ ...buttonStyle, background: "#0f766e" }}
          >
            {lang === "ar" ? "حفظ" : "Save"}
          </button>
        </div>
      )}

      {selectedSection && currentSection && !currentConfig && (
  <div style={emptyStateStyle}>
    {lang === "ar"
      ? "يمكن إدارة هذا القسم من خلال الإعدادات المتقدمة."
      : "This section can be managed through advanced settings."}
  </div>
)}

      {currentConfig && currentSection && (
        <div style={formBoxStyle}>
          <h3 style={{ marginTop: 0 }}>
            {currentSection.icon} {lang === "ar" ? currentSection.title_ar : currentSection.title_en}
          </h3>

          <form onSubmit={saveContent}>
            <div style={formGridStyle}>
              {currentConfig.fields.map(([name, label, type]) => (
                <Input
                  key={name}
                  label={label}
                  type={type || "text"}
                  textarea={type === "textarea"}
                  value={contentForm[name] ?? ""}
                  onChange={(v) => changeContentField(name, v)}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" style={{ ...buttonStyle, width: "auto", minWidth: "160px", background: "#0f766e" }}>
                {editingId ? (lang === "ar" ? "حفظ التعديل" : "Save Edit") : (lang === "ar" ? "إضافة" : "Add")}
              </button>

              {editingId && (
                <button type="button" onClick={resetContentForm} style={{ ...buttonStyle, width: "auto", minWidth: "140px", background: "#64748b" }}>
                  {lang === "ar" ? "إلغاء التعديل" : "Cancel Edit"}
                </button>
              )}
            </div>
          </form>

          <hr style={{ margin: "22px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />

          <h4>{lang === "ar" ? "البيانات الحالية" : "Current Data"}</h4>

          {loading ? (
            <p>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
          ) : items.length === 0 ? (
            <div style={emptyStateStyle}>{lang === "ar" ? "لا توجد بيانات حالياً." : "No data yet."}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>{lang === "ar" ? "العنوان / الاسم" : "Title / Name"}</th>
                    <th style={thStyle}>{lang === "ar" ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const pk = currentConfig.pk || "id";
                    const rowId = item[pk];

                    return (
                      <tr key={rowId || index}>
                        <td style={tdStyle}>{rowId || index + 1}</td>
                        <td style={tdStyle}>{getItemTitle(item)}</td>
                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(rowId);
                              setContentForm({ ...emptyForms[selectedSection], ...item });
                            }}
                            style={{ ...miniButtonStyle, background: "#dbeafe", color: "#1e40af" }}
                          >
                            {lang === "ar" ? "تعديل" : "Edit"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteContent(rowId)}
                            style={{ ...miniButtonStyle, background: "#fee2e2", color: "#991b1b" }}
                          >
                            {lang === "ar" ? "حذف" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Input({ label, value, onChange, textarea = false, type = "text" }) {
  return (
    <label style={{ display: "block", marginBottom: "12px" }}>
      <span style={{ display: "block", fontWeight: "bold", marginBottom: "6px", color: "#334155" }}>{label}</span>
      {textarea ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, minHeight: "110px" }} />
      ) : (
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </label>
  );
}

function getItemTitle(item) {
  return (
    item.title_ar ||
    item.name_ar ||
    item.indicator_ar ||
    item.student_name ||
    item.author ||
    item.email ||
    item.phone ||
    item.title_en ||
    item.name_en ||
    item.indicator_en ||
    "—"
  );
}

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "12px",
  marginBottom: "22px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  fontFamily: "Tajawal, sans-serif",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "Tajawal, sans-serif",
};

const smallButtonStyle = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "Tajawal, sans-serif",
};

const miniButtonStyle = {
  padding: "7px 10px",
  borderRadius: "8px",
  border: "none",
  margin: "3px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: "Tajawal, sans-serif",
};

const dashboardCardButtonStyle = {
  padding: "16px",
  borderRadius: "16px",
  cursor: "pointer",
  fontFamily: "Tajawal, sans-serif",
  textAlign: "center",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};

const cardDescStyle = {
  display: "block",
  marginTop: "6px",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.6,
};

const emptyStateStyle = {
  background: "#f8fafc",
  border: "1px dashed #94a3b8",
  color: "#475569",
  borderRadius: "14px",
  padding: "18px",
  textAlign: "center",
  lineHeight: 1.8,
};

const formBoxStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "18px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  marginTop: "14px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const thStyle = {
  textAlign: "start",
  padding: "10px",
  background: "#f1f5f9",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #e2e8f0",
};
