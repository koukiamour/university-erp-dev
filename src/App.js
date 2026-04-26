import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";
import StudentPortal from "./pages/StudentPortal";
import InstructorPortal from "./pages/InstructorPortal";
import AdminPortal from "./pages/AdminPortal";




export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [lang, setLang] = useState("ar");

  const [stats, setStats] = useState({
    students: 0,
    programs: 0,
    research: 0,
    volunteer: 0,
  });

  const [programs, setPrograms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [researchProjects, setResearchProjects] = useState([]);
  const [communityItems, setCommunityItems] = useState([]);
  const [academicItems, setAcademicItems] = useState([]);
  const [qualityReports, setQualityReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programFiles, setProgramFiles] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [instructorCourses, setInstructorCourses] = useState([]);

  const [newActivity, setNewActivity] = useState({
    title_ar: "",
    title_en: "",
    activity_date: "",
    activity_place_ar: "",
    activity_place_en: "",
    registration_url: "",
    details_ar: "",
    details_en: "",
    image_url: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("student");
  const [authLoading, setAuthLoading] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
      const programDetailsFallback = {
  1: {
    description_ar: "برنامج اللغات والترجمة يركز على تنمية مهارات الترجمة والتواصل بين اللغات.",
    description_en: "Languages and Translation program focuses on translation and communication skills.",
    study_plan_url: "https://www.orimi.com/pdf-test.pdf",
    degree_ar: "بكالوريوس",
    degree_en: "Bachelor",
    duration: "4 سنوات",
  },
  2: {
    description_ar: "برنامج إدارة الأعمال يهدف إلى إعداد كوادر في الإدارة والتخطيط.",
    description_en: "Business Administration program focuses on management and planning.",
    study_plan_url: "https://www.orimi.com/pdf-test.pdf",
    degree_ar: "بكالوريوس",
    degree_en: "Bachelor",
    duration: "4 سنوات",
  },
  3: {
    description_ar: "برنامج الأحياء يدرس الكائنات الحية والبيئة.",
    description_en: "Biology program studies living organisms and environment.",
    study_plan_url: "https://www.orimi.com/pdf-test.pdf",
    degree_ar: "بكالوريوس",
    degree_en: "Bachelor",
    duration: "4 سنوات",
  },
  4: {
    description_ar: "برنامج علوم الحاسب يركز على البرمجة والتقنيات الحديثة.",
    description_en: "Computer Science program focuses on programming and modern tech.",
    study_plan_url: "https://www.orimi.com/pdf-test.pdf",
    degree_ar: "بكالوريوس",
    degree_en: "Bachelor",
    duration: "4 سنوات",
  },
};

const [newProgramFile, setNewProgramFile] = useState({
  course_id: "",
  title_ar: "",
  title_en: "",
  file_type_ar: "",
  file_type_en: "",
  description_ar: "",
  description_en: "",
  file_url: "",
});
const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAllData();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.email) {
        loadUserProfileByEmail(data.session.user.email);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.email) {
          loadUserProfileByEmail(session.user.email);
        } else {
          setProfile(null);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function fetchAllData() {
   setLoading(true);
await Promise.all([
  fetchPrograms(),
  fetchActivities(),
  fetchResearch(),
  fetchCommunity(),
  fetchAcademic(),
  fetchQuality(),

  fetchStats(),
  fetchProgramFiles(),
  fetchStudyPlans(), // 🔥 هذا مهم لعرض الخطة الدراسية
  fetchSchedules(), // 🔥 هذا مهم لعرض الجدول الدراسي

]);
setLoading(false);
  }

  async function fetchPrograms() {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setPrograms(data ?? []);
  }
  async function fetchStudyPlans() {
  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .order("id", { ascending: false });

  if (!error) setStudyPlans(data ?? []);
}
async function fetchSchedules() {
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .order("id", { ascending: false });

  if (!error) setSchedules(data ?? []);
}
async function fetchStudentCourses(studentId) {
  const { data, error } = await supabase
    .from("student_courses")
    .select("*")
    .eq("student_id", studentId)
    .order("id", { ascending: true });

  if (!error) {
    setStudentCourses(data ?? []);
  }
}
async function fetchInstructorCourses(instructorId) {
  const { data, error } = await supabase
    .from("instructor_courses")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("id", { ascending: true });

  if (!error) setInstructorCourses(data ?? []);
}
  async function fetchActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setActivities(data ?? []);
  }

  async function fetchResearch() {
    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setResearchProjects(data ?? []);
  }

  async function fetchCommunity() {
    const { data, error } = await supabase
      .from("community_initiatives")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setCommunityItems(data ?? []);
  }

  async function fetchAcademic() {
    const { data, error } = await supabase
      .from("academic_affairs_items")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setAcademicItems(data ?? []);
  }

  async function fetchQuality() {
    const { data, error } = await supabase
      .from("quality_reports")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setQualityReports(data ?? []);
  }
 async function fetchProgramFiles() {
  const { data, error } = await supabase
    .from("program_files")
    .select("*")
    .order("id", { ascending: false });

  console.log("PROGRAM FILES DATA:", data);
  console.log("PROGRAM FILES ERROR:", error);

  if (!error) setProgramFiles(data ?? []);
}

  async function fetchStats() {
  const { data, error } = await supabase
    .from("dashboard_totals")
    .select("*")
    .single();

  if (error) {
    console.log("DASHBOARD TOTALS ERROR:", error);
    return;
  }

  setStats({
    students: data.students || 0,
    programs: data.programs || 0,
    research: data.research || 0,
    volunteer: data.volunteer || 0,
  });
}

  async function loadUserProfileByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (student) {
      setProfile({ ...student, role: "student" });
        await fetchStudentCourses(student.student_id);

      return;
    }

    const { data: instructor } = await supabase
      .from("instructors")
      .select("*")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (instructor) {
  setProfile({ ...instructor, role: "instructor" });
  await fetchInstructorCourses(instructor.instructor_id);
  return;
}

    const { data: admin } = await supabase
  .from("admins")
  .select("*")
  .ilike("email", cleanEmail)
  .maybeSingle();

if (admin) {
  const modules =
    Array.isArray(admin.module)
      ? admin.module
      : admin.module
      ? [admin.module]
      : [];

  setProfile({ ...admin, module: modules, role: "admin" });
  return;
}

    setProfile(null);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setAuthLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: authEmail.trim().toLowerCase(),
      password: authPassword,
    });

    if (error) {
      alert("خطأ في إنشاء الحساب: " + error.message);
      setAuthLoading(false);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      alert("تم إنشاء الحساب، لكن لم يتم العثور على user id");
      setAuthLoading(false);
      return;
    }

    const commonData = {
      auth_id: userId,
      name_ar: authName,
      name_en: authName,
      email: authEmail.trim().toLowerCase(),
      phone: "",
      status_ar: "نشط",
      status_en: "Active",
    };

    let insertError = null;

    if (authRole === "student") {
      const { error } = await supabase.from("students").insert([
        { ...commonData, major: "", level: 1 },
      ]);
      insertError = error;
    }

    if (authRole === "instructor") {
      const { error } = await supabase.from("instructors").insert([
        {
          ...commonData,
          department_ar: "",
          department_en: "",
          title_ar: "عضو هيئة تدريس",
          title_en: "Instructor",
        },
      ]);
      insertError = error;
    }

    if (authRole === "admin") {
      const { error } = await supabase.from("admins").insert([
        {
          ...commonData,
          job_title_ar: "مسؤول النظام",
          job_title_en: "System Admin",
        },
      ]);
      insertError = error;
    }

    if (insertError) {
      alert("تم إنشاء الحساب لكن حدث خطأ في الجدول: " + insertError.message);
      setAuthLoading(false);
      return;
    }

    alert("تم إنشاء الحساب بنجاح");
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthRole("student");
    setAuthMode("login");
    setAuthLoading(false);
    await fetchStats();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim().toLowerCase(),
      password: authPassword,
    });

    if (error) {
      alert("خطأ في تسجيل الدخول: " + error.message);
      setAuthLoading(false);
      return;
    }

    if (data.user?.email) {
      await loadUserProfileByEmail(data.user.email);
    }

    setAuthLoading(false);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setAuthLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
      redirectTo: window.location.origin,
    });

    if (error) {
      alert("خطأ في استعادة كلمة المرور: " + error.message);
    } else {
      alert("تم إرسال رابط استعادة كلمة المرور إلى البريد");
    }

    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  async function handleAddActivity(e) {
    e.preventDefault();

    const { error } = await supabase.from("activities").insert([
      {
        title_ar: newActivity.title_ar.trim(),
        title_en: newActivity.title_en.trim(),
        activity_date: newActivity.activity_date || null,
        activity_place_ar: newActivity.activity_place_ar.trim(),
        activity_place_en: newActivity.activity_place_en.trim(),
        registration_url: newActivity.registration_url.trim(),
        details_ar: newActivity.details_ar.trim(),
        details_en: newActivity.details_en.trim(),
        image_url: newActivity.image_url.trim(),
      },
    ]);

    if (error) {
      alert("خطأ في إضافة النشاط: " + error.message);
      return;
    }

    setNewActivity({
      title_ar: "",
      title_en: "",
      activity_date: "",
      activity_place_ar: "",
      activity_place_en: "",
      registration_url: "",
      details_ar: "",
      details_en: "",
      image_url: "",
    });

    await fetchActivities();
    alert("تمت إضافة النشاط بنجاح");
  }
async function handleAddCourse(e) {
  e.preventDefault();

  const { error } = await supabase.from("program_files").insert([
    {
  program_id: Number(newProgramFile.program_id),

  course_id: newProgramFile.course_id
    ? Number(newProgramFile.course_id)
    : null,
      title_ar: newProgramFile.title_ar.trim(),
      title_en: newProgramFile.title_en.trim(),
      file_type_ar: newProgramFile.file_type_ar.trim(),
      file_type_en: newProgramFile.file_type_en.trim(),
      description_ar: newProgramFile.description_ar.trim(),
      description_en: newProgramFile.description_en.trim(),
      file_url: newProgramFile.file_url.trim(),
    },
  ]);

  if (error) {
    alert("خطأ في إضافة الملف الأكاديمي: " + error.message);
    return;
  }

  setNewProgramFile({
    course_id: "",
    title_ar: "",
    title_en: "",
    file_type_ar: "",
    file_type_en: "",
    description_ar: "",
    description_en: "",
    file_url: "",
  });

  alert("تمت إضافة الملف الأكاديمي بنجاح");
}

  const t = {
    ar: {
      toggle: "English",
      title: "نظام ERP الجامعي المصغر",
      hero: "منصة ERP جامعية مصغرة لإدارة البرامج الأكاديمية والأنشطة الطلابية والبحث العلمي والمسؤولية المجتمعية والشؤون الأكاديمية والجودة والتحليلات.",
      studentsRegistered: "الطالبات المسجلات",
      increaseThisTerm: "من قاعدة البيانات",
      academicPrograms: "البرامج الأكاديمية",
      bachelorDiploma: "بكالوريوس ودبلوم",
      activeResearch: "الأبحاث النشطة",
      withinCollege: "ضمن الكلية",
      volunteerHours: "الساعات التطوعية",
      duringYear: "من المبادرات",
      mainModules: "الوحدات الرئيسية",
      mainModulesDesc: "الوحدات الست داخل النظام الجامعي المصغر.",
      programs: "البرامج الأكاديمية",
      activities: "الأنشطة الطلابية",
      research: "البحث العلمي",
      community: "المسؤولية المجتمعية",
      academic: "الشؤون الأكاديمية",
      quality: "الجودة والتحليلات",
      login: "تسجيل الدخول",
      loginDemo: "دخول فعلي باستخدام Supabase Auth",
      username: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginBtn: "دخول",
      student: "طالب/طالبة",
      instructor: "عضو هيئة تدريس",
      admin: "مسؤول النظام",
      loading: "جارٍ التحميل...",
      empty: "لا توجد بيانات.",
      signup: "حساب جديد",
      forgot: "نسيت كلمة المرور؟",
      sendReset: "إرسال رابط الاستعادة",
      fullName: "الاسم الكامل",
      welcome: "مرحبًا",
      role: "الدور",
      logout: "تسجيل الخروج",
      addActivity: "إضافة نشاط",
      closeForm: "إغلاق النموذج",
      saveActivity: "حفظ النشاط",
      register: "تسجيل",
      close: "إغلاق",
      details: "تفاصيل",
      date: "التاريخ",
      place: "المكان",
      status: "الحالة",
      hours: "عدد الساعات",
    },
    en: {
      toggle: "العربية",
      title: "University ERP Mini System",
      hero: "A mini university ERP platform for managing academic programs, student activities, scientific research, community responsibility, academic affairs, and quality analytics.",
      studentsRegistered: "Registered Students",
      increaseThisTerm: "From database",
      academicPrograms: "Academic Programs",
      bachelorDiploma: "Bachelor's and Diploma",
      activeResearch: "Active Research",
      withinCollege: "Within the college",
      volunteerHours: "Volunteer Hours",
      duringYear: "From initiatives",
      mainModules: "Main Modules",
      mainModulesDesc: "The six modules inside the mini university system.",
      programs: "Academic Programs",
      activities: "Student Activities",
      research: "Research",
      community: "Community Responsibility",
      academic: "Academic Affairs",
      quality: "Quality & Analytics",
      login: "Login",
      loginDemo: "Real login using Supabase Auth",
      username: "Email",
      password: "Password",
      loginBtn: "Login",
      student: "Student",
      instructor: "Instructor",
      admin: "Admin",
      loading: "Loading...",
      empty: "No data found.",
      signup: "Create Account",
      forgot: "Forgot password?",
      sendReset: "Send reset link",
      fullName: "Full name",
      welcome: "Welcome",
      role: "Role",
      logout: "Logout",
      addActivity: "Add Activity",
      closeForm: "Close Form",
      saveActivity: "Save Activity",
      register: "Register",
      close: "Close",
      details: "Details",
      date: "Date",
      place: "Place",
      status: "Status",
      hours: "Hours",
    },
  };

  const text = t[lang];

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.09)",
    border: "1px solid #e5e7eb",
  };

  const sectionTitle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#0f172a",
  };

  const subTitle = {
    color: "#64748b",
    marginBottom: "20px",
    fontSize: "14px",
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

  const modules = [
    { id: "programs", title: text.programs },
    { id: "activities", title: text.activities },
    { id: "research", title: text.research },
    { id: "community", title: text.community },
    { id: "academic", title: text.academic },
    { id: "quality", title: text.quality },
  ];

  const roleLabel =
    profile?.role === "student"
      ? text.student
      : profile?.role === "instructor"
      ? text.instructor
      : profile?.role === "admin"
      ? text.admin
      : "غير محدد";

  function getTitle(item) {
    return lang === "ar" ? item.title_ar || item.name_ar : item.title_en || item.name_en;
  }

  function getDescription(item) {
    return lang === "ar" ? item.description_ar || item.details_ar : item.description_en || item.details_en;
  }
function getStudentProgram() {
  if (!profile || profile.role !== "student") return null;

  if (profile.program_id) {
    return programs.find((p) => Number(p.id) === Number(profile.program_id));
  }

  return programs.find(
    (p) =>
      p.name_ar === profile.major ||
      p.name_en === profile.major
  );
}

function getStudentScheduleUrl() {
  const studentProgram = getStudentProgram();

  if (!studentProgram) return null;

  const schedule = schedules.find(
    (s) => Number(s.program_id) === Number(studentProgram.id)
  );

  return schedule?.file_url || null;
}
  function DataCards({ items, type }) {
    if (!items.length) {
      return <p style={{ color: "#b45309" }}>{text.empty}</p>;
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item) => (
          <div
  key={item.id}
  onClick={() => type === "programs" && setSelectedProgram(item)}
  style={{
  ...cardStyle,
  cursor: type === "programs" ? "pointer" : "default",
  transition: "0.3s",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
}}
>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={getTitle(item)}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              />
            )}

            <h3 style={{ marginTop: 0 }}>{getTitle(item)}</h3>

            <p style={{ 
  color: "#64748b", 
  lineHeight: 1.7,
  minHeight: "60px" // 🔥 يخلي الكروت متساوية
}}>
              {getDescription(item)?.length > 80
  ? getDescription(item).slice(0, 80) + "..."
  : getDescription(item)}
            </p>

            {type === "programs" && (
  <>
    <p>{text.hours}: {item.hours}</p>

    <span style={{
  background: "#dcfce7",
  color: "#166534",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold"
}}>
  {lang === "ar" ? item.status_ar : item.status_en}
</span>
   

    
<button
  onClick={(e) => {
    e.stopPropagation();

    const plan = studyPlans.find(
  (plan) => Number(plan.program_id) === Number(item.id)
);

const url = plan?.file_url;

    if (url) {
      window.open(url, "_blank");
    } else {
      alert(lang === "ar" ? "لا توجد خطة دراسية" : "No study plan found");
    }
  }}
  style={{
    marginTop: "12px",
    background: "#0f766e",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "Tajawal, sans-serif",
    display: "block",
width: "100%",
marginTop: "10px",
transition: "0.3s",
  }}
>
  {lang === "ar" ? "عرض الخطة الدراسية" : "View Study Plan"}
</button>
  </>
)}

            {type === "research" && (
              <p style={{ color: "#0f766e", fontWeight: "bold" }}>
                {text.status}: {lang === "ar" ? item.status_ar : item.status_en}
              </p>
            )}

            {type === "community" && (
              <p style={{ color: "#0f766e", fontWeight: "bold" }}>
                {text.volunteerHours}: {item.volunteer_hours}
              </p>
            )}

            {type === "quality" && (
              <p style={{ color: "#0f766e", fontWeight: "bold" }}>
                {item.indicator_value}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: "Tajawal, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a",
      }}
    >
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        style={{
          position: "fixed",
          top: "20px",
          left: lang === "ar" ? "20px" : "auto",
          right: lang === "en" ? "20px" : "auto",
          zIndex: 1000,
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          background: "#0f766e",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          fontFamily: "Tajawal, sans-serif",
        }}
      >
        {text.toggle}
      </button>

      <div
        style={{
          background: "linear-gradient(135deg, #0f766e, #14b8a6)",
          color: "white",
          padding: "32px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "42px" }}>{text.title}</h1>
        <p style={{ marginTop: "12px", fontSize: "17px", lineHeight: 1.8 }}>
          {text.hero}
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <h3>{text.studentsRegistered}</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.students}</p>
            <p style={{ color: "#64748b" }}>{text.increaseThisTerm}</p>
          </div>

          <div style={cardStyle}>
            <h3>{text.academicPrograms}</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.programs}</p>
            <p style={{ color: "#64748b" }}>{text.bachelorDiploma}</p>
          </div>

          <div style={cardStyle}>
            <h3>{text.activeResearch}</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.research}</p>
            <p style={{ color: "#64748b" }}>{text.withinCollege}</p>
          </div>

          <div style={cardStyle}>
            <h3>{text.volunteerHours}</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.volunteer}</p>
            <p style={{ color: "#64748b" }}>{text.duringYear}</p>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <div style={sectionTitle}>{text.mainModules}</div>
          <div style={subTitle}>{text.mainModulesDesc}</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {modules.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                style={{
                  border:
                    activeModule === item.id
                      ? "2px solid #0f766e"
                      : "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                  background: activeModule === item.id ? "#ecfdf5" : "#f8fafc",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "Tajawal, sans-serif",
                  color: "#0f172a",
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {loading && <p>{text.loading}</p>}
        <StudentPortal
  session={session}
  profile={profile}
  lang={lang}
  cardStyle={cardStyle}
  studentCourses={studentCourses}
/>

<InstructorPortal
  session={session}
  profile={profile}
  lang={lang}
  cardStyle={cardStyle}
  instructorCourses={instructorCourses}
/>

<AdminPortal
  session={session}
  profile={profile}
  lang={lang}
  cardStyle={cardStyle}
  stats={stats}
  setActiveModule={setActiveModule}
/>



        {activeModule === "programs" && (
  <section style={{ ...cardStyle, marginBottom: "24px" }}>
    <div style={sectionTitle}>{text.programs}</div>

    {profile?.role === "admin" && profile?.module?.includes("programs") && (
      <button
  onClick={() => setShowCourseForm(!showCourseForm)}
  style={{ marginBottom: "12px", ...loginButtonStyle }}
>
 {showCourseForm
  ? (lang === "ar" ? "إغلاق النموذج" : "Close")
  : (lang === "ar" ? "إضافة ملف أكاديمي" : "Add Academic File")}
</button>

    )}

{showCourseForm && (
  <form onSubmit={handleAddCourse} style={{ marginBottom: "16px" }}>

    <input
      placeholder="عنوان الملف بالعربية"
      value={newProgramFile.title_ar}
      onChange={(e) =>
        setNewProgramFile({ ...newProgramFile, title_ar: e.target.value })
      }
      style={inputStyle}
      required
    />

    <input
      placeholder="File Title in English"
      value={newProgramFile.title_en}
      onChange={(e) =>
        setNewProgramFile({ ...newProgramFile, title_en: e.target.value })
      }
      style={inputStyle}
    />

    <input
      placeholder="نوع الملف (كتاب / توصيف / تقرير)"
      value={newProgramFile.file_type_ar}
      onChange={(e) =>
        setNewProgramFile({ ...newProgramFile, file_type_ar: e.target.value })
      }
      style={inputStyle}
    />

    <input
      placeholder="File Type (Book / Description / Report)"
      value={newProgramFile.file_type_en}
      onChange={(e) =>
        setNewProgramFile({ ...newProgramFile, file_type_en: e.target.value })
      }
      style={inputStyle}
    />

    <textarea
      placeholder="وصف الملف"
      value={newProgramFile.description_ar}
      onChange={(e) =>
        setNewProgramFile({ ...newProgramFile, description_ar: e.target.value })
      }
      style={inputStyle}
    />

    <input
      placeholder="رابط الملف (PDF)"
      value={newProgramFile.file_url}
      onChange={(e) =>
        setNewProgramFile({ ...newProgramFile, file_url: e.target.value })
      }
      style={inputStyle}
      required
    />

    <button type="submit" style={loginButtonStyle}>
      {lang === "ar" ? "حفظ الملف" : "Save File"}
    </button>

  </form>
)}
    <DataCards items={programs} type="programs" />
  </section>
)}

</div>

        {activeModule === "activities" && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <div style={sectionTitle}>{text.activities}</div>
            <div style={subTitle}>
              {lang === "ar"
                ? "إدارة الفعاليات والأنشطة داخل الكلية"
                : "Managing college events and activities"}
                
            </div>

            {!activities.length && <p style={{ color: "#b45309" }}>{text.empty}</p>}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "14px",
                marginBottom: "18px",
              }}
            >
              {activities.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedActivity(item)}
                  style={{ ...cardStyle, cursor: "pointer" }}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={getTitle(item)}
                      style={{
                        width: "100%",
                        height: "190px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                  <h3>{getTitle(item)}</h3>
                  <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                    {getDescription(item)?.length > 80
  ? getDescription(item).slice(0, 80) + "..."
  : getDescription(item)}
                  </p>
                  <p>📅 {item.activity_date}</p>
                  <p>
                    📍{" "}
                    {lang === "ar"
                      ? item.activity_place_ar
                      : item.activity_place_en}
                  </p>

                  {item.registration_url && (
                    <a
                      href={item.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        background: "#0f766e",
                        color: "white",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {text.register}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {profile?.role === "admin" && (
              <>
                <button
                  onClick={() => setShowForm(!showForm)}
                  style={loginButtonStyle}
                >
                  {showForm ? text.closeForm : text.addActivity}
                </button>

                {showForm && (
                  <form onSubmit={handleAddActivity} style={{ marginTop: "16px" }}>
                    <input
                      placeholder="عنوان النشاط بالعربية"
                      value={newActivity.title_ar}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, title_ar: e.target.value })
                      }
                      required
                      style={inputStyle}
                    />

                    <input
                      placeholder="Activity title in English"
                      value={newActivity.title_en}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, title_en: e.target.value })
                      }
                      required
                      style={inputStyle}
                    />

                    <input
                      type="date"
                      value={newActivity.activity_date}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          activity_date: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="مكان النشاط بالعربية"
                      value={newActivity.activity_place_ar}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          activity_place_ar: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Activity place in English"
                      value={newActivity.activity_place_en}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          activity_place_en: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="رابط التسجيل"
                      value={newActivity.registration_url}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          registration_url: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />

                    <textarea
                      placeholder="تفاصيل النشاط بالعربية"
                      value={newActivity.details_ar}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, details_ar: e.target.value })
                      }
                      required
                      style={inputStyle}
                    />

                    <textarea
                      placeholder="Activity details in English"
                      value={newActivity.details_en}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, details_en: e.target.value })
                      }
                      required
                      style={inputStyle}
                    />

                    <input
                      placeholder="رابط صورة النشاط"
                      value={newActivity.image_url}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, image_url: e.target.value })
                      }
                      style={inputStyle}
                    />

                    <button type="submit" style={loginButtonStyle}>
                      {text.saveActivity}
                    </button>
                  </form>
                )}
              </>
            )}
          </section>
        )}

        {activeModule === "research" && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <div style={sectionTitle}>{text.research}</div>
            <DataCards items={researchProjects} type="research" />
          </section>
        )}

        {activeModule === "community" && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <div style={sectionTitle}>{text.community}</div>
            <DataCards items={communityItems} type="community" />
          </section>
        )}

        {activeModule === "academic" && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <div style={sectionTitle}>{text.academic}</div>
            <DataCards items={academicItems} type="academic" />
          </section>
        )}

        {activeModule === "quality" && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <div style={sectionTitle}>{text.quality}</div>
            <DataCards items={qualityReports} type="quality" />
          </section>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <div style={sectionTitle}>{text.login}</div>
            <div style={subTitle}>{text.loginDemo}</div>

            {!session ? (
              <>
                {authMode === "signup" && (
                  <form onSubmit={handleSignup}>
                    <input
                      placeholder={text.fullName}
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="email"
                      placeholder={text.username}
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="password"
                      placeholder={text.password}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      style={inputStyle}
                      required
                    />

                    <select
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="student">{text.student}</option>
                      <option value="instructor">{text.instructor}</option>
                      <option value="admin">{text.admin}</option>
                    </select>

                    <button type="submit" disabled={authLoading} style={loginButtonStyle}>
                      {authLoading ? "جارٍ..." : text.signup}
                    </button>
                  </form>
                )}

                {authMode === "login" && (
                  <form onSubmit={handleLogin}>
                    <input
                      type="email"
                      placeholder={text.username}
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="password"
                      placeholder={text.password}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      style={inputStyle}
                      required
                    />

                    <button type="submit" disabled={authLoading} style={loginButtonStyle}>
                      {authLoading ? "جارٍ..." : text.loginBtn}
                    </button>
                  </form>
                )}

                {authMode === "forgot" && (
                  <form onSubmit={handleForgotPassword}>
                    <input
                      type="email"
                      placeholder={text.username}
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <button type="submit" disabled={authLoading} style={loginButtonStyle}>
                      {authLoading ? "جارٍ..." : text.sendReset}
                    </button>
                  </form>
                )}

                <div style={{ marginTop: "12px" }}>
                  {authMode !== "login" && (
                    <button onClick={() => setAuthMode("login")} style={linkButtonStyle}>
                      {text.loginBtn}
                    </button>
                  )}
                  {authMode !== "signup" && (
                    <button onClick={() => setAuthMode("signup")} style={linkButtonStyle}>
                      {text.signup}
                    </button>
                  )}
                  {authMode !== "forgot" && (
                    <button onClick={() => setAuthMode("forgot")} style={linkButtonStyle}>
                      {text.forgot}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p>
                  {text.welcome}:{" "}
                  <strong>{profile?.name_ar ?? session.user.email}</strong>
                </p>
                <p>
                  {text.role}: <strong>{roleLabel}</strong>
                </p>
                <button onClick={handleLogout} style={loginButtonStyle}>
                  {text.logout}
                </button>
              </>
            )}
          </div>
        </div>

        {selectedActivity && (
  <div
    onClick={() => setSelectedActivity(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "20px",
        width: "90%",
        maxWidth: "720px",
      }}
    >
      <h2>{getTitle(selectedActivity)}</h2>

      <p style={{ color: "#64748b" }}>
        {getDescription(selectedActivity)}
      </p>

      <button
        onClick={() => setSelectedActivity(null)}
        style={loginButtonStyle}
      >
  {text.close}
</button>
</div>
</div>
)}
{selectedProgram && (
  <div
    onClick={() => setSelectedProgram(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3000,
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "22px",
        width: "90%",
        maxWidth: "760px",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <h2>
        {lang === "ar" ? selectedProgram.name_ar : selectedProgram.name_en}
      </h2>

      {selectedProgram.image_url && (
        <img
          src={selectedProgram.image_url}
          alt=""
          style={{
            width: "100%",
            maxHeight: "260px",
            objectFit: "cover",
            borderRadius: "14px",
            marginBottom: "16px",
          }}
        />
      )}

      <p style={{ lineHeight: 1.8, color: "#334155" }}>
        {lang === "ar"
          ? selectedProgram.description_ar || programDetailsFallback[selectedProgram.id]?.description_ar
          : selectedProgram.description_en || programDetailsFallback[selectedProgram.id]?.description_en}
      </p>

      <p>
        <strong>{lang === "ar" ? "الدرجة:" : "Degree:"}</strong>{" "}
        {lang === "ar" ? selectedProgram.degree_ar || programDetailsFallback[selectedProgram.id]?.degree_ar : selectedProgram.degree_en || programDetailsFallback[selectedProgram.id]?.degree_en}
      </p>

      <p>
        <strong>{lang === "ar" ? "المدة:" : "Duration:"}</strong>{" "}
        {selectedProgram.duration || programDetailsFallback[selectedProgram.id]?.duration}
      </p>

      <p>
        <strong>{lang === "ar" ? "عدد الساعات:" : "Hours:"}</strong>{" "}
        {selectedProgram.hours}
      </p>

      <p>
        <strong>{lang === "ar" ? "شروط القبول:" : "Admission Requirements:"}</strong>{" "}
        {lang === "ar"
          ? selectedProgram.admission_requirements_ar
          : selectedProgram.admission_requirements_en}
      </p>

      {(() => {
  const schedule = schedules.find(
  (s) => Number(s.program_id) === Number(selectedProgram.id)
);

const url = schedule?.file_url;

  return (
    <a
      href={url || "#"}
onClick={(e) => {
  if (!url) {
    e.preventDefault();
    alert(lang === "ar" ? "لم يتم رفع الجدول الدراسي بعد" : "Schedule not uploaded yet");
  }
}}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-block",
        background: "#1e293b",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: "bold",
        marginBottom: "12px",
      }}
    >
      {lang === "ar" ? "الجدول الدراسي" : "Study Schedule"}
    </a>
  );
})()}
        
{programFiles.filter((file) => Number(file.program_id) === Number(selectedProgram.id)).length > 0 && (
  <details style={{ marginTop: "18px", marginBottom: "16px" }}>
    <summary
      style={{
        cursor: "pointer",
        background: "#0f766e",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        fontWeight: "bold",
        width: "fit-content",
      }}
    >
      {lang === "ar" ? "عرض الملفات الأكاديمية" : "View Academic Files"}
    </summary>

    <div style={{ marginTop: "12px" }}>
      {programFiles
        .filter((file) => Number(file.program_id) === Number(selectedProgram.id))
        .map((file) => (
          <a
            key={file.id}
            href={file.file_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#0f766e",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            📄 {lang === "ar" ? file.title_ar : file.title_en}
          </a>
        ))}
    </div>
  </details>
)}
      <button
        onClick={() => setSelectedProgram(null)}
        style={loginButtonStyle}
      >
        {lang === "ar" ? "إغلاق" : "Close"}
      </button>
    </div>
  </div>
)}
      </div>
  );
}
const loginButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#0f766e",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "Tajawal, sans-serif",
};

const linkButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#0f766e",
  cursor: "pointer",
  margin: "4px",
  fontWeight: "bold",
  fontFamily: "Tajawal, sans-serif",
};

