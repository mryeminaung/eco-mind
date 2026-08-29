export type WasteCategory =
  | "plastic"
  | "paper"
  | "electronic"
  | "metal"
  | "glass"
  | "organic"
  | "textile";

export type MyanmarCity =
  | "Yangon"
  | "Mandalay"
  | "Naypyidaw"
  | "Bago"
  | "Mawlamyine"
  | "Taunggyi";

export interface WasteItemDetail {
  category: WasteCategory;
  estimatedWeightKg: number;
  description?: string;
}

export type PickupStatus = "pending" | "assigned" | "in_transit" | "completed" | "cancelled";

export interface PickupRequest {
  id: string;
  _id?: string;
  citizenName: string;
  citizenPhone: string;
  city: MyanmarCity;
  township: string;
  address: string;
  items: WasteItemDetail[];
  totalEstimatedWeightKg: number;
  preferredDate: string;
  preferredTimeSlot: "morning" | "afternoon" | "evening";
  notes?: string;
  status: PickupStatus;
  assignedCollectorId?: string;
  assignedCollectorName?: string;
  actualWeightKg?: number;
  ecoPointsEarned?: number;
  rewardMmk?: number;
  createdAt: string;
  completedAt?: string;
}

export interface RecyclerService {
  id: string;
  _id?: string;
  name: string;
  nameMyanmar?: string;
  type: "collector" | "drop_off_center" | "social_enterprise" | "scrap_dealer";
  city: MyanmarCity;
  townshipsCovered: string[];
  address: string;
  phone: string;
  email?: string;
  acceptedMaterials: WasteCategory[];
  minimumWeightKg: number;
  paysForScrap: boolean;
  ratePerKg?: Partial<Record<WasteCategory, number>>;
  operatingHours: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  featured?: boolean;
  description: string;
  image?: string;
}

export interface DropOffHub {
  id: string;
  _id?: string;
  name: string;
  locationName: string;
  city: MyanmarCity;
  township: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  acceptedMaterials: WasteCategory[];
  operatingHours: string;
  hasRewardKiosk: boolean;
  contactNumber: string;
  managedBy: string;
  status: "open" | "closed" | "maintenance";
}

export interface CommunityEvent {
  id: string;
  title: string;
  organizer: string;
  city: MyanmarCity;
  township: string;
  date: string;
  time: string;
  location: string;
  participantsCount: number;
  targetWasteType: string;
  description: string;
  badgeAward: string;
}

export interface ImpactStats {
  totalKgRecycled: number;
  co2SavedKg: number;
  activePickups: number;
  registeredCitizens: number;
  verifiedCollectors: number;
  treesEquivalent: number;
  totalMmkPaidToCitizens: number;
}

export interface RecyclingCenter {
  id: string;
  _id?: string;
  name: string;
  location: string;
  acceptedMaterials: string[];
  phone: string;
  openingHours: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScanResult {
  material: string;
  recyclable: boolean;
  category: string;
  instructions: string[];
  environmentalImpact: string;
  confidenceScore?: number;
  estimatedMyanmarValue?: string;
  recommendedAction?: "pickup" | "drop_off" | "general_waste";
  itemDescription?: string;
}

export type UserRole = "USER" | "RECYCLER" | "ADMIN";

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CollectionStatus = "PENDING" | "ACCEPTED" | "COLLECTED" | "COMPLETED" | "REJECTED";

export interface CollectionRequest {
  id: string;
  _id?: string;
  userId: string;
  recyclerId: string | null;
  material: string;
  quantity: string;
  address: string;
  description?: string;
  status: CollectionStatus;
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
  collectedAt?: string;
  completedAt?: string;
  pointsAwarded?: number;
}

export type RewardMaterialCategory = "plastic" | "paper" | "glass" | "metal" | "other";

export interface PointsTransaction {
  id: string;
  requestId: string;
  userId: string;
  material: string;
  materialCategory: RewardMaterialCategory;
  quantity: string;
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
  timestamp: string;
}

export interface UserRewardProfile {
  userId: string;
  name: string;
  totalPoints: number;
  itemsRecycledCount: number;
  totalWeightKg: number;
  materialBreakdown: {
    plasticKg: number;
    paperKg: number;
    glassKg: number;
    metalKg: number;
    otherKg: number;
  };
  pointsBreakdown: {
    plasticPoints: number;
    paperPoints: number;
    glassPoints: number;
    metalPoints: number;
    otherPoints: number;
  };
  environmentalImpact: {
    landfillSavedKg: number;
    co2SavedKg: number;
    treesSaved: number;
    waterSavedLiters: number;
    summaryStatement: string;
  };
  transactions: PointsTransaction[];
}

