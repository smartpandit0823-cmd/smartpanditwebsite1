"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

type LaunchPhase = "countdown" | "flash" | "curtain" | "done";

const START_COUNT = 10;

export function LaunchOverlay() {
  const [count, setCount] = useState(START_COUNT);
  const [phase, setPhase] = useState<LaunchPhase>("countdown");
  const [numberKey, setNumberKey] = useState(START_COUNT);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${(index * 17) % 100}%`,
        top: `${(index * 29) % 100}%`,
        size: `${2 + (index % 4)}px`,
        delay: `${(index % 6) * 0.45}s`,
        duration: `${4 + (index % 5)}s`,
      })),
    []
  );

  const burstParticles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        rotate: `${index * 20}deg`,
        distance: `${120 + (index % 3) * 35}px`,
        delay: `${index * 0.015}s`,
      })),
    []
  );

  useEffect(() => {
    if (phase !== "countdown") return;

    const timer = window.setInterval(() => {
      setCount((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setNumberKey(0);
          setPhase("flash");
          return 0;
        }

        const next = current - 1;
        setNumberKey(next);
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "flash") return;

    const flashTimer = window.setTimeout(() => setPhase("curtain"), 450);
    const doneTimer = window.setTimeout(() => setPhase("done"), 1900);

    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase]);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      className={`launch-overlay ${phase === "curtain" ? "is-revealing" : ""} ${phase === "flash" ? "is-flashing" : ""}`}
      aria-hidden="true"
    >
      <div className="launch-overlay__bg" />
      <div className="launch-overlay__rays" />

      <div className="launch-overlay__particles">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="launch-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="launch-overlay__content">
        <div className="launch-wordmark">
          <div className="launch-wordmark__logo">🙏</div>
          <div className="launch-wordmark__text">
            <p className="launch-wordmark__eyebrow">Premium Spiritual Launch</p>
            <h1>SanatanSetu</h1>
            <p className="launch-wordmark__subtext">
              Sacred energy. Cinematic welcome. Divine beginning.
            </p>
          </div>
        </div>

        <div className="launch-countdown-shell">
          <div className="launch-countdown-ring" />
          <div key={numberKey} className="launch-countdown-number">
            {count}
          </div>
        </div>

        <p className="launch-blessing">
          Launching a divine experience for every seeker
        </p>
      </div>

      <div className="launch-burst">
        {burstParticles.map((particle) => (
          <span
            key={particle.id}
            className="launch-burst__particle"
            style={
              {
                "--rotate": particle.rotate,
                "--distance": particle.distance,
                animationDelay: particle.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="launch-curtain launch-curtain--left" />
      <div className="launch-curtain launch-curtain--right" />

      <style jsx>{`
        .launch-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at top, rgba(245, 198, 95, 0.16), transparent 32%),
            radial-gradient(circle at bottom, rgba(120, 64, 14, 0.24), transparent 38%),
            linear-gradient(180deg, #090909 0%, #111111 38%, #050505 100%);
        }

        .launch-overlay__bg,
        .launch-overlay__rays,
        .launch-overlay__particles,
        .launch-burst,
        .launch-curtain {
          position: absolute;
          inset: 0;
        }

        .launch-overlay__bg::before,
        .launch-overlay__bg::after {
          content: "";
          position: absolute;
          inset: auto;
          width: 40rem;
          height: 40rem;
          border-radius: 999px;
          filter: blur(80px);
          opacity: 0.34;
        }

        .launch-overlay__bg::before {
          top: -10rem;
          left: -8rem;
          background: rgba(255, 191, 73, 0.18);
        }

        .launch-overlay__bg::after {
          right: -12rem;
          bottom: -14rem;
          background: rgba(212, 140, 35, 0.16);
        }

        .launch-overlay__rays {
          background:
            linear-gradient(115deg, transparent 0%, rgba(255, 215, 128, 0.045) 50%, transparent 100%),
            linear-gradient(65deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
          transform: scale(1.2);
          animation: raysShift 8s ease-in-out infinite alternate;
        }

        .launch-overlay__particles {
          pointer-events: none;
        }

        .launch-particle {
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 233, 173, 0.95), rgba(212, 175, 55, 0.35));
          box-shadow: 0 0 14px rgba(255, 212, 102, 0.65);
          animation-name: floatParticle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .launch-overlay__content {
          position: relative;
          z-index: 2;
          width: min(92vw, 34rem);
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .launch-wordmark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .launch-wordmark__logo {
          width: 5rem;
          height: 5rem;
          display: grid;
          place-items: center;
          border-radius: 999px;
          font-size: 2.2rem;
          background: radial-gradient(circle at 30% 30%, rgba(255, 240, 199, 0.95), rgba(212, 175, 55, 0.22));
          border: 1px solid rgba(244, 206, 122, 0.45);
          box-shadow:
            0 0 0 1px rgba(255, 223, 148, 0.12),
            0 0 40px rgba(255, 193, 77, 0.24),
            inset 0 0 28px rgba(255, 255, 255, 0.2);
          animation: logoPulse 3.2s ease-in-out infinite;
        }

        .launch-wordmark__eyebrow {
          margin: 0 0 0.45rem;
          font-size: 0.7rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(242, 212, 145, 0.76);
        }

        .launch-wordmark h1 {
          margin: 0;
          font-size: clamp(2.4rem, 8vw, 4.4rem);
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: 0.03em;
          color: #fff6db;
          text-shadow:
            0 0 18px rgba(241, 191, 76, 0.28),
            0 0 42px rgba(255, 215, 128, 0.14);
        }

        .launch-wordmark__subtext {
          margin: 0.7rem 0 0;
          font-size: 0.92rem;
          color: rgba(255, 244, 219, 0.72);
        }

        .launch-countdown-shell {
          position: relative;
          width: min(62vw, 12rem);
          height: min(62vw, 12rem);
          margin: 0 auto 1.25rem;
          display: grid;
          place-items: center;
        }

        .launch-countdown-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px solid rgba(255, 214, 128, 0.24);
          background:
            radial-gradient(circle, rgba(255, 214, 128, 0.05), transparent 60%),
            linear-gradient(145deg, rgba(255, 214, 128, 0.1), rgba(255, 255, 255, 0.03));
          box-shadow:
            inset 0 0 32px rgba(255, 204, 102, 0.08),
            0 0 40px rgba(255, 193, 77, 0.08);
        }

        .launch-countdown-ring::before {
          content: "";
          position: absolute;
          inset: 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 232, 177, 0.16);
        }

        .launch-countdown-number {
          position: relative;
          z-index: 1;
          font-size: clamp(4.4rem, 17vw, 8rem);
          line-height: 1;
          font-weight: 800;
          color: #ffe6a2;
          text-shadow:
            0 0 12px rgba(255, 214, 120, 0.7),
            0 0 36px rgba(255, 174, 0, 0.38);
          animation: numberPulse 0.95s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .launch-blessing {
          margin: 0;
          font-size: 0.9rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 244, 219, 0.54);
        }

        .launch-burst {
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          z-index: 3;
        }

        .launch-burst__particle {
          position: absolute;
          width: 0.45rem;
          height: 2.6rem;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255, 248, 229, 1), rgba(255, 194, 73, 0));
          transform: rotate(var(--rotate)) translateY(0);
          transform-origin: center bottom;
          opacity: 0;
        }

        .launch-curtain {
          top: 0;
          bottom: 0;
          width: 50.5%;
          z-index: 4;
          background:
            linear-gradient(180deg, rgba(8, 8, 8, 0.96), rgba(25, 19, 10, 0.97)),
            repeating-linear-gradient(
              90deg,
              rgba(255, 208, 114, 0.12) 0px,
              rgba(255, 208, 114, 0.12) 2px,
              transparent 2px,
              transparent 24px
            );
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.5);
        }

        .launch-curtain--left {
          left: 0;
          border-right: 1px solid rgba(255, 213, 120, 0.15);
        }

        .launch-curtain--right {
          right: 0;
          border-left: 1px solid rgba(255, 213, 120, 0.15);
        }

        .is-flashing::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255, 250, 235, 0.96), rgba(255, 214, 128, 0.3), transparent 70%);
          animation: flashFade 0.45s ease-out forwards;
          z-index: 3;
          pointer-events: none;
        }

        .is-flashing .launch-burst {
          opacity: 1;
        }

        .is-flashing .launch-burst__particle {
          animation: burstOut 0.8s ease-out forwards;
        }

        .is-revealing {
          animation: overlayFade 1.2s ease forwards;
          animation-delay: 0.55s;
        }

        .is-revealing .launch-curtain--left {
          animation: curtainLeft 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .is-revealing .launch-curtain--right {
          animation: curtainRight 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .is-revealing .launch-overlay__content {
          animation: contentFadeOut 0.55s ease forwards;
        }

        @keyframes floatParticle {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.75);
            opacity: 0.12;
          }
          50% {
            transform: translate3d(12px, -34px, 0) scale(1.2);
            opacity: 0.95;
          }
        }

        @keyframes logoPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 0 1px rgba(255, 223, 148, 0.12),
              0 0 40px rgba(255, 193, 77, 0.24),
              inset 0 0 28px rgba(255, 255, 255, 0.2);
          }
          50% {
            transform: scale(1.04);
            box-shadow:
              0 0 0 1px rgba(255, 223, 148, 0.2),
              0 0 60px rgba(255, 193, 77, 0.34),
              inset 0 0 36px rgba(255, 255, 255, 0.28);
          }
        }

        @keyframes numberPulse {
          0% {
            transform: scale(0.66);
            opacity: 0;
          }
          20% {
            transform: scale(1.08);
            opacity: 1;
          }
          82% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.92;
          }
        }

        @keyframes raysShift {
          from {
            transform: scale(1.2) translate3d(-1.5%, 0, 0);
          }
          to {
            transform: scale(1.2) translate3d(1.5%, -1.5%, 0);
          }
        }

        @keyframes flashFade {
          from {
            opacity: 0.95;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes burstOut {
          0% {
            opacity: 0;
            transform: rotate(var(--rotate)) translateY(0) scale(0.6);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--rotate)) translateY(calc(var(--distance) * -1)) scale(1.1);
          }
        }

        @keyframes curtainLeft {
          to {
            transform: translateX(-110%);
          }
        }

        @keyframes curtainRight {
          to {
            transform: translateX(110%);
          }
        }

        @keyframes contentFadeOut {
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes overlayFade {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @media (max-width: 640px) {
          .launch-overlay__content {
            width: min(94vw, 28rem);
            padding: 1.5rem 1rem;
          }

          .launch-wordmark__subtext {
            font-size: 0.82rem;
          }

          .launch-blessing {
            font-size: 0.72rem;
            letter-spacing: 0.14em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .launch-particle,
          .launch-wordmark__logo,
          .launch-countdown-number,
          .launch-overlay__rays,
          .launch-burst__particle,
          .launch-curtain,
          .launch-overlay,
          .launch-overlay__content {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
