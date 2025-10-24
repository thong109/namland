let googleMapsApiKey: string | undefined;

export const setGoogleMapsApiKey = (key: string) => {
  googleMapsApiKey = key;
};

export const getGoogleMapsApiKey = (): string => {
  if (!googleMapsApiKey) {
    throw new Error('Google Maps API key has not been set yet.');
  }
  return googleMapsApiKey;
};
