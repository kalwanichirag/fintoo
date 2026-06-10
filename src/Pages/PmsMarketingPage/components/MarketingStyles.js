import React from "react";

export default function MarketingStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      .pms-marketing-page { font-family: Inter, sans-serif; background: #000; color: #fff; }
      .pms-marketing-page * { box-sizing: border-box; }
      @keyframes pmsTextSlide {
        0%, 16% { transform: translateY(0); }
        20%, 36% { transform: translateY(calc(var(--pms-text-slide-height) * -1)); }
        40%, 56% { transform: translateY(calc(var(--pms-text-slide-height) * -2)); }
        60%, 76% { transform: translateY(calc(var(--pms-text-slide-height) * -3)); }
        80%, 96% { transform: translateY(calc(var(--pms-text-slide-height) * -4)); }
        100% { transform: translateY(calc(var(--pms-text-slide-height) * -5)); }
      }
      .pms-text-rotator {
        --pms-text-slide-height: 1.2em;
        display: inline-block;
        height: var(--pms-text-slide-height);
        line-height: var(--pms-text-slide-height);
      }
      .pms-text-slide { animation: pmsTextSlide 10s infinite; will-change: transform; }
      .pms-text-slide-item {
        height: var(--pms-text-slide-height);
        line-height: var(--pms-text-slide-height);
      }
      @keyframes pmsLogoMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .pms-logo-marquee {
        display: flex;
        width: max-content;
        animation: pmsLogoMarquee 24s linear infinite;
        will-change: transform;
      }
      .pms-logo-marquee:hover { animation-play-state: paused; }
      .pms-logo-track {
        display: flex;
        align-items: center;
        gap: clamp(52px, 6vw, 104px);
        padding-right: clamp(52px, 6vw, 104px);
      }
      .pms-trusted-logo {
        height: 32px;
        max-width: 150px;
        object-fit: contain;
        flex: 0 0 auto;
      }
      @media (min-width: 768px) {
        .pms-trusted-logo { height: 38px; }
      }
      @keyframes pmsFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      .pms-float-pill { animation: pmsFloat 4s ease-in-out infinite; }
      .pms-challenges::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 20% 30%, rgba(163,230,53,0.08), transparent 30%),
          radial-gradient(circle at 80% 70%, rgba(163,230,53,0.06), transparent 30%);
        pointer-events: none;
      }
      @keyframes pmsOrbit {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(18px, -12px); }
      }
      .pms-orbit { animation: pmsOrbit 4s ease-in-out infinite; }
      .pms-offerings-section {
        position: relative;
      }
      .pms-offerings-pin {
        height: 100vh;
        overflow: hidden;
      }
      .pms-offerings-window {
        overflow: hidden;
        width: 100%;
      }
      .pms-offerings-track {
        display: flex;
        width: 300%;
        will-change: transform;
      }
      .pms-offering-panel {
        flex: 0 0 33.3333%;
        padding: 0 10px;
      }
      .pms-offering-card {
        min-height: clamp(360px, 48vh, 520px);
      }
      .pms-offerings-pin .tw-h-full > .tw-flex {
        padding-top: 64px;
      }
      @media (max-width: 767px) {
        .pms-offerings-pin {
          height: auto;
          padding: 80px 0;
          overflow: visible;
        }
        .pms-offerings-pin .tw-h-full > .tw-flex {
          padding-top: 0;
        }
        .pms-offerings-window {
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .pms-offerings-window::-webkit-scrollbar {
          display: none;
        }
        .pms-offerings-track {
          width: max-content;
          transform: none !important;
        }
        .pms-offering-panel {
          width: min(86vw, 420px);
          flex-basis: auto;
          scroll-snap-align: center;
        }
        .pms-offering-card {
          min-height: 0;
        }
      }
      .pms-marketing-page table th,
      .pms-marketing-page table td { border-left: 0; border-right: 0; }
    `}</style>
  );
}
