export default function DeanMessage({ lang, cardStyle }) {
  return (
    <section style={{ ...cardStyle, marginBottom: "24px" }}>
      <h2 style={{ marginTop: 0 }}>
        {lang === "ar" ? "كلمة العميد" : "Dean Message"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
        }}
      >
        {/* صورة العميد */}
        <img
          src="/dean.jpg"
          alt="Dean"
          style={{
            width: "60%",
            maxWidth: "200px",
            margin: "0 auto",
            height: "auto",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />

        {/* النص */}
        <div
  style={{
    lineHeight: 1.8,
    fontSize: "15px",
    color: "#334155",
    fontWeight: "bold", // 👈 هذا المهم
    textAlign: "center",   // 👈 هذا المهم
    maxWidth: "800px",
    margin: "0 auto",
  }}
>
          {lang === "ar" ? (
            <>
              <p>
                الحمد لله رب العالمين، والصلاة والسلام على أشرف الأنبياء
                والمرسلين سيدنا محمد وعلى آله وصحبه أجمعين، أما بعد:
              </p>

              <p>
                فإنه يسعدني ويطيب لي أن أرحب بالسادة أعضاء هيئة التدريس من
                منسوبي الكلية الجامعية في تيماء، والذين لهم الدور الفعال في
                مسيرة النهوض والتطوير بالكلية على كافة المستويات.
              </p>

              <p>
                وتعمل الكلية دوماً على إعداد طلابها وطالباتها ليكونوا على مستوى
                عالٍ من جودة الأداء للعمل بكفاءة وفعالية، كما تسعى إلى إيجاد
                جسور من التواصل بين الكلية وجميع المهتمين بالعلم والتعلم.
              </p>

              <p>
                كما تحرص الكلية الجامعية بتيماء على الرقي بمهارات وقدرات جميع
                منسوبيها، وصولاً إلى أعلى معايير الجودة الأكاديمية والبحث العلمي
                بدعم من إدارة الجامعة.
              </p>

              <p>
                وتسعى الكلية كذلك إلى استقطاب الكوادر العلمية ذات الخبرات
                العالية، وتوفير جميع الإمكانيات اللازمة التي تسهم في تطوير
                العملية التعليمية.
              </p>

              <p>
                كما تبنت الجامعة برامج أكاديمية مرتبطة ارتباطاً مباشراً بسوق
                العمل، وحاجة الوطن إلى الكوادر المتخصصة في مجالات العلوم
                الإنسانية والاجتماعية والعلمية، وذلك في إطار تحقيق رؤية المملكة
                العربية السعودية 2030.
              </p>

              <p>
                وفي الختام، أشكر الله عز وجل أن جعلني وإياكم من المشتغلين بالعلم
                والساعين لتحقيق المصلحة العامة وخدمة المجتمع في مملكتنا الحبيبة.
              </p>

              <div
  style={{
    textAlign: "center",
    marginTop: "20px",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#0f172a",
  }}
>
  {lang === "ar"
    ? "عميد الكلية الجامعية بتيماء: الأستاذ الدكتور / عواد بن بايق الشمري"
    : "Dean of Tayma University College: Prof. Prof. Awwad bin Bayeq Al-Shammari"}
</div>
            </>
          ) : (
            <>
              <p>
                All praise is due to Allah, Lord of the worlds, and peace and
                blessings be upon the noblest of Prophets and Messengers,
                Prophet Muhammad, his family, and all his companions.
              </p>

              <p>
                It gives me great pleasure to welcome the distinguished faculty
                members of Tayma University College, who play a vital role in
                the development and advancement of the college at all levels.
              </p>

              <p>
                The college continuously strives to prepare its students to
                achieve a high level of performance, enabling them to work
                efficiently and effectively. It also seeks to build strong
                bridges of communication with all those interested in education
                and knowledge.
              </p>

              <p>
                Tayma University College is committed to enhancing the skills
                and capabilities of its members, aiming to achieve the highest
                standards of academic quality and scientific research, with the
                support of the university administration.
              </p>

              <p>
                The college also focuses on attracting highly qualified academic
                staff and providing them with all necessary resources to support
                the educational process.
              </p>

              <p>
                Furthermore, the university adopts academic programs that are
                directly aligned with labor market needs and the Kingdom’s
                demand for specialized professionals in humanities, social, and
                scientific fields, in line with Saudi Vision 2030.
              </p>

              <p>
                In conclusion, I thank Allah for granting us the opportunity to
                contribute to knowledge and serve our beloved nation and society.
              </p>

     <strong
  style={{
    fontSize: "20px",   // 👈 حجم الخط
    fontWeight: "700",  // 👈 بولد (تقدري تخليها 800 أو 800)
    display: "block",   // 👈 يخليه في سطر مستقل
    marginTop: "15px",  // 👈 مسافة فوق
  }}
>
  Prof. Dean of Tayma University College: Prof. Awwad bin Bayeq Al-Shammari
</strong>
            </>
          )}
        </div>
      </div>
    </section>
  );
}