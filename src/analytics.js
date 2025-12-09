export const pageview = (url) => {
  window.gtag("config", "G-E94GQ9BFSF", {
    page_path: url,
  });
};
