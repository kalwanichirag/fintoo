const LOADER_STYLE_ID = "calendly-redirect-loader-style";
const LOADER_ID = "calendly-redirect-loader";

const ensureStyles = () => {
  if (document.getElementById(LOADER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = LOADER_STYLE_ID;
  style.textContent = `
    #${LOADER_ID} {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, rgba(4, 43, 98, 0.96), rgba(8, 72, 139, 0.92));
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
      font-family: inherit;
    }
    #${LOADER_ID} .calendly-loader-content {
      color: #fff;
      width: 100%;
      max-width: 420px;
      padding: 16px;
    }
    #${LOADER_ID} .calendly-loader-spinner {
      width: 56px;
      height: 56px;
      border: 4px solid rgba(255, 255, 255, 0.25);
      border-top-color: #dd7300;
      border-radius: 50%;
      animation: calendly-loader-spin 0.85s linear infinite;
      margin: 0 auto 18px;
    }
    #${LOADER_ID} .calendly-loader-title {
      font-size: 24px;
      line-height: 1.2;
      font-weight: 700;
      margin-bottom: 10px;
    }
    #${LOADER_ID} .calendly-loader-text {
      font-size: 15px;
      line-height: 1.45;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.88);
      margin-bottom: 22px;
    }
    #${LOADER_ID} .calendly-loader-shimmer {
      height: 12px;
      margin: 0 auto 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.32), rgba(255,255,255,0.16));
      background-size: 200% 100%;
      animation: calendly-loader-shimmer 1.5s linear infinite;
    }
    #${LOADER_ID} .calendly-loader-shimmer-1 {
      width: 100%;
    }
    #${LOADER_ID} .calendly-loader-shimmer-2 {
      width: 84%;
    }
    #${LOADER_ID} .calendly-loader-shimmer-3 {
      width: 68%;
    }
    @keyframes calendly-loader-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes calendly-loader-shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;

  document.head.appendChild(style);
};

export const showCalendlyRedirectLoader = (
  text = "Please wait while we confirm your booking..."
) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  ensureStyles();

  let loader = document.getElementById(LOADER_ID);

  if (!loader) {
    loader = document.createElement("div");
    loader.id = LOADER_ID;
    loader.innerHTML = `
      <div class="calendly-loader-content">
        <div class="calendly-loader-spinner"></div>
        <div class="calendly-loader-title">Preparing your booking details</div>
        <div class="calendly-loader-text"></div>
        <div class="calendly-loader-shimmer calendly-loader-shimmer-1"></div>
        <div class="calendly-loader-shimmer calendly-loader-shimmer-2"></div>
        <div class="calendly-loader-shimmer calendly-loader-shimmer-3"></div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  const textNode = loader.querySelector(".calendly-loader-text");
  if (textNode) textNode.textContent = text;
};

export const hideCalendlyRedirectLoader = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const loader = document.getElementById(LOADER_ID);
  if (loader?.parentNode) loader.parentNode.removeChild(loader);
};
