'use client';

import ImageUrlModel from '@/models/commonModel/imageUrlModel';
import { Image as AntImage, ImageProps, Spin } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

interface GalleryPrimaryProps {
  images: ImageUrlModel[];
}

const lastIndex = 3;

const GalleryPrimaryShowOnlyOne: React.FC<GalleryPrimaryProps> = ({ images: initImages = [] }) => {
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
    () => <Spin className="flex h-full items-center justify-center" />,
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
                srcSet={null}
                className="ant-image-preview-img"
                src={images[current]?.url}
                alt={images[current]?.id}
                style={{
                  transform: clsx(
                    `translate3d(${transform.x}px, ${transform.y}px, 0px)`,
                    `scale3d(${transform.flipX ? -transform.scale : transform.scale}, ${transform.flipY ? -transform.scale : transform.scale},${transform.scale})`,
                    `rotate(${transform.rotate}deg)`,
                  ),
                  // transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotate(0deg);
                }}
              />
            );
          },
        }}
      >
        <div className="relative grid max-h-[96px] max-w-[144px] grid-cols-12 grid-rows-12 gap-1 lg:max-h-[172px] lg:max-w-[320px] [&_.ant-image]:h-full [&_.ant-image_img]:h-full [&_.ant-image_img]:object-cover">
          <div
            className={clsx(
              'relative row-span-12',
              images.length === 1 ? 'col-span-12' : 'col-span-9',
            )}
          >
            {images[0] && (
              <>
                <Image
                  src={images[0]?.url}
                  alt={images[0]?.id}
                  className="hidden"
                  width={900}
                  height={1200}
                  onLoad={(e) => {
                    setSource(0, {
                      src: e.currentTarget.currentSrc,
                      srcset: e.currentTarget.srcset,
                    });
                  }}
                  priority
                />
                {imagesLoading[0] ? (
                  renderLoading()
                ) : (
                  <AntImage
                    src={images[0]?.src}
                    srcSet={images[0]?.srcSet}
                    alt={images[0]?.id}
                    rootClassName="w-full"
                    onClick={() => setCurrentPreview(0)}
                    fetchPriority="high"
                    loading="eager"
                  />
                )}
              </>
            )}
          </div>
          {images[1] && (
            <div
              className={clsx(
                'relative col-span-3',
                images.length === 2 && 'row-span-12',
                images.length === 3 && 'row-span-6',
                images.length > 3 && 'row-span-4',
              )}
            >
              <Image
                src={images[1]?.url}
                alt={images[1]?.id}
                className="hidden"
                width={600}
                height={600}
                onLoad={(e) => {
                  setSource(1, {
                    src: e.currentTarget.currentSrc,
                    srcset: e.currentTarget.srcset,
                  });
                }}
                priority
              />
              {imagesLoading[1] ? (
                renderLoading()
              ) : (
                <AntImage
                  src={images[1]?.src}
                  srcSet={images[1]?.srcSet}
                  alt={images[1]?.id}
                  rootClassName="w-full"
                  onClick={() => setCurrentPreview(1)}
                />
              )}
            </div>
          )}
          {images[2] && (
            <div
              className={clsx(
                'relative col-span-3',
                images.length === 3 && 'row-span-6',
                images.length > 3 && 'row-span-4',
              )}
            >
              <Image
                src={images[2]?.url}
                alt={images[2]?.id}
                className="hidden"
                width={400}
                height={400}
                onLoad={(e) => {
                  setSource(2, {
                    src: e.currentTarget.currentSrc,
                    srcset: e.currentTarget.srcset,
                  });
                }}
                priority
              />
              {imagesLoading[2] ? (
                renderLoading()
              ) : (
                <AntImage
                  src={images[2]?.src}
                  srcSet={images[2]?.srcSet}
                  alt={images[2]?.id}
                  rootClassName="w-full"
                  onClick={() => setCurrentPreview(2)}
                />
              )}
            </div>
          )}
          {images[3] && (
            <div className={clsx('relative col-span-3 row-span-4')}>
              <Image
                src={images[3]?.url}
                alt={images[3]?.id}
                className="hidden"
                width={400}
                height={400}
                onLoad={(e) => {
                  setSource(3, {
                    src: e.currentTarget.currentSrc,
                    srcset: e.currentTarget.srcset,
                  });
                }}
                priority
              />
              {imagesLoading[3] ? (
                renderLoading()
              ) : (
                <AntImage
                  src={images[3]?.src}
                  srcSet={images[3]?.srcSet}
                  alt={images[3]?.id}
                  rootClassName="w-full"
                  onClick={() => setCurrentPreview(3)}
                />
              )}
              {images.length > lastIndex && (
                <div
                  className="absolute left-0 top-0 flex size-full cursor-pointer items-center justify-center bg-neutral-800 bg-opacity-75 text-4xl font-bold text-neutral-0"
                  onClick={() => {
                    setCurrentPreview(lastIndex);
                    setPreviewVisible(true);
                  }}
                >
                  +{images.length - lastIndex}
                  {images.slice(lastIndex + 1, images.length - 1).map((image, index) => (
                    <AntImage key={index} src={image.url} alt={image.id} className="hidden" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AntImage.PreviewGroup>
    </>
  );
};

export default GalleryPrimaryShowOnlyOne;
