import React from "react";

const ExamResult = () => {
  return (
    <div style={styles.page}>
      {/* TOP BUTTONS */}
      <div style={styles.topButtons}>
        <button style={styles.button}>
          ← Về trang chủ
        </button>

        <button style={styles.button}>
          ↻ Làm lại
        </button>
      </div>

      {/* MAIN CARD */}
      <div style={styles.mainCard}>
        {/* HEADER */}
        <div style={styles.header}>
          {/* DATE */}
          <div style={styles.dateBox}>
            ⏰ 11/05/2026 • 05:17
          </div>

          <h1 style={styles.title}>vit</h1>
        </div>

        {/* TOP GRID */}
        <div style={styles.topGrid}>
          {/* LEFT CARD */}
          <div style={styles.motivationCard}>
            <div style={styles.icon}>🏆</div>

            <h2 style={styles.motivationTitle}>
              Cần cố gắng 📚
            </h2>

            <p style={styles.motivationText}>
              Hãy luyện tập thêm nhé.
            </p>
          </div>

          {/* RESULT */}
          <div style={styles.resultCard}>
            <div style={styles.resultIcon}>
              🎯
            </div>

            <h2 style={styles.resultScore}>
              0/1
            </h2>

            <p style={styles.resultPercent}>
              0%
            </p>

            <span style={styles.resultLabel}>
              Kết quả bài làm
            </span>
          </div>

          {/* RIGHT STATS */}
          <div style={styles.statsGrid}>
            <div
              style={{
                ...styles.smallCard,
                ...styles.blueCard,
              }}
            >
              <div style={styles.smallTitle}>
                ⏱ Thời gian
              </div>

              <div style={styles.smallValue}>
                00:00
              </div>
            </div>

            <div
              style={{
                ...styles.smallCard,
                ...styles.orangeCard,
              }}
            >
              <div style={styles.smallTitle}>
                🎯 Tổng câu
              </div>

              <div style={styles.smallValue}>
                1
              </div>
            </div>

            <div
              style={{
                ...styles.smallCard,
                ...styles.purpleCard,
              }}
            >
              <div style={styles.smallTitle}>
                🔥 Hiệu suất
              </div>

              <div
                style={{
                  ...styles.smallValue,
                  fontSize: "22px",
                }}
              >
                Cần cải thiện
              </div>
            </div>

            <div
              style={{
                ...styles.smallCard,
                ...styles.lightCard,
              }}
            >
              <div style={styles.smallTitle}>
                ❌ Sai
              </div>

              <div style={styles.smallValue}>
                1
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* ANSWER SECTION */}
        <div style={styles.answerSection}>
          <div style={styles.answerHeader}>
            📘 Chi tiết đáp án
          </div>

          {/* QUESTION */}
          <div style={styles.questionBox}>
            {/* LEFT */}
            <div style={styles.questionLeft}>
              <div style={styles.questionInfo}>
                <div style={styles.questionNumber}>
                  1
                </div>

                <div>
                  <h3 style={styles.questionTitle}>
                    Câu hỏi đọc hiểu
                  </h3>

                  <p style={styles.questionSub}>
                    Đáp án đúng: B
                  </p>
                </div>
              </div>

              {/* OPTIONS */}
              <div style={styles.option}>
                <div style={styles.optionLetter}>
                  A
                </div>

                <span>Lựa chọn A</span>
              </div>

              <div
                style={{
                  ...styles.option,
                  ...styles.correctOption,
                }}
              >
                <div style={styles.optionLetter}>
                  B
                </div>

                <span>
                  Lựa chọn B (Đúng)
                </span>
              </div>

              <div style={styles.option}>
                <div style={styles.optionLetter}>
                  C
                </div>

                <span>Lựa chọn C</span>
              </div>

              <div style={styles.option}>
                <div style={styles.optionLetter}>
                  D
                </div>

                <span>Lựa chọn D</span>
              </div>
            </div>

            {/* RIGHT */}
            <div style={styles.explainBox}>
              <h3 style={styles.explainTitle}>
                💡 Giải thích
              </h3>

              <p style={styles.explainText}>
                Đáp án B là đáp án chính xác vì
                nội dung trong đoạn văn đã nhấn
                mạnh ý nghĩa của lựa chọn này.
              </p>

              <br />

              <p style={styles.explainText}>
                Dựa trên thông tin được cung cấp,
                ta có thể xác định rằng đáp án B
                phù hợp nhất với yêu cầu câu hỏi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg,#4b6bff 0%, #6d42c8 50%, #e84393 100%)",
    fontFamily: "Inter, sans-serif",
    color: "white",
  },

  /* BUTTONS */

  topButtons: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },

  button: {
    border: "none",
    padding: "14px 26px",
    borderRadius: "18px",
    fontSize: "17px",
    fontWeight: "700",
    color: "white",
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#a64dff,#ff4fa3)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  },

  /* MAIN */

  mainCard: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    borderRadius: "35px",
    padding: "30px",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  /* HEADER */

  header: {
    position: "relative",
    textAlign: "center",
    marginBottom: "30px",
  },

  dateBox: {
    position: "absolute",
    top: "0",
    right: "0",
    background: "rgba(255,255,255,0.12)",
    padding: "10px 18px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: "60px",
    fontWeight: "800",
  },

  /* GRID */

  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: "22px",
    marginBottom: "30px",
  },

  /* LEFT */

  motivationCard: {
    background:
      "linear-gradient(135deg,#8e44ff,#ff4fa3)",
    borderRadius: "28px",
    padding: "28px",
    minHeight: "240px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.14)",
  },

  icon: {
    fontSize: "58px",
    marginBottom: "20px",
  },

  motivationTitle: {
    fontSize: "44px",
    marginBottom: "12px",
  },

  motivationText: {
    fontSize: "22px",
    opacity: 0.95,
  },

  /* RESULT */

  resultCard: {
    background: "#fff0f2",
    border: "3px solid #ff5c77",
    borderRadius: "28px",
    minHeight: "240px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff2d55",
  },

  resultIcon: {
    fontSize: "55px",
    marginBottom: "10px",
  },

  resultScore: {
    fontSize: "82px",
    lineHeight: 1,
    marginBottom: "8px",
  },

  resultPercent: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  resultLabel: {
    fontSize: "22px",
    fontWeight: "600",
  },

  /* STATS */

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  smallCard: {
    borderRadius: "24px",
    padding: "20px",
    minHeight: "110px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
  },

  blueCard: {
    background:
      "linear-gradient(135deg,#42a5ff,#2962ff)",
  },

  orangeCard: {
    background:
      "linear-gradient(135deg,#ffb300,#ff7b00)",
  },

  purpleCard: {
    background:
      "linear-gradient(135deg,#8e44ff,#c86cff)",
  },

  lightCard: {
    background: "rgba(255,255,255,0.14)",
  },

  smallTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  smallValue: {
    fontSize: "34px",
    fontWeight: "800",
  },

  /* ANSWER */

  answerSection: {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "30px",
    padding: "28px",
  },

  answerHeader: {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "24px",
  },

  questionBox: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "22px",
  },

  questionLeft: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "24px",
  },

  questionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },

  questionNumber: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#16c95f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: "800",
  },

  questionTitle: {
    fontSize: "28px",
    marginBottom: "5px",
  },

  questionSub: {
    fontSize: "18px",
    opacity: 0.9,
  },

  /* OPTIONS */

  option: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "14px",
    fontSize: "20px",
  },

  correctOption: {
    background: "#dff7e8",
    color: "#16a34a",
    fontWeight: "700",
  },

  optionLetter: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "white",
    color: "#444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  /* EXPLAIN */

  explainBox: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "26px",
  },

  explainTitle: {
    fontSize: "30px",
    marginBottom: "18px",
  },

  explainText: {
    fontSize: "20px",
    lineHeight: 1.8,
    opacity: 0.95,
  },
};

export default ExamResult;
