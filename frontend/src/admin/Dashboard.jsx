import React from "react";
import { Search, Star, Clock, Eye, Edit, Trash2 } from "lucide-react";

const Dashboard = ({
  styles,
  searchQuery,
  setSearchQuery,
  handleSearch,
  skills,
  hoveredSkill,
  setHoveredSkill,
  filteredTests,
  hoveredCard,
  setHoveredCard,
  showComments,
  setShowComments,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
}) => {
  return (
    <>
        <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
            <Search size={20} style={styles.searchIcon} />

            <input
            type="text"
            placeholder="Nhập từ khóa bạn muốn tìm kiếm ..."
            style={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <button
            style={styles.searchButton}
            onClick={handleSearch}
            >
            Tìm kiếm
            </button>
        </div>
        </div>


      {/* 4 kỹ năng */}
      <div style={styles.skillsSection}>
        <h2 style={styles.sectionTitle}>4 Kỹ Năng TOEIC</h2>
        <div style={styles.skillsGrid}>
          {skills.map((skill) => (
            <div
              key={skill.id}
              style={{
                ...styles.skillCard,
                ...(hoveredSkill === skill.id ? styles.skillCardHover : {}),
              }}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div
                style={{
                  ...styles.skillIcon,
                  backgroundColor: skill.color,
                }}
              >
                <span style={{ fontSize: "32px" }}>{skill.icon}</span>
              </div>
              <div style={styles.skillName}>{skill.name}</div>
              <div style={styles.skillCount}>{skill.count} đề thi</div>
            </div>
          ))}
        </div>
      </div>

      {/* Đề tiêu biểu */}
      <div>
        <h2 style={styles.sectionTitle}>
          <Star
            size={24}
            color="#fbbf24"
            fill="#fbbf24"
            style={{ display: "inline", marginRight: "8px" }}
          />
          Ðề Tiêu Biểu
        </h2>

        {searchQuery && (
          <div
            style={{
              marginBottom: "20px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Tìm thấy {filteredTests.length} kết quả cho "{searchQuery}"
          </div>
        )}

        <div style={styles.testsGrid}>
          {filteredTests.map((test) => (
            <div
              key={test.id}
              style={{
                ...styles.testCard,
                ...(hoveredCard === test.id ? styles.testCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(test.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.testInfo}>
                <div style={styles.testTitle}>{test.title}</div>

                <div style={styles.testMeta}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={12} />
                    {test.duration}p
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Eye size={12} />
                    {test.views > 1000
                      ? `${(test.views / 1000).toFixed(0)}k`
                      : test.views}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  {test.parts} phần | {test.questions} câu
                </div>

                <div style={styles.testTags}>
                  <span style={{ ...styles.tag, ...styles.tagBlue }}>
                    #{test.type}
                  </span>
                  <span style={{ ...styles.tag, ...styles.tagPurple }}>
                    #{test.skill}
                  </span>
                </div>

                <div style={styles.actionButtons}>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.buttonPrimary,
                      padding: "8px 16px",
                      fontSize: "13px",
                    }}
                  >
                    Xem
                  </button>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.buttonSecondary,
                      padding: "8px",
                    }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.buttonSecondary,
                      padding: "8px",
                    }}
                  >
                    <Trash2 size={14} color="#dc2626" />
                  </button>
                </div>

                {/* Bình luận */}
                <div style={styles.commentsSection}>
                  <button
                    style={styles.commentToggle}
                    onClick={() =>
                      setShowComments(
                        showComments === test.id ? null : test.id
                      )
                    }
                  >
                    {test.comments} bình luận{" "}
                    {showComments === test.id ? "▲" : "▼"}
                  </button>

                  {showComments === test.id && (
                    <div style={styles.commentsList}>
                      {test.userComments.map((comment) => (
                        <div key={comment.id} style={styles.comment}>
                          <div style={styles.commentAvatar}>
                            {comment.avatar}
                          </div>
                          <div style={styles.commentContent}>
                            <div style={styles.commentUser}>
                              {comment.user}
                            </div>
                            <div style={styles.commentText}>
                              {comment.text}
                            </div>
                            <div style={styles.commentActions}>
                              <span style={{ cursor: "pointer" }}>
                                Thích ({comment.likes})
                              </span>
                              <span style={{ cursor: "pointer" }}>
                                Trả lời
                              </span>
                              <span
                                style={styles.deleteCommentButton}
                                onClick={() =>
                                  handleDeleteComment(test.id, comment.id)
                                }
                                onMouseEnter={(e) =>
                                  (e.target.style.backgroundColor =
                                    "#fee2e2")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.backgroundColor =
                                    "transparent")
                                }
                              >
                                Xóa
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div style={styles.commentInput}>
                        <div style={styles.commentAvatar}>👤</div>
                        <input
                          type="text"
                          placeholder="Viết bình luận..."
                          style={styles.input}
                          value={newComment[test.id] || ""}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [test.id]: e.target.value,
                            }))
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(test.id);
                            }
                          }}
                        />
                        <button
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "20px",
                            fontSize: "11px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                          onClick={() => handleAddComment(test.id)}
                        >
                          Gửi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
