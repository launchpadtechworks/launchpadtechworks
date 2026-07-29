import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ENROLLMENT_FORM_URL = "https://forms.gle/pQJJmMFLYrgxboaH6";

const courseDays = [
  { title: "Artificial Intelligence", detail: "Understand how smart systems notice patterns, make choices, and help people." },
  { title: "Data Science", detail: "Learn how raw information becomes clear answers, stories, and useful decisions." },
  { title: "Artificial Intelligence & Machine Learning", detail: "Discover how machines learn from examples and improve their predictions." },
  { title: "Python", detail: "Use beginner-friendly code to turn your ideas into something real." },
];

const learningRoad = [
  ["Day 01", "Fresh notes + quiz"],
  ["Day 02", "Fresh notes + quiz"],
  ["Day 03", "Fresh notes + quiz"],
  ["Day 04", "Fresh notes + quiz"],
  ["Day 05", "Real-life project assigned"],
  ["Days 06–12", "Build, improve, and ask questions"],
  ["Day 13", "Submit your project"],
];

function LoginScreen({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onSuccess(data.session);
  }

  return (
    <main className="login-page">
      <button className="login-back" onClick={onClose}>← Back to Launchpad</button>
      <section className="login-card">
        <p className="eyebrow">Student space</p>
        <h1>Welcome back.</h1>
        <p>Use the credentials sent to you after your registration is approved.</p>
        <form onSubmit={handleSubmit}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Checking…" : "Log in"} <span>→</span></button>
        </form>
      </section>
    </main>
  );
}

function UnlockScreen({ onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <main className="unlock-screen">
      <img src="/dashboard-unlock.webp" alt="Animation of a student breaking free from the wall" />
      <p>Your learning space is opening…</p>
    </main>
  );
}

function StudentDashboard({ session, onSignOut }) {
  const [activeDay, setActiveDay] = useState(1);
  const studentName = session.user.email?.split("@")[0] ?? "Student";
  const lessons = ["Artificial Intelligence", "Data Science", "AI & Machine Learning", "Python", "Project brief"];

  return (
    <main className="student-dashboard">
      <header className="dashboard-nav">
        <div className="dashboard-brand">Launchpad <span>Techworks</span></div>
        <div><span className="student-email">{session.user.email}</span><button onClick={onSignOut}>Log out</button></div>
      </header>
      <section className="dashboard-welcome">
        <p className="eyebrow">Student dashboard</p>
        <h1>Hey, {studentName}.<br /><em>Let&apos;s build today.</em></h1>
        <p>Pick up your notes, take today&apos;s quiz, and keep your project moving.</p>
      </section>
      <section className="dashboard-content">
        <aside className="lesson-rail" aria-label="Course days">
          {lessons.map((lesson, index) => {
            const day = index + 1;
            return <button key={lesson} className={activeDay === day ? "active" : ""} onClick={() => setActiveDay(day)}><span>Day {String(day).padStart(2, "0")}</span>{lesson}</button>;
          })}
        </aside>
        <article className="lesson-panel">
          <span className="lesson-kicker">Day {String(activeDay).padStart(2, "0")} · {lessons[activeDay - 1]}</span>
          <h2>{activeDay === 5 ? "Your real-life project" : "Today’s learning space"}</h2>
          <p>{activeDay === 5 ? "Your project brief will appear here. Use the next days to build, test, and prepare it for submission." : "Your notes and quiz will appear here once your instructor publishes this lesson."}</p>
          <div className="lesson-actions">
            <button className="primary-action">Open notes</button>
            <button className="secondary-action">Take quiz</button>
          </div>
        </article>
      </section>
    </main>
  );
}

function CoursePage({ onBack }) {
  const [questionSent, setQuestionSent] = useState(false);
  const [openDomain, setOpenDomain] = useState(null);

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  return (
    <main className="course-page">
      <header className="course-nav">
        <button className="brand-button" onClick={onBack}>Launchpad <span>Techworks</span></button>
        <a href="#questions" className="nav-question">Questions first</a>
      </header>

      <section className="course-hero" id="overview">
        <p className="eyebrow">Your starting line</p>
        <h1>Build the basics.<br /><em>Then take off.</em></h1>
        <p>Clear lessons that turn syllabus stress into strong basics and small wins you can feel.</p>
        <div className="student-orbit" aria-label="Students learning with technology">
          <img className="orbit-photo orbit-photo-main" src="/student-laptop.webp" alt="Student learning on a laptop" />
          <img className="orbit-photo orbit-photo-code" src="/student-code.webp" alt="Student coding on a laptop" />
          <img className="orbit-photo orbit-photo-study" src="/student-study.webp" alt="Student studying with headphones" />
        </div>
        <a className="enroll-button" href={ENROLLMENT_FORM_URL} target="_blank" rel="noreferrer">
          Enroll Now <span aria-hidden="true">↗</span>
        </a>
        <a href="#roadmap" className="scroll-cue">Explore the course <span>↓</span></a>
      </section>

      <section className="course-section" id="roadmap">
        <div className="section-heading">
          <p className="eyebrow">The roadmap</p>
          <h2>Strong basics. No fog.</h2>
          <p>Start from zero, ask why, and leave each session knowing exactly what clicked.</p>
        </div>
        <div className="day-grid">
          {courseDays.map(({ title, detail }) => {
            const isOpen = openDomain === title;
            return (
              <article className={`day-card ${isOpen ? "is-open" : ""}`} key={title}>
                <button
                  className="domain-toggle"
                  onClick={() => setOpenDomain(isOpen ? null : title)}
                  aria-expanded={isOpen}
                >
                  <span className="day-number">{title}</span>
                  <span className="card-arrow" aria-hidden="true">+</span>
                </button>
                <div className="domain-details">
                  <p className="domain-intro">{detail}</p>
                  <div className="road-title">Your learning road</div>
                  <ol className="learning-road">
                    {learningRoad.map(([day, activity], index) => (
                      <li className={index >= 4 ? "project-step" : ""} key={day}>
                        <span className="road-dot">{index === 4 ? "★" : index === 6 ? "✓" : index + 1}</span>
                        <div><strong>{day}</strong><span>{activity}</span></div>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="course-section outcomes-section">
        <div className="outcome-card">
          <p className="eyebrow">By the end</p>
          <h2>You won&apos;t just memorise.<br />You&apos;ll <span>understand.</span></h2>
          <ul>
            <li>A clear mental map of the fundamentals</li>
            <li>Simple ways to explain tricky ideas</li>
            <li>A first project you can be proud of</li>
          </ul>
        </div>
      </section>

      <section className="course-section faq-section" id="questions">
        <div className="section-heading">
          <p className="eyebrow">Ask before you jump</p>
          <h2>Nothing should feel unclear.</h2>
          <p>Take a look at the usual questions. If yours is different, write it down below.</p>
        </div>
        <div className="faq-list">
          <details open>
            <summary>Is this beginner friendly?<span>+</span></summary>
            <p>Yes. This is built to make the foundations feel simple before the pace picks up.</p>
          </details>
          <details>
            <summary>Do I need to know coding first?<span>+</span></summary>
            <p>No. We start with the ideas first, then connect them to the tools step by step.</p>
          </details>
          <details>
            <summary>What if I get stuck?<span>+</span></summary>
            <p>Ask early. The course is designed around small checkpoints, so you never have to guess alone.</p>
          </details>
        </div>
        <form className="question-form" onSubmit={(event) => { event.preventDefault(); setQuestionSent(true); }}>
          <label htmlFor="student-question">Still have a question?</label>
          <div className="question-row">
            <input id="student-question" name="question" required placeholder="Type it here — there are no silly questions." />
            <button type="submit">Ask us <span>→</span></button>
          </div>
          {questionSent && <p className="form-note">Your question is ready. Send us your question-form link and we&apos;ll connect this box to your team inbox.</p>}
        </form>
      </section>

      <footer className="course-footer">
        <button className="back-to-start" onClick={onBack}>← Back to the start</button>
        <p>Strong roots. Bigger ideas.</p>
      </footer>
    </main>
  );
}

export default function LaunchpadDashboard() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIsRevealed(true), 3000);
    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setIsUnlocking(false);
  }

  if (session) {
    return isUnlocking
      ? <UnlockScreen onDone={() => setIsUnlocking(false)} />
      : <StudentDashboard session={session} onSignOut={handleSignOut} />;
  }

  if (showLogin) return <LoginScreen onClose={() => setShowLogin(false)} onSuccess={(nextSession) => { setIsUnlocking(true); setSession(nextSession); }} />;

  if (showCourses) return <CoursePage onBack={() => setShowCourses(false)} />;

  return (
    <main className={`landing-page ${isRevealed ? "is-revealed" : ""}`}>
      <picture className="wall-picture">
        <source srcSet="/syllabus-wall.webp" type="image/webp" />
        <img className="wall-animation" src="/syllabus-wall.gif" alt="" aria-hidden="true" fetchPriority="high" />
      </picture>
      <div className="hero-shade" aria-hidden="true" />

      <section className="hero-content" aria-labelledby="hero-heading">
        <p className="eyebrow">Launchpad Techworks</p>
        <h1 id="hero-heading">Don&apos;t let the syllabus<br />take you down.</h1>
        <p className="subheadline">Get your basics clear first. Build <span>strong roots.</span></p>
      </section>

      <button className="start-button" onClick={() => setShowCourses(true)}>
        Start Now <span aria-hidden="true">↗</span>
      </button>
      <button className="login-link" onClick={() => setShowLogin(true)}>Student login</button>
      <p className="intro-label" aria-hidden="true">A better way in starts here.</p>
    </main>
  );
}
