'use client';

import ImageUrlModel from '@/models/commonModel/imageUrlModel';
import { Image as AntImage, Spin } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import './GalleryPrimary.css';

interface GalleryPrimaryProps {
  images: ImageUrlModel[];
}

const GalleryPrimary: React.FC<GalleryPrimaryProps> = ({ images: initImages = [] }) => {
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<(ImageUrlModel & { src?: string; srcSet?: string })[]>([]);
  const [imagesLoading, setImagesLoading] = useState<boolean[]>([]);

  useEffect(() => {
    setImages(initImages.map((image) => ({ ...image, src: '', srcSet: '' })));
    setImagesLoading(new Array(initImages.length).fill(true));
  }, [initImages]);

  const setSource = (index: number, data: { src: string; srcSet: string }) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, src: data.src, srcSet: data.srcSet } : img))
    );
    setImagesLoading((prev) => prev.map((val, i) => (i === index ? false : val)));
  };

  const renderLoading = useCallback(
    () => <Spin className='flex h-full items-center justify-center' />,
    []
  );

  if (!images.length) return null;

  return (
    <AntImage.PreviewGroup
      preview={{
        visible: isPreviewVisible,
        current: currentPreview,
        onChange: (current) => setCurrentPreview(current),
        onVisibleChange: (visible, _, current) => {
          setPreviewVisible(visible);
          setCurrentPreview(current);
        },
        imageRender: (originalNode, { transform, current }) => (
          <img
            className='ant-image-preview-img'
            src={images[current]?.url}
            alt={images[current]?.id}
            style={{
              transform: `
                translate3d(${transform.x}px, ${transform.y}px, 0)
                scale3d(${transform.flipX ? -transform.scale : transform.scale},
                        ${transform.flipY ? -transform.scale : transform.scale},
                        ${transform.scale})
                rotate(${transform.rotate}deg)
              `,
            }}
          />
        ),
      }}
    >
      <div className='gallery-common-primary container'>
        <div className='gallery-common-primary__viewport'>
          <div className='gallery-common-primary__wrapper'>
            {images.slice(0, 5).map((image, i) => {
              const imageIndexLast = 4;
              const isItemLast = i === imageIndexLast && images.length > 5;
              return (
                <div className='gallery-common-primary__entry' key={`${image?.id || 'img'}-${i}`}>
                  <div className='gallery-common-primary__entry-wrapper'>
                    <Image
                      className='hidden'
                      src={image.url}
                      alt={image.id}
                      width={600}
                      height={600}
                      onLoad={(e) => {
                        setSource(i, {
                          src: e.currentTarget.currentSrc,
                          srcSet: e.currentTarget.srcset,
                        });
                      }}
                      priority
                    />
                    {imagesLoading[i] ? (
                      renderLoading()
                    ) : (
                      <AntImage
                        rootClassName='gallery-common-primary__entry-visual'
                        src={image.src}
                        srcSet={image.srcSet}
                        alt={image.id}
                        onClick={() => {
                          setCurrentPreview(i);
                          setPreviewVisible(true);
                        }}
                      />
                    )}
                    {isItemLast && (
                      <div
                        className='gallery-common-primary__visual-mask'
                        onClick={() => {
                          setCurrentPreview(imageIndexLast);
                          setPreviewVisible(true);
                        }}
                      >
                        +{images.length - imageIndexLast}
                        {images.slice(imageIndexLast).map((imageFinal, imageIndexFinal) => (
                          <AntImage className='hidden' key={`${imageFinal?.id || 'img'}-${imageIndexFinal}`} src={imageFinal.url} alt={imageFinal.id} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AntImage.PreviewGroup>
  );
};

export default GalleryPrimary;
