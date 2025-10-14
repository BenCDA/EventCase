interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  formatted_address?: string;
  city?: string;
  country?: string;
}

// Interface pour une vraie API (commentée pour la démo)
/*
interface MapboxResponse {
  features: Array<{
    place_name: string;
    center: [number, number]; // [longitude, latitude]
    properties: {
      address?: string;
    };
    context?: Array<{
      id: string;
      text: string;
    }>;
  }>;
}
*/

// Pour la démo, nous utiliserons des données mockées
// Dans une vraie app, utilisez Mapbox, Google Places, ou Nominatim
// const MAPBOX_TOKEN = 'demo_token'; // Remplacez par votre token Mapbox

// Cache pour éviter les appels répétés
const geocodingCache = new Map<string, { results: GeocodingResult[]; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

export class GeocodingService {
  /**
   * Recherche d'adresses avec autocomplétion
   */
  static async searchAddresses(query: string): Promise<GeocodingResult[]> {
    if (!query || query.length < 3) {
      return [];
    }

    const cacheKey = query.toLowerCase().trim();
    const cached = geocodingCache.get(cacheKey);

    // Vérifier le cache
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.results;
    }

    try {
      // Pour la démo, retournons des données mockées basées sur la recherche
      // Dans une vraie app, vous utiliseriez l'API Mapbox ou Google Places :
      /*
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=FR&types=place,locality,neighborhood,address&limit=5&language=fr`
      );

      if (!response.ok) {
        throw new Error(`Geocoding error: ${response.status}`);
      }

      const data: MapboxResponse = await response.json();

      const results: GeocodingResult[] = data.features.map(feature => ({
        name: feature.place_name,
        latitude: feature.center[1],
        longitude: feature.center[0],
        formatted_address: feature.place_name,
        city: feature.context?.find(c => c.id.startsWith('place'))?.text,
        country: feature.context?.find(c => c.id.startsWith('country'))?.text,
      }));
      */

      // Données mockées pour la démo
      const mockResults: GeocodingResult[] = this.generateMockResults(query);

      // Mettre en cache
      geocodingCache.set(cacheKey, {
        results: mockResults,
        timestamp: Date.now(),
      });

      return mockResults;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresses:', error);
      return [];
    }
  }

  /**
   * Géocodage inverse : obtenir l'adresse à partir de coordonnées
   */
  static async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null> {
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const cached = geocodingCache.get(cacheKey);

    if (cached && cached.results.length > 0 && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.results[0];
    }

    try {
      // Pour la démo, retournons des données mockées
      // Dans une vraie app :
      /*
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&language=fr&types=address,poi`
      );

      const data: MapboxResponse = await response.json();
      if (data.features.length > 0) {
        const feature = data.features[0];
        return {
          name: feature.place_name,
          latitude,
          longitude,
          formatted_address: feature.place_name,
          city: feature.context?.find(c => c.id.startsWith('place'))?.text,
          country: feature.context?.find(c => c.id.startsWith('country'))?.text,
        };
      }
      */

      const mockResult = this.generateMockReverseResult(latitude, longitude);

      geocodingCache.set(cacheKey, {
        results: mockResult ? [mockResult] : [],
        timestamp: Date.now(),
      });

      return mockResult;
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      return null;
    }
  }

  /**
   * Vider le cache de géocodage
   */
  static clearCache(): void {
    geocodingCache.clear();
  }

  // Méthodes privées pour les données mockées
  private static generateMockResults(query: string): GeocodingResult[] {
    const lowercaseQuery = query.toLowerCase();
    const mockPlaces = [
      { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
      { name: 'Lyon, France', lat: 45.7640, lng: 4.8357 },
      { name: 'Marseille, France', lat: 43.2965, lng: 5.3698 },
      { name: 'Toulouse, France', lat: 43.6047, lng: 1.4442 },
      { name: 'Nice, France', lat: 43.7102, lng: 7.2620 },
      { name: 'Nantes, France', lat: 47.2184, lng: -1.5536 },
      { name: 'Strasbourg, France', lat: 48.5734, lng: 7.7521 },
      { name: 'Montpellier, France', lat: 43.6108, lng: 3.8767 },
      { name: 'Bordeaux, France', lat: 44.8378, lng: -0.5792 },
      { name: 'Lille, France', lat: 50.6292, lng: 3.0573 },
    ];

    // Filtrer les résultats qui correspondent à la recherche
    const matchingPlaces = mockPlaces
      .filter(place => place.name.toLowerCase().includes(lowercaseQuery))
      .slice(0, 5);

    // Si aucune correspondance exacte, générer des suggestions génériques
    if (matchingPlaces.length === 0) {
      return [
        {
          name: `${query}, France`,
          latitude: 48.8566 + (Math.random() - 0.5) * 2,
          longitude: 2.3522 + (Math.random() - 0.5) * 4,
          formatted_address: `${query}, France`,
          city: query,
          country: 'France',
        },
        {
          name: `Centre-ville de ${query}`,
          latitude: 48.8566 + (Math.random() - 0.5) * 2,
          longitude: 2.3522 + (Math.random() - 0.5) * 4,
          formatted_address: `Centre-ville de ${query}, France`,
          city: query,
          country: 'France',
        },
      ];
    }

    return matchingPlaces.map(place => ({
      name: place.name,
      latitude: place.lat,
      longitude: place.lng,
      formatted_address: place.name,
      city: place.name.split(',')[0],
      country: 'France',
    }));
  }

  private static generateMockReverseResult(lat: number, lng: number): GeocodingResult {
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    return {
      name: `${Math.floor(Math.random() * 200) + 1} Rue de la République, ${randomCity}, France`,
      latitude: lat,
      longitude: lng,
      formatted_address: `${Math.floor(Math.random() * 200) + 1} Rue de la République, ${randomCity}, France`,
      city: randomCity,
      country: 'France',
    };
  }
}

export type { GeocodingResult };