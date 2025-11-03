export const scrollToId = (id: string, headerSelector = 'header') => {
  const element = document.getElementById(id);
  const header = document.querySelector(headerSelector);

  if (!element) return;

  const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;

  const top =
    element.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top,
    behavior: 'smooth',
  });
};
