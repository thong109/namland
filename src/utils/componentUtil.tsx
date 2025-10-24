import ImageProperties from '@/assets/images/img-properties.png';
import IconAirConditioner from '@/components/Icons/IconAirConditioner';
import IconBBQ from '@/components/Icons/IconBBQ';
import IconDiningRoom from '@/components/Icons/IconDiningRoom';
import IconDryer from '@/components/Icons/IconDryer';
import IconGym from '@/components/Icons/IconGym';
import IconLaundry from '@/components/Icons/IconLaundry';
import IconLawn from '@/components/Icons/IconLawn';
import IconMicrowave from '@/components/Icons/IconMicrowave';
import IconOutdoorShower from '@/components/Icons/IconOutdoorShower';
import IconRefrigerator from '@/components/Icons/IconRefrigerator';
import IconSauna from '@/components/Icons/IconSauna';
import IconSwimmingPool from '@/components/Icons/IconSwimmingPool';
import IconTvCable from '@/components/Icons/IconTvCable';
import IconWasher from '@/components/Icons/IconWasher';
import IconWifi from '@/components/Icons/IconWifi';
import IconWindowCoverings from '@/components/Icons/IconWindowCoverings';
import { isMobile } from 'react-device-detect';
import NumberUtil from './numberUtil';
export default class Componentutil {
  static RenderAmenitityIcon(amenitityCode: string) {
    switch (amenitityCode) {
      case 'AirConditioning':
        return <IconAirConditioner />;
      case 'Barbeque':
        return <IconBBQ />;
      case 'Dryer':
        return <IconDryer />;
      case 'Gym':
        return <IconGym />;
      case 'Lawn':
        return <IconLawn />;
      case 'Laudry':
        return <IconLaundry />;
      case 'Microwave':
        return <IconMicrowave />;
      case 'OutdoorShower':
        return <IconOutdoorShower />;
      case 'Refrigerator':
        return <IconRefrigerator />;
      case 'Sauna':
        return <IconSauna />;
      case 'SwimmingPool':
        return <IconSwimmingPool />;
      case 'TVCable':
        return <IconTvCable />;
      case 'Washer':
        return <IconWasher />;
      case 'Wifi':
        return <IconWifi />;
      case 'WindowConverings':
        return <IconWindowCoverings />;
      case 'DiningRoom':
        return <IconDiningRoom />;
      default:
        return null;
    }
  }

  static GetGoogleMapPopupContentString(
    url: string,
    image: string,
    title: string,
    address: string,
    priceVnd: number,
    priceUsd: number,
    locale: string,
  ) {
    const renderImage = !isMobile
      ? `    <div class="thumbnail-wrapper">
    <img
      src="${image || ImageProperties.src}"
      alt="property-image"
      style="max-height:120px"
    />
  </div>`
      : ``;
    return `
    <a href="${url}" class="marker-popup">
      ${renderImage}
     
      <div class="marker-popup-title">${title}</div>
      <div class="marker-popup-address">${address}</div>
      <div class="marker-popup-price">${
        locale === 'vi'
          ? NumberUtil.formatNumberToTrieuTy(priceVnd)
          : `$${NumberUtil.numberWithCommas(priceUsd)}`
      }</div>
    </a>
`;
  }
}
