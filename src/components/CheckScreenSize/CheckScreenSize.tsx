import { useEffect, useState } from 'react';

const useCheckScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true); // Kích thước màn hình mobile
      } else {
        setIsMobile(false); // Kích thước màn hình lớn hơn
      }
    };

    // Check kích thước màn hình ban đầu
    handleResize();

    // Thêm sự kiện 'resize' để theo dõi thay đổi kích thước màn hình
    window.addEventListener('resize', handleResize);

    // Clean up sự kiện khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useCheckScreenSize;
