import "./App.css";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";
import StudentPortal from "./pages/StudentPortal";
import InstructorPortal from "./pages/InstructorPortal";
import AdminPortal from "./pages/AdminPortal";
import QualityPortal from "./pages/QualityPortal";
import ResearchPortal from "./pages/ResearchPortal";
import CommunityPortal from "./pages/CommunityPortal";
import AcademicPortal from "./pages/AcademicPortal";
import DeanMessage from "./pages/DeanMessage";
import FacultyPage from "./pages/FacultyPage";
import ContactPage from "./pages/ContactPage";
import AboutCollege from "./pages/AboutCollege";
import StructurePage from "./pages/StructurePage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [lang, setLang] = useState("ar");
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("student");
  const [authLoading, setAuthLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  const [activeForm, setActiveForm] = useState(null);
  const [popupUrl, setPopupUrl] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [deanData, setDeanData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [structureData, setStructureData] = useState(null); 
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
  const [courses, setCourses] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programFiles, setProgramFiles] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingProgramFile, setEditingProgramFile] = useState(null);

  const [newProgramFile, setNewProgramFile] = useState({
    program_id: "",
    course_id: "",
    title_ar: "",
    title_en: "",
    file_type_ar: "",
    file_type_en: "",
    description_ar: "",
    description_en: "",
    file_url: "",
  });

  const [selectedActivity, setSelectedActivity] = useState(null);

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

  const [studentCourses, setStudentCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);

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

  function toggleForm(formName) {
    setActiveForm(activeForm === formName ? null : formName);
  }

  function closeForm() {
    setActiveForm(null);
  }

  function openPopup(url, title) {
    if (!url) return;
    setPopupUrl(url);
    setPopupTitle(title || (lang === "ar" ? "عرض الرابط" : "Open Link"));
  }

  function closePopup() {
    setPopupUrl("");
    setPopupTitle("");
  }

  useEffect(() => {
    fetchAllData();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session?.user?.email) {
        loadUserProfileByEmail(data.session.user.email);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecoveryMode(true);
        }

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
  fetchStats(),
  fetchProgramFiles(),
  fetchStudyPlans(),
  fetchSchedules(),
  fetchDeanData(),
  fetchAboutData(),
  fetchStructureData(),
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

    if (!error) setStudentCourses(data ?? []);
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

  async function fetchProgramFiles() {
    const { data, error } = await supabase
      .from("program_files")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProgramFiles(data ?? []);
  }
    async function fetchDeanData() {
  const { data, error } = await supabase
    .from("dean_message")
    .select("name,image_url,message_ar,message_en")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.log("DEAN DATA ERROR:", error);
    return;
  }

  setDeanData(data);
}
async function fetchAboutData() {
  const { data, error } = await supabase
    .from("about_college")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.log("ABOUT DATA ERROR:", error);
    return;
  }

  setAboutData(data);
}

async function fetchStructureData() {
  const { data, error } = await supabase
    .from("organizational_structure")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.log("STRUCTURE DATA ERROR:", error);
    return;
  }

  setStructureData(data);
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

    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (admin) {
      const modules = Array.isArray(admin.module)
        ? admin.module
        : admin.module
        ? [admin.module]
        : [];

      setProfile({ ...admin, module: modules, role: "admin" });
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
        {
          ...commonData,
          student_id: "S" + Date.now(),
          major: "",
          level: 1,
        },
      ]);
      insertError = error;
    }

    if (authRole === "instructor") {
      const { error } = await supabase.from("instructors").insert([
        {
          ...commonData,
          instructor_id: "I" + Date.now(),
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
    closeForm();
    alert("تمت إضافة النشاط بنجاح");
  }

  async function handleAddCourse(e) {
    e.preventDefault();

    const { error } = await supabase.from("program_files").insert([
      {
        program_id: Number(newProgramFile.program_id),
        course_id: newProgramFile.course_id ? Number(newProgramFile.course_id) : null,
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
    await fetchProgramFiles();
    closeForm();
    alert("تمت إضافة الملف الأكاديمي بنجاح");
  }

  async function handleUpdateProgramFile(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("program_files")
      .update({
        title_ar: editingProgramFile.title_ar,
        title_en: editingProgramFile.title_en,
        file_url: editingProgramFile.file_url,
        file_type_ar: editingProgramFile.file_type_ar,
        file_type_en: editingProgramFile.file_type_en,
        description_ar: editingProgramFile.description_ar,
        description_en: editingProgramFile.description_en,
      })
      .eq("id", editingProgramFile.id);

    if (error) {
      alert("خطأ في تعديل الملف: " + error.message);
      return;
    }

    alert("تم تعديل الملف بنجاح");
    setEditingProgramFile(null);
    setSelectedFile(null);
    await fetchProgramFiles();
  }

  const t = {
    ar: {
      toggle: "English",
      title: "النظام الذكي للكلية الجامعية بتيماء",
      home: "الرئيسية",
      about: "عن الكلية",
      contact: "تواصل معنا",
      hero: "نظام ERP متكامل للكلية الجامعية بتيماء يهدف إلى إدارة البرامج الأكاديمية والأنشطة الطلابية والبحث العلمي والشؤون الأكاديمية والمسؤولية المجتمعية من خلال منصة رقمية موحدة تدعم اتخاذ القرار المبني على البيانات، ويأتي هذا النظام كأولى مخرجات تنفيذ خطة المجتمع التعليمي للإدارة الذكية.",
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
      home: "Home",
      about: "About",
      contact: "Contact",
      title: "ERP System: Tayma University College",
      hero: "An integrated ERP system for Tayma University College designed to manage academic programs, student activities, scientific research, academic affairs, and community services through a unified digital platform that supports data-driven decision making.",
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

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.7,
                minHeight: "60px",
              }}
            >
              {getDescription(item)?.length > 80
                ? getDescription(item).slice(0, 80) + "..."
                : getDescription(item)}
            </p>

            {type === "programs" && (
              <>
                <p>{text.hours}: {item.hours}</p>

                <span
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
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
                      openPopup(url, lang === "ar" ? "الخطة الدراسية" : "Study Plan");
                    } else {
                      alert(lang === "ar" ? "لا توجد خطة دراسية" : "No study plan found");
                    }
                  }}
                  style={{
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1500,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "5px",
            flexWrap: "nowrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="شعار الجامعة"
              style={{
                width: "62px",
                height: "62px",
                objectFit: "contain",
              }}
            />

            <h2
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "700",
                lineHeight: "1.5",
                whiteSpace: "nowrap",
                color: "#0f172a",
              }}
            >
              {lang === "ar" ? "الكلية الجامعية بتيماء" : "University College of Tayma"}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "nowrap",
              gap: "8px",
              flex: 1,
            }}
          >
            <button onClick={() => setActiveModule("programs")} style={navButtonStyle}>
              {text.home}
            </button>

            <button onClick={() => setActiveModule("about")} style={navButtonStyle}>
              {text.about}
            </button>

            <button onClick={() => setActiveModule("dean")} style={navButtonStyle}>
              {lang === "ar" ? "كلمة العميد" : "Dean Message"}
            </button>

            <button onClick={() => setActiveModule("structure")} style={navButtonStyle}>
              {lang === "ar" ? "الهيكل التنظيمي" : "Organizational Structure"}
            </button>

            <button onClick={() => setActiveModule("faculty")} style={navButtonStyle}>
              {lang === "ar" ? "أعضاء هيئة التدريس" : "Faculty Members"}
            </button>

            <button onClick={() => setActiveModule("contact")} style={navButtonStyle}>
              {text.contact}
            </button>

            {session && profile?.role === "admin" && (
              <button
                onClick={() => setActiveModule("dashboard")}
                style={{
                  ...navButtonStyle,
                  background: activeModule === "dashboard" ? "#134e4a" : "#0f766e",
                  color: "white",
                }}
              >
                {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
              </button>
            )}

            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={navButtonStyle}>
              {text.toggle}
            </button>

            <button
              onClick={() => toggleForm("auth")}
              style={{
                ...navButtonStyle,
                background: "#0f766e",
                color: "white",
              }}
            >
              {text.login}
            </button>
          </div>
        </div>
      </header>

      <section
        style={{
          background: "linear-gradient(135deg, #0f766e, #14b8a6)",
          color: "white",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ textAlign: "center", fontSize: "32px" }}>{text.title}</h1>
          <p
            style={{
              textAlign: "center",
              maxWidth: "700px",
              margin: "10px auto",
              lineHeight: "1.8",
            }}
          >
            {text.hero}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {activeModule === "dashboard" ? (
          <Dashboard
            session={session}
            profile={profile}
            lang={lang}
            cardStyle={cardStyle}
            setActiveModule={setActiveModule}
          />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {[
                {
                  title: lang === "ar" ? "منصة MYUT" : "MYUT Portal",
                  desc: lang === "ar" ? "الدخول للخدمات الجامعية" : "University services portal",
                  image: "https://i.postimg.cc/zfTnVcBG/Capture-d-ecran-2026-05-01-022005.jpg",
                  url: "https://myut.ut.edu.sa",
                },
                {
                  title: lang === "ar" ? "نظام سهل" : "Sahl System",
                  desc: lang === "ar" ? "الخدمات والإجراءات الإلكترونية" : "Electronic services",
                  image: "https://i.postimg.cc/bYBLBcQy/dkhwl-nzam-shl-jamʿt-tbwk.jpg",
                  url: "https://gate.ut.edu.sa/sahelv2/",
                },
                {
                  title: lang === "ar" ? "البلاك بورد" : "Blackboard",
                  desc: lang === "ar" ? "منصة التعليم الإلكتروني" : "E-learning platform",
                  image: "https://i.postimg.cc/qM7g95Hv/blakbwrd.jpg",
                  url: "https://lms.ut.edu.sa",
                },
                {
                  title: lang === "ar" ? "منصة العمل التطوعي" : "Volunteer Platform",
                  desc: lang === "ar" ? "فرص التطوع وخدمة المجتمع" : "Volunteering opportunities",
                  image: "https://i.postimg.cc/2jtfScBQ/telechargement.jpg",
                  url: "https://nvg.gov.sa",
                },
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => openPopup(item.url, item.title)}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "inherit",
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  <div style={{ ...cardStyle, textAlign: "center" }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          display: "inline-block",
                          marginBottom: "10px",
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "40px", marginBottom: "6px" }}>{item.icon}</div>
                    )}
                    <h3>{item.title}</h3>
                    <p style={{ color: "#64748b" }}>{item.desc}</p>
                  </div>
                </button>
              ))}
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
                      border: activeModule === item.id ? "2px solid #0f766e" : "1px solid #e5e7eb",
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

            <div id="module-content">
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

              <QualityPortal
                activeModule={activeModule}
                lang={lang}
                cardStyle={cardStyle}
                sectionTitle={sectionTitle}
                subTitle={subTitle}
              />

              <CommunityPortal activeModule={activeModule} lang={lang} cardStyle={cardStyle} />

              <AcademicPortal activeModule={activeModule} lang={lang} cardStyle={cardStyle} profile={profile} />

              {activeModule === "research" && (
                <ResearchPortal
                  session={session}
                  profile={profile}
                  lang={lang}
                  cardStyle={cardStyle}
                  setActiveModule={setActiveModule}
                />
              )}

              {activeModule === "programs" && (
                <section style={{ ...cardStyle, marginBottom: "24px" }}>
                  <div style={sectionTitle}>{text.programs}</div>

                  {profile?.role === "admin" && profile?.module?.includes("programs") && (
                    <button onClick={() => toggleForm("course")} style={{ marginBottom: "12px", ...loginButtonStyle }}>
                      {activeForm === "course"
                        ? lang === "ar"
                          ? "إغلاق النموذج"
                          : "Close"
                        : lang === "ar"
                        ? "إضافة ملف أكاديمي"
                        : "Add Academic File"}
                    </button>
                  )}

                  {activeForm === "course" && (
                    <form onSubmit={handleAddCourse} style={{ marginBottom: "16px" }}>
                      <select
                        value={newProgramFile.program_id}
                        onChange={(e) =>
                          setNewProgramFile({
                            ...newProgramFile,
                            program_id: e.target.value,
                          })
                        }
                        style={inputStyle}
                        required
                      >
                        <option value="">اختاري البرنامج</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {lang === "ar" ? program.name_ar : program.name_en}
                          </option>
                        ))}
                      </select>

                      <input
                        placeholder="عنوان الملف بالعربية"
                        value={newProgramFile.title_ar}
                        onChange={(e) => setNewProgramFile({ ...newProgramFile, title_ar: e.target.value })}
                        style={inputStyle}
                        required
                      />

                      <input
                        placeholder="File Title in English"
                        value={newProgramFile.title_en}
                        onChange={(e) => setNewProgramFile({ ...newProgramFile, title_en: e.target.value })}
                        style={inputStyle}
                      />

                      <input
                        placeholder="نوع الملف (كتاب / توصيف / تقرير)"
                        value={newProgramFile.file_type_ar}
                        onChange={(e) => setNewProgramFile({ ...newProgramFile, file_type_ar: e.target.value })}
                        style={inputStyle}
                      />

                      <input
                        placeholder="File Type (Book / Description / Report)"
                        value={newProgramFile.file_type_en}
                        onChange={(e) => setNewProgramFile({ ...newProgramFile, file_type_en: e.target.value })}
                        style={inputStyle}
                      />

                      <textarea
                        placeholder="وصف الملف"
                        value={newProgramFile.description_ar}
                        onChange={(e) => setNewProgramFile({ ...newProgramFile, description_ar: e.target.value })}
                        style={inputStyle}
                      />

                      <input
                        placeholder="رابط الملف أو الخطة أو Google Drive"
                        value={newProgramFile.file_url}
                        onChange={(e) => setNewProgramFile({ ...newProgramFile, file_url: e.target.value })}
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
                  {lang === "ar" ? "إدارة الفعاليات والأنشطة داخل الكلية" : "Managing college events and activities"}
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
                    <div key={item.id} onClick={() => setSelectedActivity(item)} style={{ ...cardStyle, cursor: "pointer" }}>
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
                      <p>📍 {lang === "ar" ? item.activity_place_ar : item.activity_place_en}</p>

                      {item.registration_url && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPopup(item.registration_url, lang === "ar" ? "التسجيل" : "Registration");
                          }}
                          style={{
                            display: "inline-block",
                            marginTop: "8px",
                            background: "#0f766e",
                            color: "white",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "13px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontFamily: "Tajawal, sans-serif",
                          }}
                        >
                          {text.register}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {profile?.role === "admin" && (
                  <>
                    <button onClick={() => toggleForm("activity")} style={loginButtonStyle}>
                      {activeForm === "activity" ? text.closeForm : text.addActivity}
                    </button>

                    {activeForm === "activity" && (
                      <form onSubmit={handleAddActivity} style={{ marginTop: "16px" }}>
                        <input
                          placeholder="عنوان النشاط بالعربية"
                          value={newActivity.title_ar}
                          onChange={(e) => setNewActivity({ ...newActivity, title_ar: e.target.value })}
                          required
                          style={inputStyle}
                        />

                        <input
                          placeholder="Activity title in English"
                          value={newActivity.title_en}
                          onChange={(e) => setNewActivity({ ...newActivity, title_en: e.target.value })}
                          required
                          style={inputStyle}
                        />

                        <input
                          type="date"
                          value={newActivity.activity_date}
                          onChange={(e) => setNewActivity({ ...newActivity, activity_date: e.target.value })}
                          style={inputStyle}
                        />

                        <input
                          placeholder="مكان النشاط بالعربية"
                          value={newActivity.activity_place_ar}
                          onChange={(e) => setNewActivity({ ...newActivity, activity_place_ar: e.target.value })}
                          style={inputStyle}
                        />

                        <input
                          placeholder="Activity place in English"
                          value={newActivity.activity_place_en}
                          onChange={(e) => setNewActivity({ ...newActivity, activity_place_en: e.target.value })}
                          style={inputStyle}
                        />

                        <input
                          placeholder="رابط التسجيل"
                          value={newActivity.registration_url}
                          onChange={(e) => setNewActivity({ ...newActivity, registration_url: e.target.value })}
                          style={inputStyle}
                        />

                        <textarea
                          placeholder="تفاصيل النشاط بالعربية"
                          value={newActivity.details_ar}
                          onChange={(e) => setNewActivity({ ...newActivity, details_ar: e.target.value })}
                          required
                          style={inputStyle}
                        />

                        <textarea
                          placeholder="Activity details in English"
                          value={newActivity.details_en}
                          onChange={(e) => setNewActivity({ ...newActivity, details_en: e.target.value })}
                          required
                          style={inputStyle}
                        />

                        <input
                          placeholder="رابط صورة النشاط"
                          value={newActivity.image_url}
                          onChange={(e) => setNewActivity({ ...newActivity, image_url: e.target.value })}
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

            {activeForm === "auth" && (
              <div
                onClick={closeForm}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(15, 23, 42, 0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3000,
                  padding: "20px",
                }}
              >
                <div onClick={(e) => e.stopPropagation()} style={{ width: "390px", maxWidth: "100%" }}>
                  <div style={cardStyle}>
                    <div style={sectionTitle}>{text.login}</div>
                    <div style={subTitle}>{text.loginDemo}</div>

                    {isRecoveryMode && (
                      <div style={{ marginBottom: "16px" }}>
                        <input
                          type="password"
                          placeholder="كلمة المرور الجديدة"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          style={inputStyle}
                        />

                        <button
                          style={loginButtonStyle}
                          onClick={async () => {
                            const { error } = await supabase.auth.updateUser({ password: newPassword });

                            if (error) {
                              alert("خطأ: " + error.message);
                              return;
                            }

                            alert("تم تحديث كلمة المرور");
                            setIsRecoveryMode(false);
                            setNewPassword("");
                          }}
                        >
                          حفظ كلمة المرور
                        </button>
                      </div>
                    )}

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

                            <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} style={inputStyle}>
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

                        <div style={{ marginTop: "12px", textAlign: "center" }}>
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
                          {text.welcome}: <strong>{(lang === "ar" ? profile?.name_ar : profile?.name_en) ?? session.user.email}</strong>
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
              </div>
            )}

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
                  <p style={{ color: "#64748b" }}>{getDescription(selectedActivity)}</p>

                  <button onClick={() => setSelectedActivity(null)} style={loginButtonStyle}>
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
                  <h2>{lang === "ar" ? selectedProgram.name_ar : selectedProgram.name_en}</h2>

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

                  <p
                    style={{
                      lineHeight: 1.8,
                      fontSize: "18px",
                      color: "#334155",
                      fontWeight: "500",
                      textAlign: "center",
                      maxWidth: "800px",
                      margin: "0 auto",
                    }}
                  >
                    {lang === "ar"
                      ? selectedProgram.description_ar || programDetailsFallback[selectedProgram.id]?.description_ar
                      : selectedProgram.description_en || programDetailsFallback[selectedProgram.id]?.description_en}
                  </p>

                  <p>
                    <strong>{lang === "ar" ? "الدرجة:" : "Degree:"}</strong>{" "}
                    {lang === "ar"
                      ? selectedProgram.degree_ar || programDetailsFallback[selectedProgram.id]?.degree_ar
                      : selectedProgram.degree_en || programDetailsFallback[selectedProgram.id]?.degree_en}
                  </p>

                  <p>
                    <strong>{lang === "ar" ? "المدة:" : "Duration:"}</strong>{" "}
                    {lang === "ar"
                      ? selectedProgram.duration_ar || programDetailsFallback[selectedProgram.id]?.duration
                      : selectedProgram.duration || programDetailsFallback[selectedProgram.id]?.duration}
                  </p>

                  <p>
                    <strong>{lang === "ar" ? "عدد الساعات:" : "Hours:"}</strong> {selectedProgram.hours || "-"}
                  </p>

                  <p>
                    <strong>{lang === "ar" ? "شروط القبول:" : "Admission Requirements:"}</strong>{" "}
                    {lang === "ar" ? selectedProgram.admission_requirements_ar : selectedProgram.admission_requirements_en}
                  </p>

                  {(() => {
                    const plan = studyPlans.find((p) => Number(p.program_id) === Number(selectedProgram.id));

                    return (
                      <div style={{ marginBottom: "12px" }}>
                        {plan && (
                          <button
                            type="button"
                            onClick={() => openPopup(plan.file_url, lang === "ar" ? "الخطة الدراسية" : "Study Plan")}
                            style={{
                              background: "#1e293b",
                              color: "white",
                              padding: "10px",
                              borderRadius: "8px",
                              display: "inline-block",
                              marginBottom: "6px",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "Tajawal, sans-serif",
                              fontWeight: "bold",
                            }}
                          >
                            📊 {lang === "ar" ? "عرض الخطة الدراسية" : "View Study Plan"}
                          </button>
                        )}

                        {profile?.role === "admin" && (
                          <button
                            onClick={async () => {
                              const url = prompt("رابط الخطة");
                              if (!url) return;

                              await supabase.from("study_plans").insert([{ program_id: selectedProgram.id, file_url: url }]);
                              fetchStudyPlans();
                            }}
                            style={{ marginRight: "6px" }}
                          >
                            ➕ {lang === "ar" ? "إضافة" : "Add"}
                          </button>
                        )}

                        {profile?.role === "admin" && plan && (
                          <button
                            onClick={async () => {
                              await supabase.from("study_plans").delete().eq("id", plan.id);
                              fetchStudyPlans();
                            }}
                          >
                            🗑️ {lang === "ar" ? "حذف" : "Delete"}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {(profile?.role === "admin" ||
                    programFiles.filter((file) => Number(file.program_id) === Number(selectedProgram.id)).length > 0) && (
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

                      <div style={{ marginTop: "16px" }}>
                        {programFiles
                          .filter((file) => Number(file.program_id) === Number(selectedProgram.id))
                          .map((file) => (
                            <div
                              key={file.id}
                              style={{
                                background: "#f8fafc",
                                padding: "12px",
                                borderRadius: "10px",
                                marginBottom: "10px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              {file.file_url ? (
                                <button
                                  type="button"
                                  onClick={() => openPopup(file.file_url, lang === "ar" ? file.title_ar : file.title_en)}
                                  style={{
                                    color: "#0f766e",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "Tajawal, sans-serif",
                                  }}
                                >
                                  📄 {lang === "ar" ? file.title_ar : file.title_en}
                                </button>
                              ) : (
                                <span>📄 {lang === "ar" ? file.title_ar : file.title_en}</span>
                              )}

                              {profile?.role === "admin" && (
                                <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => setEditingProgramFile(file)}
                                    style={{
                                      background: "#0f766e",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    ✏️ {lang === "ar" ? "تعديل" : "Edit"}
                                  </button>

                                  <button
                                    onClick={async () => {
                                      if (!window.confirm("حذف الملف؟")) return;

                                      await supabase.from("program_files").delete().eq("id", file.id);
                                      fetchProgramFiles();
                                    }}
                                    style={{
                                      background: "#dc2626",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    🗑️ {lang === "ar" ? "حذف" : "Delete"}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </details>
                  )}

                  {profile?.role === "admin" && editingProgramFile && (
                    <form
                      onSubmit={handleUpdateProgramFile}
                      style={{
                        marginTop: "16px",
                        padding: "12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                      }}
                    >
                      <h3>تعديل الملف</h3>

                      <input
                        value={editingProgramFile.title_ar || ""}
                        onChange={(e) => setEditingProgramFile({ ...editingProgramFile, title_ar: e.target.value })}
                        placeholder="عنوان الملف"
                        style={inputStyle}
                      />

                      <input
                        value={editingProgramFile.file_url || ""}
                        onChange={(e) => setEditingProgramFile({ ...editingProgramFile, file_url: e.target.value })}
                        placeholder="رابط الملف"
                        style={inputStyle}
                      />

                      <button type="submit" style={loginButtonStyle}>
                        حفظ التعديل
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingProgramFile(null)}
                        style={{ ...loginButtonStyle, background: "#64748b", marginTop: "8px" }}
                      >
                        إلغاء
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {activeModule === "contact" && (
              <ModalWrapper onClose={() => setActiveModule(null)}>
                <ContactPage lang={lang} />
              </ModalWrapper>
            )}

            {activeModule === "about" && (
  <div
    onClick={() => setActiveModule(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 4000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        width: "95%",
        maxWidth: "900px",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <button onClick={() => setActiveModule(null)}>✖</button>
      <AboutCollege lang={lang} about={aboutData} />
    </div>
  </div>
)}

            {activeModule === "structure" && (
  <div
    onClick={() => setActiveModule(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 4000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        width: "95%",
        maxWidth: "900px",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <button onClick={() => setActiveModule(null)}>✖</button>
      <StructurePage lang={lang} structure={structureData} />
    </div>
  </div>
)}

            {activeModule === "dean" && (
  <div
    onClick={() => setActiveModule(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.55)",
      zIndex: 4000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "white",
        borderRadius: "22px",
        padding: "24px",
        width: "95%",
        maxWidth: "900px",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <button onClick={() => setActiveModule(null)}>✖</button>

      <DeanMessage
  lang={lang}
  dean={deanData}
  cardStyle={{ boxShadow: "none", border: "none", padding: 0 }}
/>
    </div>
  </div>
)}
            {activeModule === "faculty" && (
              <ModalWrapper onClose={() => setActiveModule(null)} maxWidth="900px">
                <FacultyPage lang={lang} />
              </ModalWrapper>
            )}
          </>
        )}
      </div>

      {popupUrl && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 6000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "96%",
              height: "88vh",
              background: "white",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: "#0f766e",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <strong>{popupTitle}</strong>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a
                  href={popupUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#ecfdf5",
                    color: "#0f766e",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {lang === "ar" ? "فتح خارجي" : "Open externally"}
                </a>

                <button
                  type="button"
                  onClick={closePopup}
                  style={{
                    background: "white",
                    color: "#0f766e",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  {lang === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>

            <iframe
              src={popupUrl}
              title={popupTitle}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "white",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ModalWrapper({ children, onClose, maxWidth = "600px" }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          width: "95%",
          maxWidth,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <button onClick={onClose}>✖</button>
        {children}
      </div>
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

const navButtonStyle = {
  border: "none",
  background: "transparent",
  padding: "5px 7px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
  fontFamily: "Tajawal, sans-serif",
  whiteSpace: "nowrap",
};
