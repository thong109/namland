'use client';

import ImageUrlModel from '@/models/commonModel/imageUrlModel';
import { Image as AntImage, ImageProps, Spin } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

interface BigGalleryProps {
  images: ImageUrlModel[];
}

const lastIndex = 3;

const BigGallery: React.FC<BigGalleryProps> = ({ images: initImages = [] }) => {
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
        <div className="grid grid-cols-12 gap-1 [&_.ant-image]:h-full [&_.ant-image_img]:h-full [&_.ant-image_img]:object-cover max-h-[90vh] overflow-hidden">
          <div className="relative col-span-6 row-span-12 overflow-hidden">
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
                    rootClassName="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onClick={() => setCurrentPreview(0)}
                  />
                )}
              </>
            )}
          </div>

          <div className="col-span-6 grid grid-cols-2 grid-rows-2 gap-1">
            {images.slice(1, 5).map((img, idx) => {
              const index = idx + 1;
              const isLastVisible = index === 4 && images.length > lastIndex;

              return (
                <div key={img.id} className="relative overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.id}
                    className="hidden"
                    width={600}
                    height={600}
                    onLoad={(e) => {
                      setSource(index, {
                        src: e.currentTarget.currentSrc,
                        srcset: e.currentTarget.srcset,
                      });
                    }}
                    priority
                  />

                  {imagesLoading[index] ? (
                    renderLoading()
                  ) : (
                    <AntImage
                      src={img.src}
                      srcSet={img.srcSet}
                      alt={img.id}
                      rootClassName="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onClick={() => setCurrentPreview(index)}
                    />
                  )}

                  {isLastVisible && (
                    <div
                      className="absolute left-0 top-0 flex size-full cursor-pointer items-center justify-center bg-neutral-800 bg-opacity-75 text-4xl font-bold text-neutral-0"
                      onClick={() => {
                        setCurrentPreview(lastIndex);
                        setPreviewVisible(true);
                      }}
                    >
                      +{images.length - lastIndex}
                      {images.slice(lastIndex).map((image, index2) => (
                        <AntImage key={index2} src={image.url} alt={image.id} className="hidden" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AntImage.PreviewGroup>
    </>
  );
};

export default BigGallery;
