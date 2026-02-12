export const initWebEngage = () => {
  if (typeof window === "undefined") return;

  const key = process.env.REACT_APP_WEBENGAGE_KEY;
  const mode = process.env.REACT_APP_MODE;

  if (!key) {
    console.warn("WebEngage key missing for", mode);
    return;
  }

  //  Correct init check
  if (window.webengage && window.webengage.__v) {
    return;
  }

  //  SPA stub
  window.webengage = window.webengage || {
    __queue: [],
    __v: "6.0",
    is_spa: 1,
    user: {}
  };

  const methods = ["init", "track", "screen", "onReady"];
  methods.forEach((m) => {
    window.webengage[m] = function () {
      window.webengage.__queue.push([m, arguments]);
    };
  });

  const userMethods = ["login", "logout", "setAttribute", "identify"];
  userMethods.forEach((m) => {
    window.webengage.user[m] = function () {
      window.webengage.__queue.push(["user." + m, arguments]);
    };
  });

  //  Load SDK
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://widgets.in.webengage.com/js/webengage-min-v-6.0.js";

  script.onload = () => {
    window.webengage.init(key);
    window.webengage.debug(false);

    console.log(`WebEngage initialized → ${mode}`);
    console.log(`License → ${key}`);
  };

  document.head.appendChild(script);
};
