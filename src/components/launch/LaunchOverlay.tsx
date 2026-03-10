"use client";

import { useEffect, useState, useCallback } from "react";

type Phase = "countdown" | "welcome" | "opening" | "reveal" | "done";

const COUNT_FROM = 10;
const WELCOME_MS = 2800;
const OPEN_MS = 3200;
const REVEAL_MS = 5500;

interface Particle {
  id: number;
  left: string;
  delay: string;
  dur: string;
  size: string;
}

interface Diya {
  id: number;
  left: string;
  bottom: string;
  delay: string;
}

const FIXED_PARTICLES: Particle[] = [
  { id: 0, left: "5%", delay: "0s", dur: "7s", size: "2px" },
  { id: 1, left: "12%", delay: "1.2s", dur: "8s", size: "2.5px" },
  { id: 2, left: "20%", delay: "3.5s", dur: "6s", size: "1.8px" },
  { id: 3, left: "27%", delay: "0.8s", dur: "9s", size: "3px" },
  { id: 4, left: "33%", delay: "5s", dur: "7.5s", size: "2px" },
  { id: 5, left: "40%", delay: "2s", dur: "6.5s", size: "3.2px" },
  { id: 6, left: "46%", delay: "7s", dur: "8.5s", size: "2.2px" },
  { id: 7, left: "52%", delay: "0.5s", dur: "10s", size: "1.5px" },
  { id: 8, left: "58%", delay: "4s", dur: "7s", size: "2.8px" },
  { id: 9, left: "64%", delay: "6s", dur: "6s", size: "2px" },
  { id: 10, left: "70%", delay: "1.5s", dur: "9s", size: "3.5px" },
  { id: 11, left: "76%", delay: "3s", dur: "8s", size: "2.5px" },
  { id: 12, left: "82%", delay: "8s", dur: "7s", size: "2px" },
  { id: 13, left: "88%", delay: "2.5s", dur: "6.5s", size: "3px" },
  { id: 14, left: "94%", delay: "5.5s", dur: "9.5s", size: "2.2px" },
  { id: 15, left: "8%", delay: "4.5s", dur: "11s", size: "1.8px" },
  { id: 16, left: "35%", delay: "6.5s", dur: "8s", size: "2.6px" },
  { id: 17, left: "55%", delay: "1s", dur: "7.5s", size: "3px" },
  { id: 18, left: "72%", delay: "7.5s", dur: "10s", size: "2px" },
  { id: 19, left: "90%", delay: "3.8s", dur: "6s", size: "2.4px" },
];

const FIXED_DIYAS: Diya[] = [
  { id: 0, left: "6%", bottom: "12%", delay: "0.5s" },
  { id: 1, left: "14%", bottom: "22%", delay: "1.2s" },
  { id: 2, left: "22%", bottom: "8%", delay: "0.3s" },
  { id: 3, left: "74%", bottom: "18%", delay: "1.8s" },
  { id: 4, left: "82%", bottom: "10%", delay: "0.7s" },
  { id: 5, left: "90%", bottom: "20%", delay: "1.5s" },
];

const PRODUCTS = [
  { img: "/images/home_static/rudraksha.png", label: "Rudraksha" },
  { img: "/images/home_static/tiger_eye_bracelet.png", label: "Gemstone Bracelet" },
  { img: "/images/home_static/premium_pyrite_tortoise.png", label: "Vastu Items" },
  { img: "/images/home_static/hanuman_idol_brass.png", label: "Brass Idols" },
];

export function LaunchOverlay() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("countdown");
  const [count, setCount] = useState(COUNT_FROM);
  const [tick, setTick] = useState(COUNT_FROM);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cleanup = useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
    document.documentElement.style.overflow = "";
  }, []);

  // Countdown 10 → 0
  useEffect(() => {
    if (phase !== "countdown") return;
    document.body.style.overflow = "hidden";
    const timer = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(timer);
          setTick(0);
          setPhase("welcome");
          return 0;
        }
        const next = c - 1;
        setTick(next);
        return next;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [phase]);

  // Welcome → opening
  useEffect(() => {
    if (phase !== "welcome") return;
    const t = window.setTimeout(() => setPhase("opening"), WELCOME_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Opening → reveal
  useEffect(() => {
    if (phase !== "opening") return;
    const t = window.setTimeout(() => setPhase("reveal"), OPEN_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Reveal → done
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = window.setTimeout(() => {
      setPhase("done");
      cleanup();
    }, REVEAL_MS);
    return () => window.clearTimeout(t);
  }, [phase, cleanup]);

  useEffect(() => {
    if (phase === "done") cleanup();
    return cleanup;
  }, [phase, cleanup]);

  if (!mounted || phase === "done") return null;

  const isOpening = phase === "opening" || phase === "reveal";
  const isReveal = phase === "reveal";
  const isWelcome = phase === "welcome";
  const showCenter = phase === "countdown" || phase === "welcome";

  return (
    <div className={`lo ${isReveal ? "lo--reveal" : ""}`}>
      <div className="lo__bg" />

      {FIXED_PARTICLES.map((p) => (
        <span
          key={p.id}
          className="lo__particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.dur,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      <div className="lo__smoke lo__smoke--1" />
      <div className="lo__smoke lo__smoke--2" />
      <div className="lo__smoke lo__smoke--3" />

      {FIXED_DIYAS.map((d) => (
        <span
          key={d.id}
          className="lo__diya"
          style={{ left: d.left, bottom: d.bottom, animationDelay: d.delay }}
        />
      ))}

      <div className={`lo__bell ${isOpening ? "lo__bell--ring" : ""}`}>
        <span className="lo__bell-icon">🔔</span>
      </div>

      <div className={`lo__light ${isOpening ? "lo__light--on" : ""}`}>
        {/* Products inside the golden light */}
        {isOpening && (
          <div className="lo__light-products">
            {PRODUCTS.map((p, i) => (
              <div key={i} className={`lo__light-item lo__light-item--${i + 1}`}>
                <img src={p.img} alt={p.label} className="lo__light-item-img" draggable={false} />
                <span className="lo__light-item-label">{p.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LEFT TEMPLE DOOR */}
      <div className={`lo__door lo__door--left ${isOpening ? "lo__door--open-left" : ""}`}>
        <div className="lo__door-panel">
          <div className="lo__door-carving" />
          <div className="lo__door-studs">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span key={i} className="lo__door-stud" />
            ))}
          </div>
          <div className="lo__door-handle lo__door-handle--r" />
          <div className="lo__door-trim lo__door-trim--r" />
        </div>
      </div>

      {/* RIGHT TEMPLE DOOR */}
      <div className={`lo__door lo__door--right ${isOpening ? "lo__door--open-right" : ""}`}>
        <div className="lo__door-panel">
          <div className="lo__door-carving" />
          <div className="lo__door-studs">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span key={i} className="lo__door-stud" />
            ))}
          </div>
          <div className="lo__door-handle lo__door-handle--l" />
          <div className="lo__door-trim lo__door-trim--l" />
        </div>
      </div>

      {/* CENTER: Ganpati + Timer stacked together */}
      {showCenter && (
        <div className={`lo__center ${isWelcome ? "lo__center--welcome" : ""}`}>
          <div className="lo__ganpati-glow" />
          <img
            src="/images/home_static/ganesh_idol_brass.png"
            alt=""
            className="lo__ganpati-img"
            draggable={false}
          />
          <p className="lo__mantra">|| श्री गणेशाय नमः ||</p>

          {/* Timer below Ganpati */}
          {phase === "countdown" && (
            <div className="lo__countdown">
              <svg className="lo__ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" className="lo__ring-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  className="lo__ring-fill"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 54}`,
                    strokeDashoffset: `${2 * Math.PI * 54 * (1 - count / COUNT_FROM)}`,
                  }}
                />
              </svg>
              <span key={tick} className="lo__num">{count}</span>
            </div>
          )}

          {/* Welcome message after timer ends */}
          {isWelcome && (
            <div className="lo__welcome">
              <div className="lo__welcome-line" />
              <h1 className="lo__welcome-title">Welcome to</h1>
              <h2 className="lo__welcome-name">🙏 SanatanSetu Store</h2>
              <p className="lo__welcome-sub">Your Premium Spiritual Destination</p>
              <div className="lo__welcome-line" />
            </div>
          )}
        </div>
      )}

      {/* Ganpati blessing during opening */}
      {isOpening && !isReveal && (
        <div className="lo__ganpati-bless">
          <div className="lo__ganpati-glow lo__ganpati-glow--expand" />
          <img
            src="/images/home_static/ganesh_idol_brass.png"
            alt=""
            className="lo__ganpati-img lo__ganpati-img--fade"
            draggable={false}
          />
        </div>
      )}

      {/* Brand reveal */}
      {isReveal && (
        <div className="lo__brand">
          <h1 className="lo__brand-name">🙏 SanatanSetu</h1>
          <p className="lo__brand-tag">Premium Spiritual Store</p>
        </div>
      )}

      <style jsx>{`
        .lo {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
        }

        .lo--reveal {
          animation: loFadeAll ${REVEAL_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes loFadeAll {
          0% { opacity: 1; }
          30% { opacity: 1; }
          55% { opacity: 0.7; }
          75% { opacity: 0.35; }
          90% { opacity: 0.1; }
          100% { opacity: 0; }
        }

        /* ═══ BACKGROUND ═══ */
        .lo__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(
            ellipse at 50% 40%,
            #1a0e06 0%, #0d0704 45%, #050302 100%
          );
        }

        /* ═══ PARTICLES ═══ */
        .lo__particle {
          position: absolute;
          bottom: -8px;
          z-index: 2;
          border-radius: 50%;
          background: #ffd666;
          box-shadow: 0 0 6px 1px rgba(255, 214, 102, 0.6);
          animation: particleUp linear infinite;
          pointer-events: none;
        }

        @keyframes particleUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          8% { opacity: 0.85; }
          50% { transform: translateY(-50vh) translateX(12px); }
          85% { opacity: 0.5; }
          100% { transform: translateY(-105vh) translateX(-8px); opacity: 0; }
        }

        /* ═══ SMOKE ═══ */
        .lo__smoke {
          position: absolute;
          z-index: 2;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(190,170,140,0.1) 0%, rgba(190,170,140,0.04) 40%, transparent 70%);
          filter: blur(28px);
          pointer-events: none;
        }
        .lo__smoke--1 { width: 260px; height: 320px; left: 12%; bottom: 5%; animation: smokeDrift 10s ease-in-out infinite; }
        .lo__smoke--2 { width: 200px; height: 280px; right: 10%; bottom: 8%; animation: smokeDrift 12s ease-in-out 2s infinite; }
        .lo__smoke--3 { width: 180px; height: 240px; left: 45%; bottom: 2%; animation: smokeDrift 9s ease-in-out 4s infinite; }

        @keyframes smokeDrift {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-80px) scale(1.15); opacity: 0.8; }
        }

        /* ═══ DIYAS ═══ */
        .lo__diya {
          position: absolute;
          z-index: 3;
          width: 10px;
          height: 14px;
          border-radius: 50% 50% 40% 40%;
          background: radial-gradient(ellipse at 50% 30%, #ffe680 0%, #ffaa00 50%, #cc6600 100%);
          box-shadow: 0 0 10px 4px rgba(255,170,0,0.5), 0 0 28px 8px rgba(255,140,0,0.2);
          animation: diyaFloat 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes diyaFloat {
          0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 0 10px 4px rgba(255,170,0,0.5), 0 0 28px 8px rgba(255,140,0,0.2); }
          50% { transform: translateY(-12px) scale(1.08); box-shadow: 0 0 14px 6px rgba(255,170,0,0.65), 0 0 36px 10px rgba(255,140,0,0.3); }
        }

        /* ═══ BELL ═══ */
        .lo__bell {
          position: absolute;
          top: 4%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 12;
          transform-origin: top center;
          animation: bellIdle 3s ease-in-out infinite;
        }
        .lo__bell-icon {
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          filter: drop-shadow(0 2px 8px rgba(255,200,60,0.4));
        }
        .lo__bell--ring { animation: bellRing 0.25s ease-in-out 8; }

        @keyframes bellIdle {
          0%, 100% { transform: translateX(-50%) rotate(-3deg); }
          50% { transform: translateX(-50%) rotate(3deg); }
        }
        @keyframes bellRing {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(-18deg); }
          75% { transform: translateX(-50%) rotate(18deg); }
        }

        /* ═══ DIVINE LIGHT ═══ */
        .lo__light {
          position: absolute;
          top: 0; bottom: 0;
          left: 50%;
          width: 6px;
          transform: translateX(-50%);
          z-index: 4;
          background: radial-gradient(ellipse at center, rgba(255,240,200,0.95) 0%, rgba(255,210,100,0.6) 30%, rgba(255,180,60,0.2) 60%, transparent 100%);
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .lo__light--on { animation: lightBurst ${OPEN_MS}ms cubic-bezier(0.25,0.8,0.25,1) forwards; }

        @keyframes lightBurst {
          0% { width: 6px; opacity: 0.3; }
          20% { width: 15vw; opacity: 0.6; }
          50% { width: 45vw; opacity: 0.85; }
          100% { width: 110vw; opacity: 1; }
        }

        /* Products inside golden light */
        .lo__light-products {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(0.6rem, 3vw, 2rem);
          align-items: start;
          justify-items: center;
          padding: 0 clamp(0.8rem, 3vw, 2rem);
          max-width: 600px;
        }

        @media (max-width: 480px) {
          .lo__light-products {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(0.8rem, 4vw, 1.4rem);
            max-width: 280px;
          }
        }

        .lo__light-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          opacity: 0;
        }

        .lo__light-item-img {
          width: clamp(3.8rem, 16vw, 6rem);
          height: clamp(3.8rem, 16vw, 6rem);
          object-fit: contain;
          padding: clamp(0.4rem, 1.5vw, 0.7rem);
          border-radius: 18px;
          background: rgba(255, 250, 230, 0.15);
          border: 1.5px solid rgba(255, 220, 120, 0.3);
          box-shadow:
            0 4px 20px rgba(255, 200, 80, 0.25),
            0 0 40px rgba(255, 180, 60, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          filter: drop-shadow(0 0 12px rgba(255, 220, 100, 0.6)) brightness(1.1);
          animation: itemGlow 2.5s ease-in-out infinite;
        }

        .lo__light-item-label {
          font-size: clamp(0.6rem, 2vw, 0.82rem);
          font-weight: 700;
          color: #4a2e08;
          text-shadow: 0 0 10px rgba(255,235,160,0.7);
          letter-spacing: 0.05em;
          text-align: center;
          white-space: nowrap;
        }

        .lo__light-item--1 { animation: lightItemIn 1.1s ease-out 0.5s both; }
        .lo__light-item--2 { animation: lightItemIn 1.1s ease-out 0.8s both; }
        .lo__light-item--3 { animation: lightItemIn 1.1s ease-out 1.1s both; }
        .lo__light-item--4 { animation: lightItemIn 1.1s ease-out 1.4s both; }

        @keyframes lightItemIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.6); }
          55% { opacity: 1; transform: translateY(-6px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes itemGlow {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(255,220,100,0.6)) brightness(1.1); }
          50% { filter: drop-shadow(0 0 22px rgba(255,210,80,0.85)) brightness(1.18); }
        }

        /* ═══ TEMPLE DOORS ═══ */
        .lo__door {
          position: absolute;
          top: 0; bottom: 0;
          width: 51%;
          z-index: 6;
          will-change: transform;
        }
        .lo__door--left { left: 0; }
        .lo__door--right { right: 0; }

        .lo__door-panel {
          position: relative;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #3d2414 0%, #2c1a0e 20%, #1e0f07 50%, #2c1a0e 80%, #3d2414 100%);
          box-shadow: inset 0 0 60px rgba(0,0,0,0.6);
          overflow: hidden;
        }

        .lo__door-carving {
          position: absolute;
          inset: 6% 10%;
          border: 2px solid rgba(180,140,60,0.2);
          border-radius: 3px;
          background: repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(180,140,60,0.05) 14px, rgba(180,140,60,0.05) 15px),
                      repeating-linear-gradient(-45deg, transparent, transparent 14px, rgba(180,140,60,0.05) 14px, rgba(180,140,60,0.05) 15px);
        }
        .lo__door-carving::after {
          content: "";
          position: absolute;
          inset: 8%;
          border: 1.5px solid rgba(200,160,60,0.15);
          border-radius: 2px;
        }

        .lo__door-studs {
          position: absolute;
          inset: 10% 18%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(4, 1fr);
          place-items: center;
        }
        .lo__door-stud {
          width: 11px; height: 11px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f5dd7a, #b8912a 60%, #7a5f18);
          box-shadow: 0 1px 4px rgba(0,0,0,0.5), 0 0 6px rgba(220,180,60,0.25);
        }

        .lo__door-handle {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 12px; height: 44px;
          border-radius: 6px;
          background: linear-gradient(180deg, #f0d070 0%, #b8912a 40%, #f0d070 100%);
          box-shadow: 0 0 10px rgba(220,180,60,0.3), 0 2px 6px rgba(0,0,0,0.5);
        }
        .lo__door-handle--r { right: 10px; }
        .lo__door-handle--l { left: 10px; }

        .lo__door-trim {
          position: absolute;
          top: 3%; bottom: 3%;
          width: 6px;
          background: linear-gradient(180deg, #f0d070 0%, #c4982a 25%, #a07820 50%, #c4982a 75%, #f0d070 100%);
          box-shadow: 0 0 12px rgba(255,200,80,0.2);
        }
        .lo__door-trim--r { right: 0; }
        .lo__door-trim--l { left: 0; }

        .lo__door--open-left {
          animation: doorSlideLeft ${OPEN_MS}ms cubic-bezier(0.16,0.85,0.3,1) forwards;
        }
        .lo__door--open-right {
          animation: doorSlideRight ${OPEN_MS}ms cubic-bezier(0.16,0.85,0.3,1) forwards;
        }

        @keyframes doorSlideLeft {
          0% { transform: translateX(0); opacity: 1; }
          40% { opacity: 0.85; }
          80% { opacity: 0.5; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes doorSlideRight {
          0% { transform: translateX(0); opacity: 1; }
          40% { opacity: 0.85; }
          80% { opacity: 0.5; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        /* ═══ CENTER STACK (Ganpati + Timer + Welcome) ═══ */
        .lo__center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          pointer-events: none;
        }

        .lo__center--welcome {
          animation: centerShift 1s ease-out both;
        }

        @keyframes centerShift {
          from { transform: translate(-50%, -50%); }
          to { transform: translate(-50%, -50%); }
        }

        .lo__ganpati-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translate(-50%, -10%);
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,210,80,0.2) 0%, rgba(255,180,60,0.08) 50%, transparent 70%);
          animation: glowPulse 2.5s ease-in-out infinite;
          pointer-events: none;
        }

        .lo__ganpati-img {
          position: relative;
          width: clamp(4.5rem, 20vw, 7.5rem);
          height: clamp(4.5rem, 20vw, 7.5rem);
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(255,200,80,0.4));
          animation: fadeIn 0.8s ease-out both;
        }

        .lo__mantra {
          position: relative;
          margin: 0;
          font-size: clamp(0.7rem, 2.4vw, 0.95rem);
          letter-spacing: 0.12em;
          color: #ffd97a;
          text-shadow: 0 0 12px rgba(255,210,90,0.35);
          animation: fadeIn 0.8s ease-out 0.3s both;
        }

        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -10%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -10%) scale(1.12); opacity: 1; }
        }

        /* ═══ COUNTDOWN (below Ganpati) ═══ */
        .lo__countdown {
          position: relative;
          width: clamp(5rem, 20vw, 7rem);
          height: clamp(5rem, 20vw, 7rem);
          display: grid;
          place-items: center;
          margin-top: 0.5rem;
          animation: fadeIn 0.6s ease-out 0.5s both;
        }
        .lo__ring {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
        }
        .lo__ring-bg { fill: none; stroke: rgba(255,215,120,0.1); stroke-width: 3; }
        .lo__ring-fill {
          fill: none;
          stroke: #ffd56b;
          stroke-width: 3.5;
          stroke-linecap: round;
          transition: stroke-dashoffset 1.1s ease;
          filter: drop-shadow(0 0 6px rgba(255,210,90,0.5));
        }
        .lo__num {
          font-size: clamp(2rem, 8vw, 3.4rem);
          font-weight: 800;
          color: #ffe9a8;
          text-shadow: 0 0 10px rgba(255,214,120,0.55);
          animation: numPop 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ═══ WELCOME MESSAGE ═══ */
        .lo__welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          margin-top: 1rem;
        }

        .lo__welcome-line {
          width: clamp(3rem, 20vw, 6rem);
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4a948, transparent);
          animation: fadeIn 1s ease-out 0.2s both;
        }

        .lo__welcome-title {
          margin: 0;
          font-size: clamp(0.9rem, 3vw, 1.3rem);
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 230, 180, 0.6);
          animation: welcomeFadeUp 1s ease-out 0.3s both;
        }

        .lo__welcome-name {
          margin: 0;
          font-size: clamp(1.6rem, 5.5vw, 2.8rem);
          font-weight: 800;
          color: #fff6dd;
          text-shadow: 0 0 20px rgba(255, 210, 100, 0.4), 0 0 60px rgba(255, 180, 60, 0.15);
          white-space: nowrap;
          animation: welcomeFadeUp 1s ease-out 0.6s both;
        }

        .lo__welcome-sub {
          margin: 0;
          font-size: clamp(0.55rem, 2vw, 0.8rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 240, 210, 0.4);
          animation: welcomeFadeUp 1s ease-out 0.9s both;
        }

        @keyframes welcomeFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ═══ GANPATI BLESSING (during opening) ═══ */
        .lo__ganpati-bless {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 8;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          animation: blessFade ${OPEN_MS * 0.7}ms ease forwards;
        }

        .lo__ganpati-glow--expand {
          animation: glowExpand ${OPEN_MS * 0.6}ms ease forwards !important;
        }

        .lo__ganpati-img--fade {
          animation: blessFade ${OPEN_MS * 0.7}ms ease forwards !important;
        }

        @keyframes glowExpand {
          to { width: 400px; height: 400px; opacity: 0; }
        }

        @keyframes blessFade {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.06); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.12); }
        }

        /* ═══ BRAND ═══ */
        .lo__brand {
          position: absolute;
          bottom: 14%; left: 50%;
          transform: translateX(-50%);
          z-index: 14;
          text-align: center;
          pointer-events: none;
          animation: brandIn 1.5s ease-out 0.5s both;
        }
        .lo__brand-name {
          margin: 0;
          font-size: clamp(1.8rem, 6vw, 3rem);
          font-weight: 800;
          color: #fff6dd;
          text-shadow: 0 0 18px rgba(255,210,100,0.35);
          white-space: nowrap;
        }
        .lo__brand-tag {
          margin: 0.3rem 0 0;
          font-size: clamp(0.6rem, 2vw, 0.85rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,240,210,0.5);
        }

        @keyframes brandIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.88); }
          to { opacity: 1; transform: translateX(-50%) scale(1); }
        }

        /* ═══ SHARED ═══ */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes numPop {
          0% { transform: scale(0.5); opacity: 0; }
          30% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
