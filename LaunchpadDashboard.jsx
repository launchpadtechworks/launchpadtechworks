import { useEffect, useState } from "react";

const courseDays = [
  ["Week 01", "Meet Your AI Toolkit", "Get comfortable with the tools, language, and learning flow before you build."],
  ["Week 01", "Teach a Car to Make Decisions", "See how data, patterns, and choices turn into real machine learning."],
  ["Week 02", "Search Like a Machine", "Learn the core ideas that help computers find useful answers."],
  ["Week 02", "Classify Anything", "Turn what you have learned into a small, confident first project."],
];

function CoursePage({ onBack }) {
  const [questionSent, setQuestionSent] = useState(false);

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
        <p>In two focused weeks, turn syllabus stress into strong basics and small wins you can feel.</p>
        <div className="program-chip">2 weeks <span>•</span> Stronger basics <span>•</span> Start from zero</div>
        <div className="student-orbit" aria-label="Students learning with technology">
          <img className="orbit-photo orbit-photo-main" src="/student-laptop.webp" alt="Student learning on a laptop" />
          <img className="orbit-photo orbit-photo-code" src="/student-code.webp" alt="Student coding on a laptop" />
          <img className="orbit-photo orbit-photo-study" src="/student-study.webp" alt="Student studying with headphones" />
        </div>
        <a href="#roadmap" className="scroll-cue">Explore the course <span>↓</span></a>
      </section>

      <section className="course-section" id="roadmap">
        <div className="section-heading">
          <p className="eyebrow">The roadmap</p>
          <h2>Two weeks. No fog.</h2>
          <p>Start from zero, ask why, and leave each session knowing exactly what clicked.</p>
        </div>
        <div className="day-grid">
          {courseDays.map(([day, title, detail]) => (
            <article className="day-card" key={day}>
              <span className="day-number">{day}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
              <span className="card-arrow" aria-hidden="true">↘</span>
            </article>
          ))}
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

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIsRevealed(true), 3000);
    return () => window.clearTimeout(introTimer);
  }, []);

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
      <p className="intro-label" aria-hidden="true">A better way in starts here.</p>
    </main>
  );
}
