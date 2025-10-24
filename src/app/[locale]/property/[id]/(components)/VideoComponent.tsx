// https://www.youtube.com/watch?v=4Ra293cHkdU
'use-client';
import PlayIcon from '@/assets/icon/play-icon.svg';
import ImgVieo from '@/assets/images/imgvideo.png';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
const VideoComponent = ({ data }: any) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');
  const [stateChoose, setStateChoose] = useState(data?.videoLink ? 'video' : '360view');
  const success = useTranslations('successNotifi');
  const isActive = 'text-primaryColor  underline font-semibold';
  return (
    <>
      <div className="flex">
        {data?.videoLink ? (
          <div
            className={`${stateChoose == 'video' ? isActive : ''} cursor-pointer pr-2`}
            onClick={() => {
              setStateChoose('video');
            }}
          >
            {t('EcomPropertyDetailPageVideoPropertyVideo')}
          </div>
        ) : null}
        {data?.virtualTour ? (
          <div
            className={`${stateChoose == '360view' ? isActive : ''} cursor-pointer pl-2`}
            onClick={() => {
              setStateChoose('360view');
            }}
          >
            {t('EcomPropertyDetailPageVideo360°VirtualTour')}
          </div>
        ) : null}
      </div>

      <div className={`${stateChoose == 'video' ? 'block' : 'hidden'} mt-[30px]`}>
        {data?.videoLink ? (
          <div className="h-[300px] lg:h-[484px]">
            <ReactPlayer
              width="100%"
              height="100%"
              // url={`https://www.youtube.com/watch?v=KQ8xYBnK4NQ`}
              url={data?.videoLink}
              light={ImgVieo.src}
              playIcon={<img src={PlayIcon.src}></img>}
              stopOnUnmount
              playing={stateChoose == 'video'}
            />
          </div>
        ) : (
          <span>{t('noData')}</span>
        )}
      </div>
      <div className={`${stateChoose == '360view' ? 'block' : 'hidden'} mt-[30px]`}>
        {data?.virtualTour ? (
          <div className="h-[300px] lg:h-[484px]">
            <iframe
              loading="lazy"
              className="h-full w-full"
              src={data?.virtualTour}
              // src="https://kuula.co/share/collection/7qMwX"
              width="100%"
              height="580"
              frameBorder="0"
              scrolling="0"
              allowFullScreen
            >
              <span data-mce-type="bookmark"></span>
            </iframe>
          </div>
        ) : (
          <span>{t('noData')}</span>
        )}
      </div>
    </>
  );
};

export default VideoComponent;
