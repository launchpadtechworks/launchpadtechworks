import { useEffect, useState } from "react";

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
