import {
  PickupRequest,
  RecyclerService,
  DropOffHub,
  CommunityEvent,
  ImpactStats,
  PickupStatus,
  ScanResult,
  RecyclingCenter,
  CollectionRequest,
  CollectionStatus,
  UserRewardProfile,
  PointsTransaction,
  AuthUser,
  UserRole,
} from "@/types";
import {
  initialImpactStats,
  initialPickups,
  initialRecyclerServices,
  initialDropOffHubs,
  initialCommunityEvents,
  initialRecyclingCenters,
  initialCollectionRequests,
} from "@/shared/seedData";

const API_BASE = "/api";
const TOKEN_KEY = "rc_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function headers(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Failed to register");
    return json.data;
  },

  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Failed to log in");
    return json.data;
  },

  async getMe(): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: headers() });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Failed to load session");
    return json.data;
  },

  async getUsers(): Promise<AuthUser[]> {
    const res = await fetch(`${API_BASE}/users`, { headers: headers() });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Failed to load users");
    return json.data;
  },

  async updateUser(
    id: string,
    update: Partial<Pick<AuthUser, "name" | "role" | "points">>
  ): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(update),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Failed to update user");
    return json.data;
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Failed to delete user");
  },

  // AI Vision Scanner
  async scanWaste(image: string, mimeType?: string): Promise<{ data: ScanResult; source?: string }> {
    try {
      const res = await fetch(`${API_BASE}/scan`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ image, mimeType }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to analyze image");
      }
      const json = await res.json();
      return { data: json.data, source: json.source };
    } catch (err: any) {
      console.warn("Using local fallback scan result:", err);
      // Return realistic local fallback if server unreachable
      return {
        data: {
          material: "Plastic Bottle",
          recyclable: true,
          category: "PET Plastic",
          instructions: [
            "Clean the bottle",
            "Remove cap",
            "Send to recycling center",
          ],
          environmentalImpact: "Reduces plastic pollution and saves ~0.15kg CO2",
          confidenceScore: 0.95,
          estimatedMyanmarValue: "350 - 450 MMK/kg",
          recommendedAction: "pickup",
        },
        source: "Client Fallback Scanner",
      };
    }
  },

  // Stats
  async getStats(): Promise<{ stats: ImpactStats; dbStatus?: { connected: boolean; type: string } }> {

    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      return { stats: json.data, dbStatus: json.dbStatus };
    } catch (err) {
      console.warn("Using fallback local stats:", err);
      return { stats: initialImpactStats, dbStatus: { connected: false, type: "Client Fallback" } };
    }
  },

  // Pickups
  async getPickups(filters?: { city?: string; status?: string; phone?: string }): Promise<PickupRequest[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.city && filters.city !== "All") params.append("city", filters.city);
      if (filters?.status && filters.status !== "all") params.append("status", filters.status);
      if (filters?.phone) params.append("phone", filters.phone);

      const res = await fetch(`${API_BASE}/pickups?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch pickups");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Using fallback pickups data:", err);
      return initialPickups;
    }
  },

  async createPickup(
    data: Omit<PickupRequest, "id" | "createdAt" | "status" | "ecoPointsEarned" | "rewardMmk">
  ): Promise<PickupRequest> {
    try {
      const res = await fetch(`${API_BASE}/pickups`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit pickup");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("API offline, creating local fallback pickup:", err);
      const fallback: PickupRequest = {
        ...data,
        id: `pk-${Date.now()}`,
        status: "pending",
        ecoPointsEarned: Math.round(data.totalEstimatedWeightKg * 10),
        rewardMmk: Math.round(data.totalEstimatedWeightKg * 350),
        createdAt: new Date().toISOString(),
      };
      return fallback;
    }
  },

  async updatePickupStatus(
    id: string,
    update: {
      status: PickupStatus;
      assignedCollectorId?: string;
      assignedCollectorName?: string;
      actualWeightKg?: number;
    }
  ): Promise<PickupRequest> {
    const res = await fetch(`${API_BASE}/pickups/${id}/status`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error("Failed to update status");
    const json = await res.json();
    return json.data;
  },

  // Services Directory
  async getServices(city?: string, material?: string): Promise<RecyclerService[]> {
    try {
      const params = new URLSearchParams();
      if (city && city !== "All") params.append("city", city);
      if (material && material !== "all") params.append("material", material);

      const res = await fetch(`${API_BASE}/services?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Using fallback recyclers list:", err);
      return initialRecyclerServices;
    }
  },

  // Hubs
  async getHubs(city?: string): Promise<DropOffHub[]> {
    try {
      const params = new URLSearchParams();
      if (city && city !== "All") params.append("city", city);

      const res = await fetch(`${API_BASE}/hubs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch hubs");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Using fallback hubs list:", err);
      return initialDropOffHubs;
    }
  },

  // Community
  async getEvents(): Promise<CommunityEvent[]> {
    try {
      const res = await fetch(`${API_BASE}/community/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Using fallback community events:", err);
      return initialCommunityEvents;
    }
  },

  async joinEvent(id: string): Promise<CommunityEvent> {
    const res = await fetch(`${API_BASE}/community/events/${id}/join`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to join event");
    const json = await res.json();
    return json.data;
  },

  // Recycling Center Finder (GET /api/recycling-centers, POST /api/recycling-centers, PUT, DELETE)
  async getRecyclingCenters(material?: string, search?: string): Promise<RecyclingCenter[]> {
    try {
      const params = new URLSearchParams();
      if (material && material.toLowerCase() !== "all") params.append("material", material);
      if (search && search.trim()) params.append("search", search.trim());

      const url = `${API_BASE}/recycling-centers${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch recycling centers");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Using fallback recycling centers list:", err);
      let list = [...initialRecyclingCenters];
      if (material && material.toLowerCase() !== "all") {
        const matLower = material.toLowerCase();
        list = list.filter((c) =>
          c.acceptedMaterials.some((m) => m.toLowerCase().includes(matLower) || matLower.includes(m.toLowerCase()))
        );
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q) ||
            c.openingHours.toLowerCase().includes(q) ||
            c.acceptedMaterials.some((m) => m.toLowerCase().includes(q))
        );
      }
      return list;
    }
  },

  async getRecyclingCenterById(id: string): Promise<RecyclingCenter | null> {
    try {
      const res = await fetch(`${API_BASE}/recycling-centers/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch (err) {
      return initialRecyclingCenters.find((c) => c.id === id) || null;
    }
  },

  async createRecyclingCenter(
    center: Omit<RecyclingCenter, "id" | "_id" | "createdAt" | "updatedAt">
  ): Promise<RecyclingCenter> {
    const res = await fetch(`${API_BASE}/recycling-centers`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(center),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to create recycling center");
    }
    const json = await res.json();
    return json.data;
  },

  async updateRecyclingCenter(
    id: string,
    center: Partial<Omit<RecyclingCenter, "id" | "_id" | "createdAt" | "updatedAt">>
  ): Promise<RecyclingCenter> {
    const res = await fetch(`${API_BASE}/recycling-centers/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(center),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to update recycling center");
    }
    const json = await res.json();
    return json.data;
  },

  async deleteRecyclingCenter(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/recycling-centers/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to delete recycling center");
    }
    const json = await res.json();
    return Boolean(json.success);
  },

  // COLLECTION REQUESTS (/api/requests)
  async getCollectionRequests(filters?: {
    userId?: string;
    recyclerId?: string;
    status?: string;
    material?: string;
  }): Promise<CollectionRequest[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== "all" && filters.status !== "ALL") {
        params.append("status", filters.status);
      }
      if (filters?.userId) params.append("userId", filters.userId);
      if (filters?.recyclerId) params.append("recyclerId", filters.recyclerId);
      if (filters?.material && filters.material !== "All") params.append("material", filters.material);

      const url = `${API_BASE}/requests${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, { headers: headers() });
      if (!res.ok) throw new Error("Failed to fetch collection requests");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Using local fallback collection requests:", err);
      let results = [...initialCollectionRequests];
      if (filters?.status && filters.status !== "all" && filters.status !== "ALL") {
        results = results.filter((r) => r.status === filters.status?.toUpperCase());
      }
      if (filters?.userId) {
        results = results.filter((r) => r.userId === filters.userId);
      }
      return results;
    }
  },

  async createCollectionRequest(data: {
    material: string;
    quantity: string;
    address: string;
    description?: string;
    userId?: string;
    recyclerId?: string | null;
  }): Promise<CollectionRequest> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to create collection request");
    }
    const json = await res.json();
    return json.data;
  },

  async updateCollectionRequestStatus(
    id: string,
    payload: { status: CollectionStatus; recyclerId?: string | null }
  ): Promise<CollectionRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to update collection request status");
    }
    const json = await res.json();
    return json.data;
  },

  // REWARDS & GREEN POINTS (/api/rewards)
  async getUserRewardProfile(userId: string = "usr-maythiri"): Promise<UserRewardProfile> {
    try {
      const res = await fetch(`${API_BASE}/rewards/user/${encodeURIComponent(userId)}`, {
        headers: headers(),
      });
      if (!res.ok) throw new Error("Failed to fetch user rewards profile");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Falling back to local calculated reward profile:", err);
      // Local fallback calculation
      return {
        userId,
        name: userId === "usr-maythiri" ? "May Thiri" : "Citizen User",
        totalPoints: 405,
        itemsRecycledCount: 4,
        totalWeightKg: 50,
        materialBreakdown: {
          plasticKg: 15,
          paperKg: 20,
          glassKg: 10,
          metalKg: 5,
          otherKg: 0,
        },
        pointsBreakdown: {
          plasticPoints: 150,
          paperPoints: 100,
          glassPoints: 80,
          metalPoints: 75,
          otherPoints: 0,
        },
        environmentalImpact: {
          landfillSavedKg: 50,
          co2SavedKg: 85.5,
          treesSaved: 0.34,
          waterSavedLiters: 845,
          summaryStatement:
            "You recycled 15kg plastic and saved approximately 15kg of waste from landfill.",
        },
        transactions: [],
      };
    }
  },

  async calculateRewardPoints(
    material: string,
    quantity: string
  ): Promise<{
    materialCategory: string;
    weightKg: number;
    ratePerKg: number;
    pointsEarned: number;
    environmentalImpact: {
      landfillSavedKg: number;
      co2SavedKg: number;
      treesSaved: number;
      waterSavedLiters: number;
      summaryStatement: string;
    };
  }> {
    const res = await fetch(`${API_BASE}/rewards/calculate`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ material, quantity }),
    });
    if (!res.ok) throw new Error("Failed to calculate reward points");
    const json = await res.json();
    return json.data;
  },

  async awardGreenPoints(data: {
    material: string;
    quantity: string;
    userId?: string;
    requestId?: string;
  }): Promise<{ transaction: PointsTransaction; profile: UserRewardProfile }> {
    const res = await fetch(`${API_BASE}/rewards/award`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to award points");
    }
    const json = await res.json();
    return json.data;
  },
};


