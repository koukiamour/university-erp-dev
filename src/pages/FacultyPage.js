export default function FacultyPage({ lang }) {
  const faculty = [
    { name_ar: "بندر طلال جمعه محلاوي", name_en: "Bandar Talal Jumah Mahllawi" },
    { name_ar: "منى اسماعيل محمد شاهين", name_en: "Mona Ismail Mohamed Shahin" },
    { name_ar: "نادي عواد حصين الحربي", name_en: "Nadi Awwad Husain Alharbi" },
    { name_ar: "بسام سالم عبدالسلام أبو كركي", name_en: "Bassam Salim Abdel Salam Abu Karaki" },
    { name_ar: "حسن ناجع محمد العجمي", name_en: "Hassan Najea Mohammed Alajmi" },
    { name_ar: "سلمان سعود مسلم البلوي", name_en: "Salman Saud Muslim Albalawi" },
    { name_ar: "عواد بايق عماش الشمري", name_en: "Awwad Bayeq Ammash Alshammari" },
    { name_ar: "فاطمه عبدالتواب قاسم محمد", name_en: "Fatima Abdel Tawab Qasim Mohammed" },
    { name_ar: "محمد عبدالرحمن سلامه الرفاعي", name_en: "Mohammed Abdulrahman Salama Alrefai" },
    { name_ar: "اميمه عبدالله هارون احمد", name_en: "Omaima Abdalla Haroun Ahmed" },
    { name_ar: "اكرام عبد الرؤوف عباس", name_en: "Ekram Abdel Raouf Abbas" },
    { name_ar: "المنصف محمد الغريبي", name_en: "Elmoncef Mohamed Salah Elghribi" },
    { name_ar: "اماني عبدالله السيد ابن عوف", name_en: "Amani Abdalla Elsseied Ebnaoof" },
    { name_ar: "حنان محجوب حمد محمد", name_en: "Hanan Mahgoub Hamed Mohammed" },
    { name_ar: "خالد خليف حمود الشمري", name_en: "Khaled Khulaif Hamoud Alshammari" },
    { name_ar: "خالد لطفي عبد العال محمد", name_en: "Khaled Lotfy Abdel Aal Mohammed" },
    { name_ar: "خالد منور عزاب العنزي", name_en: "Khalid Menwer A Alanazi" },
    { name_ar: "راكان محمد عبيدالله العبري", name_en: "Rakan Mohammed Obaidullah Alabri" },
    { name_ar: "روضه بلال عمر المولد", name_en: "Rawdhah Belal Omar Almuwallad" },
    { name_ar: "عامر عبد الله من الله الأمين", name_en: "Amir Abdalla Minalla Alamein" },
    { name_ar: "عايض فليح عايض الحربي", name_en: "Ayed Faleh Ayed Alharbi" },
    { name_ar: "عبير صالح حمود التيماني", name_en: "Abeer Saleh Humoud Altaymani" },
    { name_ar: "عثمان احمد عبدالله محمد", name_en: "Othman Ahmed Abdullah Mohammed" },
    { name_ar: "فاروق محمد عماري", name_en: "Farouk Mohammed Ammari" },
    { name_ar: "فاطمة عبدالله الطيب الماحي", name_en: "Fatima Abdallah Altayeb Almahi" },
    { name_ar: "كريمه محمد عبدالله العبسي", name_en: "Karima Mohammed Abdullah Alabsi" },
    { name_ar: "مهاء فرحان دليمان الشراري", name_en: "Maha Farhan Daliman Alsharari" },
    { name_ar: "نايف حمود هليل الشمري", name_en: "Naif Hamoud Halil Alshammari" },
    { name_ar: "وصال يوسف علي فرج", name_en: "Wesal Yousif Ali Faraj" },
    { name_ar: "اروى سعد شحاده المومني", name_en: "Arwa Saad Shahada Almomani" },
    { name_ar: "ايمان عبدالله فهد العيسى", name_en: "Eman Abdullah Fahd Alessa" },
    { name_ar: "راويه ادم عمر الهوساوي", name_en: "Rawiah Adem Omar Alhawsawy" },
    { name_ar: "فهد محمد عيد العطوي", name_en: "Fahad Mohammed Eid Alatwi" },
    { name_ar: "مريم مهنا رشيد السعدون", name_en: "Marim Mahna Rashid Alsadun" },
    { name_ar: "احمد فضل الله كرم الله البلوشي", name_en: "Ahmed Fadlallah Karamallah Albaloshi" },
    { name_ar: "اسماء عبدالله فهد العيسى", name_en: "Asmaa Abdullah Fahd Alessa" },
    { name_ar: "أسماء مرعي سلطان الحسن", name_en: "Asma Marrei Saltan Alhassan" },
    { name_ar: "آلاء علي مبارك البلوي", name_en: "Alaa Ali Mubarak Albalawi" },
    { name_ar: "جواهر لافي الامعط العنزي", name_en: "Jawaher Lafi Alanazi" },
    { name_ar: "خالد رجاء لافي العنزي", name_en: "Khaled Rajaa Alanazi" },
    { name_ar: "خلود عبدالله علي العيادي", name_en: "Kholoud Abdullah Ali Alayadi" },
    { name_ar: "رازان فيصل كاتب الفقير", name_en: "Razan Faisal Katib Alfageer" },
    { name_ar: "منار عبدالله محمد الشهري", name_en: "Manar Abdullah Mohammed Alshahri" },
    { name_ar: "منيفه ناصر غالب الفقير", name_en: "Muneefah Nasir Ghalib Alfakheer" },
    { name_ar: "سالم مسفر ابراهيم القحطاني", name_en: "Salem Mesfer Ibrahim Alqahtani" },
    { name_ar: "فيصل طلال عيد شامان", name_en: "Faisal Talal Eid Shaman" },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        {lang === "ar" ? "أعضاء هيئة التدريس" : "Faculty Members"}
      </h2>

      <div
  style={{
    marginTop: "20px",
    maxHeight: "65vh",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
  }}
>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "16px",
    }}
  >
    <thead>
      <tr style={{ background: "#0f766e", color: "white" }}>
        <th style={{ padding: "12px", width: "70px" }}>
          {lang === "ar" ? "م" : "No."}
        </th>
        <th style={{ padding: "12px", textAlign: "center" }}>
          {lang === "ar" ? "اسم عضو هيئة التدريس" : "Faculty Member Name"}
        </th>
      </tr>
    </thead>

    <tbody>
      {faculty.map((m, i) => (
        <tr
  key={i}
  onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f2fe")}
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = i % 2 === 0 ? "#f8fafc" : "white")
  }
  style={{
    background: i % 2 === 0 ? "#f8fafc" : "white",
    borderBottom: "1px solid #e5e7eb",
  }}
>
          <td
            style={{
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#0f766e",
            }}
          >
            {i + 1}
          </td>

          <td
            style={{
              padding: "10px 16px",
              textAlign: lang === "ar" ? "right" : "left",
              fontWeight: "500",
            }}
          >
            {lang === "ar" ? m.name_ar : m.name_en}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}