/* DefenceIndia.com — site configuration. Edit values here; never hard-code them in pages. */
window.DI_CONFIG = {
  siteName: "DefenceIndia.com",
  baseUrl: "https://defenceindia.com",
  ownerContactUrl: "https://web.works/contact",
  /* Contact address is stored encoded so it is never exposed in page source or link text.
     It is decoded at runtime only when a form is submitted or a mail link is clicked. */
  k: "bW9jLmxpYW1nQDFhc2tyb3diZXc=",
  /* Form delivery: FormSubmit AJAX endpoint (free, no backend). The first submission triggers a
     one-time activation email to the inbox; click it once and all forms deliver thereafter. */
  formEndpoint: "https://formsubmit.co/ajax/",
  /* Google AdSense — replace with your publisher ID once approved (also update ads.txt). */
  adsense: { client: "ca-pub-0000000000000000", enabled: false, slots: { leaderboard: "1111111111", rect: "2222222222", inarticle: "3333333333" } },
  /* Google Analytics 4 — set an ID (G-XXXXXXX) to enable. */
  ga4: "",
  /* YouTube: set a channel ID (starts with UC…) to auto-embed latest uploads; add featured video IDs. */
  youtube: { channelId: "", featured: [] , channelUrl: "https://www.youtube.com/@DefenceIndia" },
  /* Community channels shown in header / footer / floating button. */
  whatsappChannel: "https://whatsapp.com/channel/defenceindia",
  telegram: "https://t.me/defenceindia",
  social: { x: "https://x.com/defenceindia", instagram: "https://instagram.com/defenceindia", linkedin: "https://linkedin.com/company/defenceindia", facebook: "https://facebook.com/defenceindia" },
  /* Donations / support rails. Replace handles with live ones. */
  support: { upiId: "defenceindia@upi", buyMeACoffee: "https://buymeacoffee.com/defenceindia", paypal: "https://paypal.me/defenceindia", githubSponsors: "https://github.com/sponsors/webworksa1", razorpay: "" },
  /* Affiliate tags (Amazon India etc.). */
  affiliate: { amazonTag: "defenceindia-21" },
  /* Contest currently open (shown on /contests/). */
  contest: { title: "Defence Quiz Championship — Season 1", deadline: "2026-12-15", prize: "₹25,000 prize pool + certificates + featured profile" }
};
