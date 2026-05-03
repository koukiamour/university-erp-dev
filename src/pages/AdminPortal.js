import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPortal({
  session,
  profile,
  lang,
  cardStyle,
  stats,
  setActiveModule,
}) {
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name_ar: "",
    name_en: "",
    email: "",
    major: "",
    level: 1,
  });

  const [newInstructor, setNewInstructor] = useState({
    name_ar: "",
    name_en: "",
    email: "",
    department_ar: "",
    department_en: "",
    title_ar: "عضو هيئة تدريس",
    title_en: "Instructor",
  });

  const [newAdmin, setNewAdmin] = useState({
    name_ar: "",
    name_en: "",
    email: "",
    job_title_ar: "مسؤول النظام",
    job_title_en: "System Admin",
    module: "dashboard",
  });

  async function fetchStudents() {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setStudents(data || []);
  }

  async function fetchAdmins() {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setAdmins(data || []);
  }

  useEffect(() => {
    if (session && profile?.role === "admin") {
      fetchStudents();
      fetchAdmins();
    }
  }, [session, profile]);

  async function addStudent(e) {
    e.preventDefault();

    const { error } = await supabase.from("students").insert([
  {
    student_id: "S" + Date.now(),
    ...newStudent,
    email: newStudent.email.trim().toLowerCase(),
    status_ar: "نشط",
    status_en: "Active",
  },
]);

    if (error) return alert(error.message);

    alert("تمت إضافة الطالب");

    setNewStudent({
      name_ar: "",
      name_en: "",
      email: "",
      major: "",
      level: 1,
    });

    fetchStudents();
  }

  async function addInstructor(e) {
    e.preventDefault();

    const { error } = await supabase.from("instructors").insert([
  {
    instructor_id: "I" + Date.now(), // 🔥 الحل هنا
    ...newInstructor,
    email: newInstructor.email.trim().toLowerCase(),
    status_ar: "نشط",
    status_en: "Active",
  },
]);

    if (error) return alert(error.message);

    alert("تمت إضافة عضو هيئة التدريس");

    setNewInstructor({
      name_ar: "",
      name_en: "",
      email: "",
      department_ar: "",
      department_en: "",
      title_ar: "عضو هيئة تدريس",
      title_en: "Instructor",
    });
  }

  async function addAdmin(e) {
    e.preventDefault();

    const modules = newAdmin.module
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase.from("admins").insert([
      {
        name_ar: newAdmin.name_ar,
        name_en: newAdmin.name_en,
        email: newAdmin.email.trim().toLowerCase(),
        job_title_ar: newAdmin.job_title_ar,
        job_title_en: newAdmin.job_title_en,
        module: modules.length ? modules : ["dashboard"],
        status_ar: "نشط",
        status_en: "Active",
      },
    ]);

    if (error) return alert(error.message);

    alert("تمت إضافة الأدمن");

    setNewAdmin({
      name_ar: "",
      name_en: "",
      email: "",
      job_title_ar: "مسؤول النظام",
      job_title_en: "System Admin",
      module: "dashboard",
    });

    fetchAdmins();
  }

  async function updateStudent(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("students")
      .update({
        name_ar: editingStudent.name_ar,
        name_en: editingStudent.name_en,
        email: editingStudent.email,
        major: editingStudent.major,
        level: editingStudent.level,
      })
      .eq("id", editingStudent.id);

    if (error) return alert(error.message);

    alert("تم تعديل الطالب");
    setEditingStudent(null);
    fetchStudents();
  }

  async function deleteStudent(id) {
    if (!window.confirm("هل تريد حذف الطالب؟")) return;

    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) return alert(error.message);

    alert("تم حذف الطالب");
    fetchStudents();
  }

  async function deleteAdmin(id) {
    if (!window.confirm("هل تريد حذف الأدمن؟")) return;

    const { error } = await supabase.from("admins").delete().eq("id", id);

    if (error) return alert(error.message);

    alert("تم حذف الأدمن");
    fetchAdmins();
  }

  if (!session || profile?.role !== "admin") return null;

  return (
    <section
      style={{
        ...cardStyle,
        marginBottom: "24px",
        border: "2px solid #ccfbf1",
      }}
    >
      <h2>{lang === "ar" ? "إدارة المستخدمين" : "Users Management"}</h2>

      <p>
        {lang === "ar" ? "مرحبًا" : "Welcome"}: {" "}
        <strong>{lang === "ar" ? profile.name_ar : profile.name_en}</strong>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        <form onSubmit={addStudent} style={boxStyle}>
          <h3>{lang === "ar" ? "إضافة طالب/طالبة" : "Add Student"}</h3>

          <input
            placeholder="الاسم بالعربية"
            value={newStudent.name_ar}
            onChange={(e) => setNewStudent({ ...newStudent, name_ar: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="Name in English"
            value={newStudent.name_en}
            onChange={(e) => setNewStudent({ ...newStudent, name_en: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Email"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="التخصص"
            value={newStudent.major}
            onChange={(e) => setNewStudent({ ...newStudent, major: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="المستوى"
            type="number"
            value={newStudent.level}
            onChange={(e) =>
              setNewStudent({ ...newStudent, level: Number(e.target.value) })
            }
            style={inputStyle}
          />

          <button type="submit" style={adminButton}>
            {lang === "ar" ? "حفظ الطالب" : "Save Student"}
          </button>
        </form>

        <form onSubmit={addInstructor} style={boxStyle}>
          <h3>{lang === "ar" ? "إضافة عضو هيئة تدريس" : "Add Instructor"}</h3>

          <input
            placeholder="الاسم بالعربية"
            value={newInstructor.name_ar}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, name_ar: e.target.value })
            }
            style={inputStyle}
            required
          />

          <input
            placeholder="Name in English"
            value={newInstructor.name_en}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, name_en: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Email"
            type="email"
            value={newInstructor.email}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, email: e.target.value })
            }
            style={inputStyle}
            required
          />

          <input
            placeholder="القسم بالعربية"
            value={newInstructor.department_ar}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, department_ar: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Department in English"
            value={newInstructor.department_en}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, department_en: e.target.value })
            }
            style={inputStyle}
          />

          <button type="submit" style={adminButton}>
            {lang === "ar" ? "حفظ عضو هيئة التدريس" : "Save Instructor"}
          </button>
        </form>

        <form onSubmit={addAdmin} style={boxStyle}>
          <h3>{lang === "ar" ? "إضافة أدمن" : "Add Admin"}</h3>

          <input
            placeholder="اسم الأدمن بالعربية"
            value={newAdmin.name_ar}
            onChange={(e) => setNewAdmin({ ...newAdmin, name_ar: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="Admin name in English"
            value={newAdmin.name_en}
            onChange={(e) => setNewAdmin({ ...newAdmin, name_en: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Email"
            type="email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="المسمى الوظيفي بالعربية"
            value={newAdmin.job_title_ar}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, job_title_ar: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Job title in English"
            value={newAdmin.job_title_en}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, job_title_en: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="الصلاحيات مفصولة بفواصل: dashboard,programs,activities"
            value={newAdmin.module}
            onChange={(e) => setNewAdmin({ ...newAdmin, module: e.target.value })}
            style={inputStyle}
          />

          <button type="submit" style={adminButton}>
            {lang === "ar" ? "حفظ الأدمن" : "Save Admin"}
          </button>
        </form>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
        <button onClick={() => setShowStudents(!showStudents)} style={adminButton}>
          {showStudents ? "إخفاء الطلاب" : "عرض الطلاب"}
        </button>

        <button onClick={() => setShowAdmins(!showAdmins)} style={adminButton}>
          {showAdmins ? "إخفاء الأدمن" : "عرض الأدمن"}
        </button>
      </div>

      {showStudents && (
        <>
          <h3 style={{ marginTop: "24px" }}>
            {lang === "ar" ? "قائمة الطلاب" : "Students List"}
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>{lang === "ar" ? "الاسم" : "Name"}</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>{lang === "ar" ? "التخصص" : "Major"}</th>
                  <th style={thStyle}>{lang === "ar" ? "المستوى" : "Level"}</th>
                  <th style={thStyle}>{lang === "ar" ? "إجراء" : "Action"}</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>
                      {lang === "ar" ? student.name_ar : student.name_en}
                    </td>
                    <td style={tdStyle}>{student.email}</td>
                    <td style={tdStyle}>{student.major}</td>
                    <td style={tdStyle}>{student.level}</td>
                    <td style={tdStyle}>
                      <button onClick={() => setEditingStudent(student)} style={adminButton}>
                        تعديل
                      </button>

                      <button
                        onClick={() => deleteStudent(student.id)}
                        style={{ ...deleteButton, marginRight: "6px" }}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showAdmins && (
        <>
          <h3 style={{ marginTop: "24px" }}>
            {lang === "ar" ? "قائمة الأدمن" : "Admins List"}
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>{lang === "ar" ? "الاسم" : "Name"}</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>{lang === "ar" ? "المسمى" : "Job Title"}</th>
                  <th style={thStyle}>{lang === "ar" ? "الصلاحيات" : "Modules"}</th>
                  <th style={thStyle}>{lang === "ar" ? "إجراء" : "Action"}</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin, index) => (
                  <tr key={admin.id}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>
                      {lang === "ar" ? admin.name_ar : admin.name_en}
                    </td>
                    <td style={tdStyle}>{admin.email}</td>
                    <td style={tdStyle}>
                      {lang === "ar" ? admin.job_title_ar : admin.job_title_en}
                    </td>
                    <td style={tdStyle}>
                      {Array.isArray(admin.module)
                        ? admin.module.join("، ")
                        : admin.module || "-"}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        style={deleteButton}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editingStudent && (
        <form onSubmit={updateStudent} style={{ ...boxStyle, marginTop: "20px" }}>
          <h3>تعديل الطالب</h3>

          <input
            placeholder="الاسم بالعربية"
            value={editingStudent.name_ar || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, name_ar: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Name in English"
            value={editingStudent.name_en || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, name_en: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Email"
            value={editingStudent.email || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, email: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="التخصص"
            value={editingStudent.major || ""}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, major: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="المستوى"
            type="number"
            value={editingStudent.level || 1}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                level: Number(e.target.value),
              })
            }
            style={inputStyle}
          />

          <button type="submit" style={adminButton}>
            حفظ التعديل
          </button>

          <button
            type="button"
            onClick={() => setEditingStudent(null)}
            style={{ ...deleteButton, marginRight: "8px" }}
          >
            إلغاء
          </button>
        </form>
      )}
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginBottom: "10px",
  boxSizing: "border-box",
  fontFamily: "Tajawal, sans-serif",
};

const boxStyle = {
  background: "white",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ccfbf1",
};

const adminButton = {
  background: "#0f766e",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: "Tajawal, sans-serif",
};

const deleteButton = {
  background: "#e9640c",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: "Tajawal, sans-serif",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  marginTop: "10px",
};

const thStyle = {
  border: "1px solid #cbd5e1",
  padding: "10px",
  background: "#ccfbf1",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #cbd5e1",
  padding: "10px",
  textAlign: "center",
};
