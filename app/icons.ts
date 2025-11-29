import {
  IconDefinition,
  faBaby,
  faBabyCarriage,
  faBell,
  faCandyCane,
  faCookieBite,
  faGift,
  faGifts,
  faHeart,
  faHeartCircleBolt,
  faHollyBerry,
  faIgloo,
  faMitten,
  faMugHot,
  faSleigh,
  faSnowflake,
  faSnowman,
  faSnowplow,
  faStar,
  faStarHalfAlt,
  faTree,
} from "@fortawesome/free-solid-svg-icons";

// list of all font awesome icons relating to christmas, winter, love, etc.
const christmasIcons = [
  faSnowflake,
  faMitten,
  faStar,
  faCookieBite,
  faHollyBerry,
  faCandyCane,
  faBell,
  faGift,
  faIgloo,
  faSleigh,
  faTree,
  faMugHot,
  faStarHalfAlt,
  faGifts,
  faBaby,
  faSnowman,
  faBabyCarriage,
];

export function getIconForDay(day: number): IconDefinition {
  if (day == 24) {
    return faHeart;
  }

  return christmasIcons[(day - 1) % christmasIcons.length];
}

// Define colorful classes for icons
const iconColors = [
  'text-pink-500',
  'text-purple-500',
  'text-yellow-500',
  'text-pink-600',
  'text-purple-600',
  'text-orange-500',
  'text-red-500',
  'text-blue-500',
  'text-pink-400',
  'text-purple-400',
  'text-yellow-400',
  'text-orange-400',
  'text-red-400',
  'text-blue-400',
  'text-pink-300',
  'text-purple-300',
  'text-yellow-600',
];

export function getIconColor(day: number): string {
  if (day == 24) {
    return 'text-red-500 animate-pulse';
  }
  
  return iconColors[(day - 1) % iconColors.length];
}
