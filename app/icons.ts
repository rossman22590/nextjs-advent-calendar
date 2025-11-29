import {
  IconDefinition,
  faBaby,
  faBabyCarriage,
  faBell,
  faCandyCane,
  faFire,
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
  faSnowflake,    // Day 1
  faMitten,       // Day 2
  faStar,         // Day 3
  faCookieBite,   // Day 4
  faHollyBerry,   // Day 5
  faCandyCane,    // Day 6
  faBell,         // Day 7
  faGift,         // Day 8
  faIgloo,        // Day 9
  faSleigh,       // Day 10
  faTree,         // Day 11
  faMugHot,       // Day 12
  faStarHalfAlt,  // Day 13
  faGifts,        // Day 14
  faCandyCane,    // Day 15
  faSnowman,      // Day 16
  faFire,         // Day 17 - Candle flame
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
