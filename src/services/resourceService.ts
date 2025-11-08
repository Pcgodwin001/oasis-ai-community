import { supabase } from '../lib/supabase';
import type { Resource } from '../types';

export const resourceService = {
  async getResourcesNearby(
    zipCode: string,
    maxDistance: number = 25,
    type?: string
  ): Promise<Resource[]> {
    try {
      // For demo, we'll use simple filtering
      // In production, use PostGIS for accurate distance calculation
      let query = supabase.from('resources').select('*');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      // Map to Resource type and calculate mock distances
      const resources: Resource[] = (data || []).map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        address: r.address,
        lat: r.lat,
        lng: r.lng,
        phone: r.phone,
        hours: r.hours,
        services: r.services,
        rating: r.rating,
        reviewCount: r.review_count,
        distance: this.calculateMockDistance()
      }));

      // Filter by max distance and sort
      return resources
        .filter(r => (r.distance || 0) <= maxDistance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  },

  calculateMockDistance(): number {
    // Generate random distance between 0.5 and 15 miles
    return Math.random() * 14.5 + 0.5;
  },

  async seedDemoResources(): Promise<void> {
    const demoResources = [
      {
        name: "Community Food Bank",
        type: "food_bank",
        address: "123 Main St, City, State 12345",
        lat: 40.7128,
        lng: -74.0060,
        phone: "(555) 123-4567",
        hours: "Mon-Fri: 9AM-5PM, Sat: 10AM-2PM",
        services: ["Food pantry", "Hot meals", "SNAP assistance"],
        rating: 4.5,
        review_count: 128
      },
      {
        name: "St. Mary's Food Pantry",
        type: "food_pantry",
        address: "456 Church Ave, City, State 12345",
        lat: 40.7580,
        lng: -73.9855,
        phone: "(555) 234-5678",
        hours: "Tue, Thu: 1PM-6PM",
        services: ["Non-perishable food", "Fresh produce"],
        rating: 4.7,
        review_count: 89
      },
      {
        name: "Daily Bread Soup Kitchen",
        type: "soup_kitchen",
        address: "789 Hope Street, City, State 12345",
        lat: 40.7489,
        lng: -73.9680,
        phone: "(555) 345-6789",
        hours: "Daily: 11AM-1PM, 5PM-7PM",
        services: ["Hot meals", "Groceries"],
        rating: 4.3,
        review_count: 201
      },
      {
        name: "Helping Hands Community Center",
        type: "food_bank",
        address: "321 Service Blvd, City, State 12345",
        lat: 40.7306,
        lng: -73.9352,
        phone: "(555) 456-7890",
        hours: "Mon-Sat: 8AM-6PM",
        services: ["Food pantry", "Job assistance", "Childcare"],
        rating: 4.8,
        review_count: 156
      },
      {
        name: "Harvest Hope Food Bank",
        type: "food_bank",
        address: "654 Charity Lane, City, State 12345",
        lat: 40.7614,
        lng: -73.9776,
        phone: "(555) 567-8901",
        hours: "Mon-Fri: 10AM-4PM",
        services: ["Emergency food", "WIC enrollment", "SNAP application help"],
        rating: 4.6,
        review_count: 92
      }
    ];

    try {
      for (const resource of demoResources) {
        await supabase.from('resources').insert(resource);
      }
      console.log('Demo resources seeded successfully');
    } catch (error) {
      console.error('Error seeding resources:', error);
    }
  }
};
