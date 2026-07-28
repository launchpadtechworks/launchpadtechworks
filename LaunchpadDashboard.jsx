import { useEffect, useRef, useState } from "react";

// Replace this with the Google Form URL when it is ready.
const GOOGLE_FORM_URL = "https://forms.gle/PASTE_YOUR_FORM_ID_HERE";

export default function LaunchpadDashboard() {
  const [isRevealed, setIsRevealed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const revealFallback = window.setTimeout(() => setIsRevealed(true), 3400);
    videoRef.current?.play().catch(() => setIsRevealed(true));

    return () => window.clearTimeout(revealFallback);
  }, []);

  return (
    <main className={`landing-page ${isRevealed ? "is-revealed" : ""}`}>
      <video
        ref={videoRef}
        className="wall-animation"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIsRevealed(true)}
        aria-label="Illustration of a person hiding in a red brick wall"
      >
        <source src="/syllabus-wall.mp4" type="video/mp4" />
      </video>

      <div className="hero-shade" aria-hidden="true" />

      <section className="hero-content" aria-labelledby="hero-heading">
        <p className="eyebrow">Launchpad Techworks</p>
        <h1 id="hero-heading">
          Don&apos;t let the syllabus<br />
          take you down.
        </h1>
        <p className="subheadline">
          Get your basics clear first. Build <span>strong roots.</span>
        </p>
      </section>

      <a
        className="start-button"
        href={GOOGLE_FORM_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Start now — opens the registration form in a new tab"
      >
        Start Now <span aria-hidden="true">↗</span>
      </a>

      <p className="intro-label" aria-hidden="true">A better way in starts here.</p>
    </main>
  );
}
