"use client";
import React, { useEffect, useRef, useState } from "react";
import { Carousel, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ImageUrlModel from "@/models/commonModel/imageUrlModel";
import "./GallerySwiperPrimary.css";

interface GallerySwiperPrimaryProps {
  images: ImageUrlModel[];
}

const GallerySwiperPrimary: React.FC<GallerySwiperPrimaryProps> = ({ images = [] }) => {
  const carouselRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  const handleBeforeChange = (_: number, next: number) => setActiveIndex(next);

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    carouselRef.current?.goTo(index);
  };

  useEffect(() => {
    if (!thumbRef.current) return;
    const container = thumbRef.current;
    const thumbs = container.querySelectorAll(".edge-thumb");

    const activeThumb = thumbs[activeIndex] as HTMLElement;
    if (activeThumb) {
      const offsetLeft = activeThumb.offsetLeft;
      const containerWidth = container.clientWidth;
      const thumbWidth = activeThumb.clientWidth;

      // Auto adjust so that last images stay visible
      const scrollPosition = Math.max(
        0,
        offsetLeft - containerWidth / 2 + thumbWidth
      );

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  if (images.length === 0) return null;

  return (
    <div className="edge-gallery-container">
      <Carousel
        ref={carouselRef}
        dots={false}
        infinite
        draggable
        speed={500}
        slidesToShow={2}
        slidesToScroll={1}
        beforeChange={handleBeforeChange}
        className="edge-carousel"
      >
        {images.map((img, idx) => (
          <div key={idx} className="edge-slide">
            <Image src={img.url} alt={img.id} preview={false} className="!h-full object-cover" loading="eager" />
          </div>
        ))}
      </Carousel>
      <div className="edge-thumbnail-row" ref={thumbRef}>
        {images.map((img, i) => (
          <div className="edge-thumb-wrapper" key={i} onClick={() => handleThumbnailClick(i)}>
            <div className="edge-thumb">
              <img src={img.url} alt={img.id} loading="eager" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySwiperPrimary;
