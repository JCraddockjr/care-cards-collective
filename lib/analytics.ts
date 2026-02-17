// /lib/analytics.ts

type Props = Record<string, unknown>;

export function track(event: string, props: Props = {}) {
  try {
    const payload = {
      event,
      ...props,
      ts: new Date().toISOString(),
    };

    // Optional: Google Analytics (gtag)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    if (typeof w.gtag === "function") {
      w.gtag("event", event, props);
      return;
    }

    // Optional: Google Tag Manager
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(payload);
      return;
    }

    // Dev fallback (so you can see it working)
    if (process.env.NODE_ENV !== "production") {
      console.debug("[track]", payload);
    }
  } catch {
    // Never break UX because of analytics
  }
}
