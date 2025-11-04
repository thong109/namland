import { ChevronUpIcon } from '@heroicons/react/24/outline';
const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button className='button-common-totop' onClick={scrollToTop}></button>
  );
};

export default ScrollToTopButton;
