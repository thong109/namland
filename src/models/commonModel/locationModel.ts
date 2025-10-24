export default interface LocationModel {
  province: string;
  district: string;
  ward: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
}
