'use client';

import ImageUrlModel from '@/models/commonModel/imageUrlModel';
import { Image as AntImage, ImageProps, Spin } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import './GalleryPrimary.css';

interface GalleryPrimaryProps {
  images: ImageUrlModel[];
}

const GalleryPrimary: React.FC<GalleryPrimaryProps> = ({ images: initImages = [] }) => {
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(undefined);
  const [images, setImages] = useState<(ImageUrlModel & ImageProps)[]>([]);
  const [imagesLoading, setImagesLoading] = useState<boolean[]>([true, true, true, true]);

  useEffect(() => {
    setImages(initImages.map((image) => ({ ...image, src: null, srcSet: null })));
  }, [initImages]);

  const setSource = (index: number, data: { src: string; srcset: string }) => {
    images[index].src = data.src;
    images[index].srcSet = data.srcset;
    setImages([...images]);
    setImagesLoading((prev) => {
      prev[index] = false;
      return [...prev];
    });
  };

  const renderLoading = useCallback(
    () => <Spin className='flex h-full items-center justify-center' />,
    [],
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <AntImage.PreviewGroup
        preview={{
          visible: isPreviewVisible,
          current: currentPreview,
          onChange(current) {
            setCurrentPreview(current);
          },
          onVisibleChange(visible, _, current) {
            setPreviewVisible(visible);
            setCurrentPreview(current);
          },
          imageRender(originalNode, { transform, current }) {
            return (
              <img
                className='ant-image-preview-img'
                srcSet={null}
                src={images[current]?.url}
                alt={images[current]?.id}
                style={{
                  transform: clsx(
                    `translate3d(${transform.x}px, ${transform.y}px, 0px)`,
                    `scale3d(${transform.flipX ? -transform.scale : transform.scale}, ${transform.flipY ? -transform.scale : transform.scale},${transform.scale})`,
                    `rotate(${transform.rotate}deg)`,
                  ),
                }}
              />
            );
          },
        }}
      >
        <div className='gallery-common-primary'>
          <div className='container'>
            <div className='gallery-common-primary__viewport'>
              <div className='gallery-common-primary__wrapper'>
                {images.slice(0, 5).map((image, imageIndex) => {
                  const imageIndexLast = 4;
                  const isItemLast = imageIndex === 4 && images.length > imageIndexLast;
                  return (
                    <div className='gallery-common-primary__entry' key={image.id}>
                      <div className='gallery-common-primary__entry-wrapper'>
                        <Image
                          className='hidden'
                          src={image.url}
                          alt={image.id}
                          width={600}
                          height={600}
                          onLoad={(e) => {
                            setSource(imageIndex, {
                              src: e.currentTarget.currentSrc,
                              srcset: e.currentTarget.srcset,
                            });
                          }}
                          priority
                        />
                        {imagesLoading[imageIndex] ? (
                          renderLoading()
                        ) : (
                          <AntImage rootClassName='gallery-common-primary__entry-visual' src={image.src} srcSet={image.srcSet} alt={image.id} onClick={() => setCurrentPreview(imageIndex)} />
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
                            {images.slice(imageIndexLast).map((image, index2) => (
                              <AntImage className='hidden' key={index2} src={image.url} alt={image.id} />
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
        </div>
      </AntImage.PreviewGroup>
    </>
  );
};

export default GalleryPrimary;
