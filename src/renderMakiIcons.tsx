import ReactDOM from "react-dom";
import * as L from "leaflet";
import { IDMapMarker } from "./IDMapMarker";

export const renderMakiIcons = (): Promise<Record<string, L.DivIcon>> => {
  console.log(
    "Rending Maki Icons, this can be quite expensive make sure you want to."
  );

  const svgRenderEl = document.createElement("div");
  svgRenderEl.style.display = "none";
  document.body.appendChild(svgRenderEl);

  return new Promise((resolve, reject) => {
    // @ts-ignore
    ReactDOM.render(
      <>
        {icons.map((id) => (
          <IDMapMarker iconId={id} />
        ))}
      </>,
      svgRenderEl,
      () => {
        const allIcons = icons.map((id) => {
          return [
            id,
            L.divIcon({
              className: "leaflet-id-icon",
              //@ts-ignore
              html: document.getElementById("render-" + id).innerHTML,
              iconSize: [18, 24],
              iconAnchor: [9, 25],
            }),
          ];
        });
        svgRenderEl.remove();

        resolve(Object.fromEntries(allIcons));
      }
    );
  });
};

export const icons = [
  "maki-aerialway-11",
  "maki-aerialway-15",
  "maki-airfield-11",
  "maki-airfield-15",
  "maki-airport-11",
  "maki-airport-15",
  "maki-alcohol-shop-11",
  "maki-alcohol-shop-15",
  "maki-american-football-11",
  "maki-american-football-15",
  "maki-amusement-park-11",
  "maki-amusement-park-15",
  "maki-aquarium-11",
  "maki-aquarium-15",
  "maki-art-gallery-11",
  "maki-art-gallery-15",
  "maki-attraction-11",
  "maki-attraction-15",
  "maki-bakery-11",
  "maki-bakery-15",
  "maki-bank-11",
  "maki-bank-15",
  "maki-bank-JP-11",
  "maki-bank-JP-15",
  "maki-bar-11",
  "maki-bar-15",
  "maki-barrier-11",
  "maki-barrier-15",
  "maki-baseball-11",
  "maki-baseball-15",
  "maki-basketball-11",
  "maki-basketball-15",
  "maki-bbq-11",
  "maki-bbq-15",
  "maki-beach-11",
  "maki-beach-15",
  "maki-beer-11",
  "maki-beer-15",
  "maki-bicycle-11",
  "maki-bicycle-15",
  "maki-bicycle-share-11",
  "maki-bicycle-share-15",
  "maki-blood-bank-11",
  "maki-blood-bank-15",
  "maki-bowling-alley-11",
  "maki-bowling-alley-15",
  "maki-bridge-11",
  "maki-bridge-15",
  "maki-building-11",
  "maki-building-15",
  "maki-building-alt1-11",
  "maki-building-alt1-15",
  "maki-bus-11",
  "maki-bus-15",
  "maki-cafe-11",
  "maki-cafe-15",
  "maki-campsite-11",
  "maki-campsite-15",
  "maki-car-11",
  "maki-car-15",
  "maki-car-rental-11",
  "maki-car-rental-15",
  "maki-car-repair-11",
  "maki-car-repair-15",
  "maki-casino-11",
  "maki-casino-15",
  "maki-castle-11",
  "maki-castle-15",
  "maki-castle-JP-11",
  "maki-castle-JP-15",
  "maki-cemetery-11",
  "maki-cemetery-15",
  "maki-cemetery-JP-11",
  "maki-cemetery-JP-15",
  "maki-charging-station-11",
  "maki-charging-station-15",
  "maki-cinema-11",
  "maki-cinema-15",
  "maki-circle-11",
  "maki-circle-15",
  "maki-circle-stroked-11",
  "maki-circle-stroked-15",
  "maki-city-11",
  "maki-city-15",
  "maki-clothing-store-11",
  "maki-clothing-store-15",
  "maki-college-11",
  "maki-college-15",
  "maki-college-JP-11",
  "maki-college-JP-15",
  "maki-commercial-11",
  "maki-commercial-15",
  "maki-communications-tower-11",
  "maki-communications-tower-15",
  "maki-confectionery-11",
  "maki-confectionery-15",
  "maki-convenience-11",
  "maki-convenience-15",
  "maki-cricket-11",
  "maki-cricket-15",
  "maki-cross-11",
  "maki-cross-15",
  "maki-dam-11",
  "maki-dam-15",
  "maki-danger-11",
  "maki-danger-15",
  "maki-defibrillator-11",
  "maki-defibrillator-15",
  "maki-dentist-11",
  "maki-dentist-15",
  "maki-doctor-11",
  "maki-doctor-15",
  "maki-dog-park-11",
  "maki-dog-park-15",
  "maki-drinking-water-11",
  "maki-drinking-water-15",
  "maki-embassy-11",
  "maki-embassy-15",
  "maki-emergency-phone-11",
  "maki-emergency-phone-15",
  "maki-entrance-11",
  "maki-entrance-15",
  "maki-entrance-alt1-11",
  "maki-entrance-alt1-15",
  "maki-farm-11",
  "maki-farm-15",
  "maki-fast-food-11",
  "maki-fast-food-15",
  "maki-fence-11",
  "maki-fence-15",
  "maki-ferry-11",
  "maki-ferry-15",
  "maki-fire-station-11",
  "maki-fire-station-15",
  "maki-fire-station-JP-11",
  "maki-fire-station-JP-15",
  "maki-fitness-centre-11",
  "maki-fitness-centre-15",
  "maki-florist-11",
  "maki-florist-15",
  "maki-fuel-11",
  "maki-fuel-15",
  "maki-furniture-11",
  "maki-furniture-15",
  "maki-gaming-11",
  "maki-gaming-15",
  "maki-garden-11",
  "maki-garden-15",
  "maki-garden-centre-11",
  "maki-garden-centre-15",
  "maki-gift-11",
  "maki-gift-15",
  "maki-globe-11",
  "maki-globe-15",
  "maki-golf-11",
  "maki-golf-15",
  "maki-grocery-11",
  "maki-grocery-15",
  "maki-hairdresser-11",
  "maki-hairdresser-15",
  "maki-harbor-11",
  "maki-harbor-15",
  "maki-hardware-11",
  "maki-hardware-15",
  "maki-heart-11",
  "maki-heart-15",
  "maki-heliport-11",
  "maki-heliport-15",
  "maki-home-11",
  "maki-home-15",
  "maki-horse-riding-11",
  "maki-horse-riding-15",
  "maki-hospital-11",
  "maki-hospital-15",
  "maki-hospital-JP-11",
  "maki-hospital-JP-15",
  "maki-ice-cream-11",
  "maki-ice-cream-15",
  "maki-industry-11",
  "maki-industry-15",
  "maki-information-11",
  "maki-information-15",
  "maki-jewelry-store-11",
  "maki-jewelry-store-15",
  "maki-karaoke-11",
  "maki-karaoke-15",
  "maki-landmark-11",
  "maki-landmark-15",
  "maki-landmark-JP-11",
  "maki-landmark-JP-15",
  "maki-landuse-11",
  "maki-landuse-15",
  "maki-laundry-11",
  "maki-laundry-15",
  "maki-library-11",
  "maki-library-15",
  "maki-lighthouse-11",
  "maki-lighthouse-15",
  "maki-lodging-11",
  "maki-lodging-15",
  "maki-logging-11",
  "maki-logging-15",
  "maki-marker-11",
  "maki-marker-15",
  "maki-marker-stroked-11",
  "maki-marker-stroked-15",
  "maki-mobile-phone-11",
  "maki-mobile-phone-15",
  "maki-monument-11",
  "maki-monument-15",
  "maki-mountain-11",
  "maki-mountain-15",
  "maki-museum-11",
  "maki-museum-15",
  "maki-music-11",
  "maki-music-15",
  "maki-natural-11",
  "maki-natural-15",
  "maki-optician-11",
  "maki-optician-15",
  "maki-paint-11",
  "maki-paint-15",
  "maki-park-11",
  "maki-park-15",
  "maki-park-alt1-11",
  "maki-park-alt1-15",
  "maki-parking-11",
  "maki-parking-15",
  "maki-parking-garage-11",
  "maki-parking-garage-15",
  "maki-pharmacy-11",
  "maki-pharmacy-15",
  "maki-picnic-site-11",
  "maki-picnic-site-15",
  "maki-pitch-11",
  "maki-pitch-15",
  "maki-place-of-worship-11",
  "maki-place-of-worship-15",
  "maki-playground-11",
  "maki-playground-15",
  "maki-police-11",
  "maki-police-15",
  "maki-police-JP-11",
  "maki-police-JP-15",
  "maki-post-11",
  "maki-post-15",
  "maki-post-JP-11",
  "maki-post-JP-15",
  "maki-prison-11",
  "maki-prison-15",
  "maki-rail-11",
  "maki-rail-15",
  "maki-rail-light-11",
  "maki-rail-light-15",
  "maki-rail-metro-11",
  "maki-rail-metro-15",
  "maki-ranger-station-11",
  "maki-ranger-station-15",
  "maki-recycling-11",
  "maki-recycling-15",
  "maki-religious-buddhist-11",
  "maki-religious-buddhist-15",
  "maki-religious-christian-11",
  "maki-religious-christian-15",
  "maki-religious-jewish-11",
  "maki-religious-jewish-15",
  "maki-religious-muslim-11",
  "maki-religious-muslim-15",
  "maki-religious-shinto-11",
  "maki-religious-shinto-15",
  "maki-residential-community-11",
  "maki-residential-community-15",
  "maki-restaurant-11",
  "maki-restaurant-15",
  "maki-restaurant-noodle-11",
  "maki-restaurant-noodle-15",
  "maki-restaurant-pizza-11",
  "maki-restaurant-pizza-15",
  "maki-restaurant-seafood-11",
  "maki-restaurant-seafood-15",
  "maki-roadblock-11",
  "maki-roadblock-15",
  "maki-rocket-11",
  "maki-rocket-15",
  "maki-school-11",
  "maki-school-15",
  "maki-school-JP-11",
  "maki-school-JP-15",
  "maki-scooter-11",
  "maki-scooter-15",
  "maki-shelter-11",
  "maki-shelter-15",
  "maki-shoe-11",
  "maki-shoe-15",
  "maki-shop-11",
  "maki-shop-15",
  "maki-skateboard-11",
  "maki-skateboard-15",
  "maki-skiing-11",
  "maki-skiing-15",
  "maki-slaughterhouse-11",
  "maki-slaughterhouse-15",
  "maki-slipway-11",
  "maki-slipway-15",
  "maki-snowmobile-11",
  "maki-snowmobile-15",
  "maki-soccer-11",
  "maki-soccer-15",
  "maki-square-11",
  "maki-square-15",
  "maki-square-stroked-11",
  "maki-square-stroked-15",
  "maki-stadium-11",
  "maki-stadium-15",
  "maki-star-11",
  "maki-star-15",
  "maki-star-stroked-11",
  "maki-star-stroked-15",
  "maki-suitcase-11",
  "maki-suitcase-15",
  "maki-sushi-11",
  "maki-sushi-15",
  "maki-swimming-11",
  "maki-swimming-15",
  "maki-table-tennis-11",
  "maki-table-tennis-15",
  "maki-teahouse-11",
  "maki-teahouse-15",
  "maki-telephone-11",
  "maki-telephone-15",
  "maki-tennis-11",
  "maki-tennis-15",
  "maki-theatre-11",
  "maki-theatre-15",
  "maki-toilet-11",
  "maki-toilet-15",
  "maki-town-11",
  "maki-town-15",
  "maki-town-hall-11",
  "maki-town-hall-15",
  "maki-triangle-11",
  "maki-triangle-15",
  "maki-triangle-stroked-11",
  "maki-triangle-stroked-15",
  "maki-veterinary-11",
  "maki-veterinary-15",
  "maki-viewpoint-11",
  "maki-viewpoint-15",
  "maki-village-11",
  "maki-village-15",
  "maki-volcano-11",
  "maki-volcano-15",
  "maki-volleyball-11",
  "maki-volleyball-15",
  "maki-warehouse-11",
  "maki-warehouse-15",
  "maki-waste-basket-11",
  "maki-waste-basket-15",
  "maki-watch-11",
  "maki-watch-15",
  "maki-water-11",
  "maki-water-15",
  "maki-waterfall-11",
  "maki-waterfall-15",
  "maki-watermill-11",
  "maki-watermill-15",
  "maki-wetland-11",
  "maki-wetland-15",
  "maki-wheelchair-11",
  "maki-wheelchair-15",
  "maki-windmill-11",
  "maki-windmill-15",
  "maki-zoo-11",
  "maki-zoo-15",
];
