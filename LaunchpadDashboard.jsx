import React, { useState } from "react";
import { Lock, CheckCircle2, ExternalLink, Flame, Trophy, Star, BookOpen, ChevronDown, Award } from "lucide-react";

// --- Design tokens (see design plan) ---
const COLORS = {
  cream: "#FFF6E9",
  card: "#FFFDF8",
  gold: "#F5A623",
  goldDark: "#B5730A",
  coral: "#FF6F5A",
  coralDark: "#B23B26",
  mint: "#4CAF87",
  mintDark: "#276B4E",
  tan: "#C9BFAE",
  tanDark: "#8A8070",
  charcoal: "#2E2418",
  charcoalSoft: "#6B5D4C",
};

// --- Mock data: in production this comes from Supabase (days + unlock rule evaluated server-side) ---
const initialDays = [
  {
    day: 1,
    title: "Meet Your AI Toolkit",
    phase: "Foundation",
    status: "complete",
    notesUrl: "https://notion.so/launchpad/day-1-notes",
    quizScore: 90,
    xpEarned: 100,
  },
  {
    day: 2,
    title: "Teach a Car to Make Decisions",
    phase: "Foundation",
    status: "available",
    notesUrl: "https://notion.so/launchpad/day-2-notes",
    quizScore: null,
    xpEarned: 0,
  },
  {
    day: 3,
    title: "Search Like a Machine",
    phase: "Foundation",
    status: "locked",
    notesUrl: null,
    quizScore: null,
    xpEarned: 0,
  },
  {
    day: 4,
    title: "Classify Anything",
    phase: "Foundation",
    status: "locked",
    notesUrl: null,
    quizScore: null,
    xpEarned: 0,
  },
];

const UNLOCK_THRESHOLD = 70;

function StatusPill({ status }) {
  const map = {
    complete: { bg: COLORS.mint, fg: COLORS.mintDark, label: "Complete", icon: CheckCircle2 },
    available: { bg: COLORS.gold, fg: COLORS.goldDark, label: "Available", icon: Star },
    locked: { bg: COLORS.tan, fg: COLORS.tanDark, label: "Locked", icon: Lock },
  };
  const { bg, fg, label, icon: Icon } = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: `${bg}33`,
        color: fg,
        fontWeight: 700,
        fontSize: 13,
        padding: "4px 12px",
        borderRadius: 999,
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Icon size={14} />
      {label}
    </span>
  );
}

function DayNode({ dayData, isOpen, onToggle }) {
  const { day, title, status, notesUrl, quizScore, xpEarned } = dayData;

  const nodeColor =
    status === "complete" ? COLORS.mint : status === "available" ? COLORS.gold : COLORS.tan;
  const nodeTextColor =
    status === "complete" ? "#fff" : status === "available" ? "#fff" : COLORS.tanDark;

  return (
    <div style={{ position: "relative", paddingLeft: 64, marginBottom: 20 }}>
      {/* Trail node */}
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: nodeColor,
          color: nodeTextColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Baloo 2, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          cursor: "pointer",
          boxShadow: status === "available" ? `0 0 0 4px ${COLORS.gold}33` : "none",
          border: status === "locked" ? `2px dashed ${COLORS.tanDark}55` : "none",
        }}
      >
        {status === "locked" ? <Lock size={18} /> : day}
      </div>

      {/* Mission card */}
      <div
        style={{
          background: COLORS.card,
          borderRadius: 18,
          border: `1px solid ${COLORS.tan}55`,
          overflow: "hidden",
          opacity: status === "locked" ? 0.65 : 1,
        }}
      >
        <div
          onClick={onToggle}
          role="button"
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            cursor: "pointer",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.charcoalSoft,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 2,
              }}
            >
              Day {day} &middot; {dayData.phase}
            </div>
            <div
              style={{
                fontFamily: "Baloo 2, sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: COLORS.charcoal,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusPill status={status} />
            {status !== "locked" && (
              <ChevronDown
                size={18}
                color={COLORS.charcoalSoft}
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            )}
          </div>
        </div>

        {isOpen && status !== "locked" && (
          <div
            style={{
              padding: "0 20px 20px",
              borderTop: `1px solid ${COLORS.tan}33`,
              paddingTop: 16,
              fontFamily: "Nunito, sans-serif",
            }}
          >
            {/* Notes link */}
            <a
              href={notesUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: `${COLORS.gold}18`,
                borderRadius: 12,
                color: COLORS.goldDark,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                marginBottom: 12,
              }}
            >
              <BookOpen size={16} />
              Open Day {day} notes
              <ExternalLink size={14} style={{ marginLeft: "auto" }} />
            </a>

            {/* Quiz / score row */}
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  background: COLORS.cream,
                  borderRadius: 12,
                  padding: "10px 14px",
                }}
              >
                <div style={{ fontSize: 12, color: COLORS.charcoalSoft, fontWeight: 700 }}>
                  Quiz score
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: "Baloo 2, sans-serif",
                    fontWeight: 700,
                    color: quizScore == null ? COLORS.tanDark : COLORS.charcoal,
                  }}
                >
                  {quizScore == null ? "Not taken" : `${quizScore}%`}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: COLORS.cream,
                  borderRadius: 12,
                  padding: "10px 14px",
                }}
              >
                <div style={{ fontSize: 12, color: COLORS.charcoalSoft, fontWeight: 700 }}>
                  XP earned
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: "Baloo 2, sans-serif",
                    fontWeight: 700,
                    color: COLORS.charcoal,
                  }}
                >
                  +{xpEarned}
                </div>
              </div>
            </div>

            {status === "available" && quizScore == null && (
              <button
                style={{
                  marginTop: 14,
                  width: "100%",
                  background: COLORS.coral,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 0",
                  fontFamily: "Baloo 2, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Start quiz
              </button>
            )}

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: COLORS.charcoalSoft,
              }}
            >
              Score {UNLOCK_THRESHOLD}%+ to unlock Day {day + 1} automatically.
            </div>
          </div>
        )}

        {status === "locked" && (
          <div
            style={{
              padding: "0 20px 16px",
              fontFamily: "Nunito, sans-serif",
              fontSize: 13,
              color: COLORS.tanDark,
              fontWeight: 700,
            }}
          >
            Complete Day {day - 1} with {UNLOCK_THRESHOLD}%+ to unlock.
          </div>
        )}
      </div>
    </div>
  );
}

export default function LaunchpadDashboard() {
  const [days] = useState(initialDays);
  const [openDay, setOpenDay] = useState(2);

  const completedCount = days.filter((d) => d.status === "complete").length;
  const totalXp = days.reduce((sum, d) => sum + d.xpEarned, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, #FFFDF8 100%)`,
        padding: "32px 20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: COLORS.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "Baloo 2, sans-serif",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              AR
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Baloo 2, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.charcoal,
                }}
              >
                Amber's AI Launchpad
              </div>
              <div style={{ fontSize: 13, color: COLORS.charcoalSoft, fontWeight: 700 }}>
                {completedCount} of {days.length} days complete
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${COLORS.coral}18`,
                color: COLORS.coralDark,
                fontWeight: 800,
                fontSize: 14,
                padding: "8px 14px",
                borderRadius: 999,
              }}
            >
              <Flame size={16} />
              {completedCount} day streak
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${COLORS.gold}18`,
                color: COLORS.goldDark,
                fontWeight: 800,
                fontSize: 14,
                padding: "8px 14px",
                borderRadius: 999,
              }}
            >
              <Trophy size={16} />
              {totalXp} XP
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: `${COLORS.tan}44`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(completedCount / days.length) * 100}%`,
                background: `linear-gradient(90deg, ${COLORS.mint}, ${COLORS.gold})`,
                borderRadius: 999,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Mission trail */}
        <div style={{ position: "relative" }}>
          {days.map((d, i) => (
            <div key={d.day} style={{ position: "relative" }}>
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 23,
                    top: -20,
                    width: 2,
                    height: 20,
                    background: `${COLORS.tan}88`,
                  }}
                />
              )}
              <DayNode
                dayData={d}
                isOpen={openDay === d.day}
                onToggle={() => setOpenDay(openDay === d.day ? null : d.day)}
              />
            </div>
          ))}
        </div>

        {/* Certificate teaser */}
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            background: `${COLORS.tan}22`,
            borderRadius: 16,
            border: `1px dashed ${COLORS.tanDark}55`,
          }}
        >
          <Award size={22} color={COLORS.tanDark} />
          <div style={{ fontSize: 13, color: COLORS.charcoalSoft, fontWeight: 700 }}>
            Complete all {days.length} days and the final project to earn your verified
            certificate.
          </div>
        </div>
      </div>
    </div>
  );
}
