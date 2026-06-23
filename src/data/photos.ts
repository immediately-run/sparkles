export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  date: string;
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface Photo {
  id: string;
  title: string;
  locationName: string;
  url: string;
  thumbnailUrl: string;
  exif: ExifData;
  description: string;
}

export const MOCK_PHOTOS: Photo[] = [
  {
    id: "1",
    title: "Shattered Light at Senso-ji",
    locationName: "Tokyo, Japan",
    url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=250",
    description: "Evening rain clears up as the lanterns of Senso-ji light up, casting rich red reflections on the wet stone path.",
    exif: {
      camera: "Fujifilm X-T5",
      lens: "XF 18-55mm f/2.8-4 R LM OIS",
      focalLength: "23mm",
      aperture: "f/2.8",
      shutterSpeed: "1/60s",
      iso: 800,
      date: "2026-04-12 18:42",
      latitude: 35.7148,
      longitude: 139.7967
    }
  },
  {
    id: "2",
    title: "Golden Hour Paris",
    locationName: "Paris, France",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=250",
    description: "The Seine flows peacefully as the setting sun catches the ironwork of the Eiffel Tower, framing it against a soft magenta sky.",
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 24-70mm f/2.8 GM II",
      focalLength: "35mm",
      aperture: "f/4.0",
      shutterSpeed: "1/125s",
      iso: 100,
      date: "2026-05-18 20:15",
      latitude: 48.8584,
      longitude: 2.2945
    }
  },
  {
    id: "3",
    title: "Brooklyn Bridge Blue Hour",
    locationName: "New York City, USA",
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=250",
    description: "The towering skyscrapers of Manhattan light up one by one, reflected in the East River under a deep blue twilight sky.",
    exif: {
      camera: "Canon EOS R5",
      lens: "RF 24-105mm f/4L IS USM",
      focalLength: "24mm",
      aperture: "f/8.0",
      shutterSpeed: "4.0s",
      iso: 100,
      date: "2026-03-05 19:10",
      latitude: 40.7061,
      longitude: -73.9969
    }
  },
  {
    id: "4",
    title: "Opera House at Sunrise",
    locationName: "Sydney, Australia",
    url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=250",
    description: "The unique sails of the Sydney Opera House catch the first rays of morning light, mirrored on the flat water of the harbor.",
    exif: {
      camera: "Sony Alpha 7 IV",
      lens: "FE 70-200mm f/4 G OSS",
      focalLength: "85mm",
      aperture: "f/5.6",
      shutterSpeed: "1/250s",
      iso: 100,
      date: "2026-01-22 06:12",
      latitude: -33.8568,
      longitude: 151.2153
    }
  },
  {
    id: "5",
    title: "Silent Sphinx",
    locationName: "Giza, Egypt",
    url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=250",
    description: "The Great Sphinx of Giza stands as a silent sentinel over the desert, backlit by the dusty golden sands of the afternoon sun.",
    exif: {
      camera: "Leica Q3",
      lens: "Summilux 28mm f/1.7 ASPH",
      focalLength: "28mm",
      aperture: "f/5.6",
      shutterSpeed: "1/1000s",
      iso: 100,
      date: "2026-02-14 15:30",
      latitude: 29.9753,
      longitude: 31.1376
    }
  },
  {
    id: "6",
    title: "Ocean Breeze over Ipanema",
    locationName: "Rio de Janeiro, Brazil",
    url: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=250",
    description: "Warm ocean mist rises off the rolling waves of Ipanema Beach, backdropping the dramatic shapes of the Dois Irmãos mountains.",
    exif: {
      camera: "Fujifilm X-T5",
      lens: "XF 35mm f/1.4 R",
      focalLength: "35mm",
      aperture: "f/1.4",
      shutterSpeed: "1/4000s",
      iso: 125,
      date: "2026-04-03 16:15",
      latitude: -22.9836,
      longitude: -43.2065
    }
  },
  {
    id: "7",
    title: "Table Mountain Cloud Tablecloth",
    locationName: "Cape Town, South Africa",
    url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=250",
    description: "The signature orographic cloud layer rolls softly over the flat peak of Table Mountain, viewed from across Table Bay.",
    exif: {
      camera: "Hasselblad X2D 100C",
      lens: "XCD 55mm f/2.5 V",
      focalLength: "55mm",
      aperture: "f/8.0",
      shutterSpeed: "1/180s",
      iso: 64,
      date: "2026-03-24 11:05",
      latitude: -33.9249,
      longitude: 18.4241
    }
  },
  {
    id: "8",
    title: "Seljalandsfoss Behind the Veil",
    locationName: "Sudurland, Iceland",
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=250",
    description: "Standing inside the damp cavern behind Seljalandsfoss, the roar of water is deafening as sunset colors bleed through the falling stream.",
    exif: {
      camera: "Nikon Z7 II",
      lens: "NIKKOR Z 14-30mm f/4 S",
      focalLength: "16mm",
      aperture: "f/11.0",
      shutterSpeed: "1/5s",
      iso: 64,
      date: "2026-06-10 22:30",
      latitude: 63.6156,
      longitude: -19.9885
    }
  },
  {
    id: "9",
    title: "Moraine Lake Mirror",
    locationName: "Banff, Canada",
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=250",
    description: "The jaw-dropping turquoise waters of Moraine Lake sit perfectly still, mirroring the snow-capped Valley of the Ten Peaks.",
    exif: {
      camera: "Canon EOS R5",
      lens: "RF 15-35mm f/2.8L IS USM",
      focalLength: "20mm",
      aperture: "f/5.6",
      shutterSpeed: "1/80s",
      iso: 100,
      date: "2026-06-01 07:45",
      latitude: 51.3217,
      longitude: -116.186
    }
  },
  {
    id: "10",
    title: "Shadows of the Colosseum",
    locationName: "Rome, Italy",
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=250",
    description: "Golden morning light penetrates the crumbling arches of the Roman Colosseum, painting long shadows across the ancient flagstones.",
    exif: {
      camera: "Sony Alpha 7 IV",
      lens: "FE 35mm f/1.4 GM",
      focalLength: "35mm",
      aperture: "f/1.8",
      shutterSpeed: "1/1000s",
      iso: 100,
      date: "2026-05-12 08:15",
      latitude: 41.8902,
      longitude: 12.4922
    }
  },
  {
    id: "11",
    title: "Citadel in the Clouds",
    locationName: "Machu Picchu, Peru",
    url: "https://images.unsplash.com/photo-1507629221898-506a36b59c8b?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1507629221898-506a36b59c8b?auto=format&fit=crop&q=80&w=250",
    description: "Low-lying clouds thread through the ancient stone terraces of Machu Picchu, catching the early light and blanketing the Andes.",
    exif: {
      camera: "Nikon Z6 II",
      lens: "NIKKOR Z 24-70mm f/4 S",
      focalLength: "28mm",
      aperture: "f/5.6",
      shutterSpeed: "1/250s",
      iso: 200,
      date: "2026-05-28 09:40",
      latitude: -13.1631,
      longitude: -72.5450
    }
  },
  {
    id: "12",
    title: "Taj Mahal Reflection",
    locationName: "Agra, India",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=250",
    description: "The white marble dome of the Taj Mahal is mirrored perfectly in the central reflecting pool under a soft, misty morning sky.",
    exif: {
      camera: "Canon EOS R6",
      lens: "RF 50mm f/1.2L USM",
      focalLength: "50mm",
      aperture: "f/2.8",
      shutterSpeed: "1/500s",
      iso: 100,
      date: "2026-04-20 06:45",
      latitude: 27.1751,
      longitude: 78.0421
    }
  }
];
