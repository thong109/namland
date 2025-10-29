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

const lastIndex = 3;

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
                {images.slice(0, 5).map((img, idx) => {
                  const isLastVisible = idx === 5 && images.length > lastIndex;
                  return (
                    <div className='gallery-common-primary__entry' key={img.id}>
                      <div className='gallery-common-primary__entry-wrapper'>
                        <Image
                          className='hidden'
                          src={img.url}
                          alt={img.id}
                          width={600}
                          height={600}
                          onLoad={(e) => {
                            setSource(idx, {
                              src: e.currentTarget.currentSrc,
                              srcset: e.currentTarget.srcset,
                            });
                          }}
                          priority
                        />
                        {imagesLoading[idx] ? (
                          renderLoading()
                        ) : (
                          <AntImage rootClassName='gallery-common-primary__entry-visual' src={img.src} srcSet={img.srcSet} alt={img.id} onClick={() => setCurrentPreview(idx)} />
                        )}
                        {isLastVisible && (
                          <div
                            className='absolute left-0 top-0 flex size-full cursor-pointer items-center justify-center bg-neutral-800 bg-opacity-75 text-4xl font-bold text-neutral-0'
                            onClick={() => {
                              setCurrentPreview(lastIndex);
                              setPreviewVisible(true);
                            }}
                          >
                            +{images.length - lastIndex}
                            {images.slice(lastIndex).map((image, index2) => (
                              <AntImage key={index2} src={image.url} alt={image.id} className='hidden' />
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
