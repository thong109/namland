import { getGoogleMapsApiKey } from '@/app/googlemap';
import LocationConstant from '@/libs/constants/locationConstant';
import CoordinateModel from '@/models/commonModel/coordinateModel';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMap, InfoWindow, Libraries, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
import './style.scss';
interface GoogleMapComponentProps {
  initCenter?: {
    lat: number;
    lng: number;
  };

  zoom?: number;
  updateLat?: (lat: number) => void;
  updateLng?: (lng: number) => void;
  isMarker?: boolean;
  listMarker?: (CoordinateModel & { id?: string })[];
  markerClickedContent?: (marker: CoordinateModel & { propertyId?: string }) => Promise<string>;
  disabled?: boolean;
  useMarkerCluster?: boolean;
  highlightedMarker?: CoordinateModel & { label: string };
  getLatAndLng?: (lat: number, lng: number, draggable: boolean) => void;
  contentHighlightedMarker?: string;
}

const PMHCenter = LocationConstant.PMHCoordinate;

const googleMapLibrarisToUser: Libraries = ['places', 'marker'];

const GoogleMapComponent = ({
  initCenter,
  zoom = 15,
  updateLat,
  updateLng,
  isMarker,
  listMarker,
  markerClickedContent,
  useMarkerCluster = false,
  highlightedMarker,
  getLatAndLng,
  contentHighlightedMarker,
  disabled = false,
}: GoogleMapComponentProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: getGoogleMapsApiKey(),
    libraries: googleMapLibrarisToUser,
  });

  const [map, setMap] = useState<google.maps.Map>(null);
  const [markerCluster, setMarkerCluster] = useState<MarkerClusterer>(null);
  useEffectOnce(() => {
    updateLat && updateLat(initCenter.lat);
    updateLng && updateLng(initCenter.lng);
  });

  const getPosition = (e) => {
    getLatAndLng(e.latLng.lat(), e.latLng.lng(), true);
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.getStreetView().setOptions({
      addressControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT,
      },
    });

    const cluster = new MarkerClusterer({
      map,
      renderer: {
        render: (cluster, stats, map) => {
          // create svg url with fill color
          const color = '#4b4e54';

          return new google.maps.Marker({
            position: cluster.position,
            label: {
              text: String(cluster.count),
              color: 'rgba(255,255,255,0.9)',
              fontSize: '12px',
            },
            zIndex: 1000 + cluster.count,
          });
        },
      },
    });
    setMarkerCluster(cluster);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleCenterChange = () => {
    if (map !== null && typeof map !== 'undefined') {
      if (updateLat) {
        updateLat(map.getCenter().lat());
      }

      if (updateLng) {
        updateLng(map.getCenter().lng());
      }
    }
  };

  useEffect(() => {
    if (map !== null) addMarkerCluster();
  }, [listMarker, highlightedMarker]);

  const addMarkerCluster = () => {
    if (useMarkerCluster === true) {
      const infoWindow = new google.maps.InfoWindow({
        content: '',
        disableAutoPan: true,
      });
      const markers = listMarker
        .filter(
          (position) =>
            !highlightedMarker ||
            highlightedMarker.lat !== position.lat ||
            highlightedMarker.lng !== position.lng,
        )
        .map((position, i) => {
          const marker = new google.maps.Marker({
            position,
          });
          marker.addListener('mouseover', async () => {
            if (markerClickedContent) {
              const contentString = await markerClickedContent(position);
              infoWindow.setContent(contentString);
              infoWindow.open(map, marker);
            }
          });
          marker.addListener('click', async () => {
            if (markerClickedContent) {
              const contentString = await markerClickedContent(position);

              infoWindow.setContent(contentString);
              infoWindow.open(map, marker);
            }
          });
          return marker;
        });

      markerCluster.clearMarkers(true);
      markerCluster.addMarkers(markers);
    }
  };
  return isLoaded ? (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      zoom={zoom}
      center={initCenter}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onCenterChanged={handleCenterChange}
      options={{
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: false,
        gestureHandling: 'cooperative',
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}

      <>
        {!useMarkerCluster &&
          isMarker &&
          listMarker &&
          listMarker.map((item, index) => {
            return (
              <Marker
                draggable={!disabled ? true : false}
                onDragEnd={(e) => (getLatAndLng ? getPosition(e) : undefined)}
                key={index + 1}
                position={item}
              />
            );
          })}

        {highlightedMarker && highlightedMarker.lat && highlightedMarker.lng && (
          <Marker
            position={highlightedMarker}
            options={{ animation: google.maps.Animation.BOUNCE }}
          >
            <InfoWindow
              options={{ pixelOffset: new google.maps.Size(0, -50) }}
              position={highlightedMarker}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: contentHighlightedMarker,
                }}
              ></div>
            </InfoWindow>
          </Marker>
        )}
      </>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(GoogleMapComponent);
