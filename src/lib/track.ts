type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const CONVERSIONS = new Set(["form_submit", "click_whatsapp"]);

export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, params);
  if (CONVERSIONS.has(name)) {
    window.fbq?.("track", name === "form_submit" ? "Lead" : "Contact", params);
    const ads = import.meta.env["VITE_GADS_ID"];
    const label = import.meta.env["VITE_GADS_CONVERSION_LABEL"];
    if (ads && label) window.gtag?.("event", "conversion", { send_to: `${ads}/${label}` });
  }
}

/** Captura UTM/gclid da URL e guarda na sessão */
export function captureAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
  const url = new URLSearchParams(window.location.search);
  const stored = JSON.parse(sessionStorage.getItem("vital_attr") || "{}");
  keys.forEach((k) => {
    const v = url.get(k);
    if (v) stored[k] = v;
  });
  sessionStorage.setItem("vital_attr", JSON.stringify(stored));
  return stored;
}

let loaded = false;
/** Carrega GA4 / Google Ads / Meta Pixel somente após consentimento */
export function loadTrackers() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const ga = import.meta.env["VITE_GA4_ID"];
  const ads = import.meta.env["VITE_GADS_ID"];
  const pixel = import.meta.env["VITE_META_PIXEL_ID"];
  const gid = ga || ads;
  if (gid) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gid}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    if (ga) window.gtag("config", ga);
    if (ads) window.gtag("config", ads);
  }
  if (pixel) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      const t = b.createElement(e); t.async = true; t.src = v;
      b.head.appendChild(t);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq!("init", pixel);
    window.fbq!("track", "PageView");
  }
}
