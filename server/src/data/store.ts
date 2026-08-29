import {
  initialRecyclerServices,
  initialDropOffHubs,
  initialCommunityEvents,
  initialPickups,
  initialImpactStats,
  initialRecyclingCenters,
  initialCollectionRequests,
} from "./seedData";
import {
  PickupRequest,
  RecyclerService,
  DropOffHub,
  CommunityEvent,
  ImpactStats,
  PickupStatus,
  RecyclingCenter,
  CollectionRequest,
  CollectionStatus,
  UserRewardProfile,
  PointsTransaction,
} from "../types";
import { isDbConnected } from "../config/db";
import { PickupModel } from "../models/PickupRequest";
import { RecyclerModel } from "../models/RecyclerService";
import { DropOffHubModel } from "../models/DropOffHub";
import { CommunityEventModel } from "../models/CommunityEvent";
import { RecyclingCenterModel } from "../models/RecyclingCenter";
import { CollectionRequestModel } from "../models/CollectionRequest";
import { UserRewardProfileModel } from "../models/UserRewardProfile";
import { calculateGreenPoints, parseWeightKg, categorizeMaterial } from "../utils/pointsCalculator";
import { UserStore } from "./userStore";

// In-memory state for fallback / instant development responsiveness
let inMemoryPickups: PickupRequest[] = [...initialPickups];
let inMemoryServices: RecyclerService[] = [...initialRecyclerServices];
let inMemoryHubs: DropOffHub[] = [...initialDropOffHubs];
let inMemoryEvents: CommunityEvent[] = [...initialCommunityEvents];
let inMemoryStats: ImpactStats = { ...initialImpactStats };
let inMemoryCenters: RecyclingCenter[] = [...initialRecyclingCenters];
let inMemoryCollectionRequests: CollectionRequest[] = [...initialCollectionRequests];
let inMemoryTransactions: PointsTransaction[] = [];

export const DataStore = {
  // PICKUPS
  async getPickups(filters?: { city?: string; status?: string; phone?: string }): Promise<PickupRequest[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (filters?.city && filters.city !== "All") query.city = filters.city;
        if (filters?.status && filters.status !== "all") query.status = filters.status;
        if (filters?.phone) query.citizenPhone = filters.phone;
        const docs = await (PickupModel as any).find(query).sort({ createdAt: -1 });
        return docs.map((d: any) => ({
          ...d.toObject(),
          id: d._id ? d._id.toString() : d.id,
        }));
      } catch (err) {
        console.error("MongoDB query error, falling back to memory store", err);
      }
    }

    let result = [...inMemoryPickups];
    if (filters?.city && filters.city !== "All") {
      result = result.filter((p) => p.city === filters.city);
    }
    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.phone) {
      result = result.filter((p) => p.citizenPhone.includes(filters.phone!));
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getPickupById(id: string): Promise<PickupRequest | null> {
    if (isDbConnected()) {
      try {
        const doc = await (PickupModel as any).findById(id);
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
        }
      } catch (err) {
        // Continue to check in-memory
      }
    }
    return inMemoryPickups.find((p) => p.id === id || p._id === id) || null;
  },

  async createPickup(
    data: Omit<PickupRequest, "id" | "createdAt" | "status" | "ecoPointsEarned" | "rewardMmk">
  ): Promise<PickupRequest> {
    const id = `pk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const ecoPointsEarned = Math.round(data.totalEstimatedWeightKg * 10);
    const rewardMmk = Math.round(data.totalEstimatedWeightKg * 350);

    const newPickup: PickupRequest = {
      ...data,
      id,
      status: "pending",
      ecoPointsEarned,
      rewardMmk,
      createdAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      try {
        const created = await (PickupModel as any).create(newPickup);
        const obj = created.toObject();
        return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
      } catch (err) {
        console.error("MongoDB create pickup failed, saved to memory", err);
      }
    }

    inMemoryPickups.unshift(newPickup);
    inMemoryStats.activePickups += 1;
    return newPickup;
  },

  async updatePickupStatus(
    id: string,
    update: {
      status: PickupStatus;
      assignedCollectorId?: string;
      assignedCollectorName?: string;
      actualWeightKg?: number;
    }
  ): Promise<PickupRequest | null> {
    if (isDbConnected()) {
      try {
        const updateData: any = { status: update.status };
        if (update.assignedCollectorId) updateData.assignedCollectorId = update.assignedCollectorId;
        if (update.assignedCollectorName) updateData.assignedCollectorName = update.assignedCollectorName;
        if (update.actualWeightKg !== undefined) {
          updateData.actualWeightKg = update.actualWeightKg;
          updateData.ecoPointsEarned = Math.round(update.actualWeightKg * 10);
          updateData.rewardMmk = Math.round(update.actualWeightKg * 400);
        }
        if (update.status === "completed") {
          updateData.completedAt = new Date().toISOString();
        }
        const doc = await (PickupModel as any).findByIdAndUpdate(id, updateData, { new: true });
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
        }
      } catch (err) {
        // Fallback to memory
      }
    }

    const index = inMemoryPickups.findIndex((p) => p.id === id || p._id === id);
    if (index === -1) return null;

    const current = inMemoryPickups[index];
    const completedAt = update.status === "completed" ? new Date().toISOString() : current.completedAt;

    const actualWeightKg = update.actualWeightKg ?? current.actualWeightKg;
    const ecoPointsEarned = actualWeightKg ? Math.round(actualWeightKg * 10) : current.ecoPointsEarned;
    const rewardMmk = actualWeightKg ? Math.round(actualWeightKg * 400) : current.rewardMmk;

    const updated: PickupRequest = {
      ...current,
      ...update,
      actualWeightKg,
      ecoPointsEarned,
      rewardMmk,
      completedAt,
    };

    inMemoryPickups[index] = updated;

    if (update.status === "completed" && current.status !== "completed") {
      const addedWeight = actualWeightKg || current.totalEstimatedWeightKg;
      inMemoryStats.totalKgRecycled += addedWeight;
      inMemoryStats.co2SavedKg += Math.round(addedWeight * 1.45);
      inMemoryStats.treesEquivalent = Math.round(inMemoryStats.co2SavedKg / 60);
      inMemoryStats.totalMmkPaidToCitizens += rewardMmk;
      if (inMemoryStats.activePickups > 0) inMemoryStats.activePickups -= 1;
    }

    return updated;
  },

  // SERVICES
  async getServices(city?: string, material?: string): Promise<RecyclerService[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (city && city !== "All") query.city = city;
        if (material && material !== "all") query.acceptedMaterials = material;
        const docs = await (RecyclerModel as any).find(query);
        if (docs.length > 0) {
          return docs.map((d: any) => ({
            ...d.toObject(),
            id: d._id ? d._id.toString() : d.id,
          }));
        }
      } catch (err) {
        // Memory fallback
      }
    }

    let list = [...inMemoryServices];
    if (city && city !== "All") {
      list = list.filter((s) => s.city === city || s.townshipsCovered.some((t) => t.includes(city)));
    }
    if (material && material !== "all") {
      list = list.filter((s) => s.acceptedMaterials.includes(material as any));
    }
    return list;
  },

  // HUBS
  async getHubs(city?: string): Promise<DropOffHub[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (city && city !== "All") query.city = city;
        const docs = await (DropOffHubModel as any).find(query);
        if (docs.length > 0) {
          return docs.map((d: any) => ({
            ...d.toObject(),
            id: d._id ? d._id.toString() : d.id,
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    let list = [...inMemoryHubs];
    if (city && city !== "All") {
      list = list.filter((h) => h.city === city);
    }
    return list;
  },

  // COMMUNITY EVENTS
  async getEvents(): Promise<CommunityEvent[]> {
    if (isDbConnected()) {
      try {
        const docs = await (CommunityEventModel as any).find();
        if (docs.length > 0) {
          return docs.map((d: any) => ({
            ...d.toObject(),
            id: d._id ? d._id.toString() : d.id,
          }));
        }
      } catch (err) {
        // Fallback
      }
    }
    return inMemoryEvents;
  },

  async joinEvent(eventId: string): Promise<CommunityEvent | null> {
    const ev = inMemoryEvents.find((e) => e.id === eventId);
    if (ev) {
      ev.participantsCount += 1;
      return ev;
    }
    return null;
  },

  // STATS
  async getImpactStats(): Promise<ImpactStats> {
    return inMemoryStats;
  },

  // RECYCLING CENTERS (Recycling Center Finder)
  async getRecyclingCenters(material?: string, search?: string): Promise<RecyclingCenter[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (material && material.toLowerCase() !== "all") {
          query.acceptedMaterials = { $regex: new RegExp(material, "i") };
        }
        if (search) {
          const regex = new RegExp(search, "i");
          query.$or = [
            { name: regex },
            { location: regex },
            { acceptedMaterials: regex },
          ];
        }
        const docs = await (RecyclingCenterModel as any).find(query).sort({ createdAt: -1 });
        if (docs.length > 0) {
          return docs.map((d: any) => ({
            ...d.toObject(),
            id: d._id ? d._id.toString() : d.id,
          }));
        }
      } catch (err) {
        console.error("MongoDB query error on recycling centers, falling back to memory store", err);
      }
    }

    let list = [...inMemoryCenters];
    if (material && material.toLowerCase() !== "all") {
      const matLower = material.toLowerCase();
      list = list.filter((c) =>
        c.acceptedMaterials.some((m) => m.toLowerCase().includes(matLower) || matLower.includes(m.toLowerCase()))
      );
    }
    if (search) {
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
  },

  async getRecyclingCenterById(id: string): Promise<RecyclingCenter | null> {
    if (isDbConnected()) {
      try {
        const doc = await (RecyclingCenterModel as any).findById(id);
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
        }
      } catch (err) {
        // Fallback
      }
    }
    return inMemoryCenters.find((c) => c.id === id || c._id === id) || null;
  },

  async createRecyclingCenter(data: {
    name: string;
    location: string;
    acceptedMaterials: string[];
    phone: string;
    openingHours: string;
  }): Promise<RecyclingCenter> {
    const id = `rc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newCenter: RecyclingCenter = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      try {
        const created = await (RecyclingCenterModel as any).create(newCenter);
        const obj = created.toObject();
        return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
      } catch (err) {
        console.error("MongoDB create recycling center failed, saved to memory", err);
      }
    }

    inMemoryCenters.unshift(newCenter);
    return newCenter;
  },

  async updateRecyclingCenter(
    id: string,
    update: Partial<{
      name: string;
      location: string;
      acceptedMaterials: string[];
      phone: string;
      openingHours: string;
    }>
  ): Promise<RecyclingCenter | null> {
    if (isDbConnected()) {
      try {
        const doc = await (RecyclingCenterModel as any).findByIdAndUpdate(
          id,
          { ...update, updatedAt: new Date().toISOString() },
          { new: true }
        );
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
        }
      } catch (err) {
        // Fallback
      }
    }

    const index = inMemoryCenters.findIndex((c) => c.id === id || c._id === id);
    if (index === -1) return null;

    const updated: RecyclingCenter = {
      ...inMemoryCenters[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };

    inMemoryCenters[index] = updated;
    return updated;
  },

  async deleteRecyclingCenter(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        await (RecyclingCenterModel as any).findByIdAndDelete(id);
      } catch (err) {
        // Fallback
      }
    }

    const beforeLength = inMemoryCenters.length;
    inMemoryCenters = inMemoryCenters.filter((c) => c.id !== id && c._id !== id);
    return inMemoryCenters.length < beforeLength;
  },

  // COLLECTION REQUESTS (Workflow: PENDING -> ACCEPTED -> COLLECTED -> COMPLETED)
  async getCollectionRequests(filters?: {
    userId?: string;
    recyclerId?: string;
    status?: string;
    material?: string;
  }): Promise<CollectionRequest[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (filters?.userId) query.userId = filters.userId;
        if (filters?.recyclerId) query.recyclerId = filters.recyclerId;
        if (filters?.status && filters.status !== "all" && filters.status !== "ALL") {
          query.status = filters.status.toUpperCase();
        }
        if (filters?.material && filters.material !== "All") {
          query.material = { $regex: filters.material, $options: "i" };
        }
        const docs = await (CollectionRequestModel as any)
          .find(query)
          .sort({ createdAt: -1 });
        return docs.map((d: any) => ({
          ...d.toObject(),
          id: d._id ? d._id.toString() : d.id,
        }));
      } catch (err) {
        // fallback to memory
      }
    }

    let results = [...inMemoryCollectionRequests];
    if (filters?.userId) {
      results = results.filter((r) => r.userId === filters.userId);
    }
    if (filters?.recyclerId) {
      results = results.filter((r) => r.recyclerId === filters.recyclerId);
    }
    if (filters?.status && filters.status !== "all" && filters.status !== "ALL") {
      const matchStatus = filters.status.toUpperCase();
      results = results.filter((r) => r.status === matchStatus);
    }
    if (filters?.material && filters.material !== "All") {
      const mat = filters.material.toLowerCase();
      results = results.filter((r) => r.material.toLowerCase().includes(mat));
    }

    return results.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  },

  async getCollectionRequestById(id: string): Promise<CollectionRequest | null> {
    if (isDbConnected()) {
      try {
        const doc = await (CollectionRequestModel as any).findById(id);
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
        }
      } catch (err) {
        // Fallback
      }
    }
    return inMemoryCollectionRequests.find((r) => r.id === id || r._id === id) || null;
  },

  async createCollectionRequest(data: {
    userId: string;
    recyclerId?: string | null;
    material: string;
    quantity: string;
    address: string;
    description?: string;
    status?: CollectionStatus;
  }): Promise<CollectionRequest> {
    const status: CollectionStatus = data.status || "PENDING";
    const now = new Date().toISOString();

    if (isDbConnected()) {
      try {
        const newDoc = await (CollectionRequestModel as any).create({
          userId: data.userId,
          recyclerId: data.recyclerId || null,
          material: data.material,
          quantity: data.quantity,
          address: data.address,
          description: data.description || "",
          status,
        });
        const obj = newDoc.toObject();
        return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
      } catch (err) {
        // Fallback
      }
    }

    const newRequest: CollectionRequest = {
      id: `req-${Date.now()}`,
      userId: data.userId,
      recyclerId: data.recyclerId || null,
      material: data.material,
      quantity: data.quantity,
      address: data.address,
      description: data.description || "",
      status,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryCollectionRequests.unshift(newRequest);
    return newRequest;
  },

  async updateCollectionRequestStatus(
    id: string,
    update: {
      status: CollectionStatus;
      recyclerId?: string | null;
    }
  ): Promise<CollectionRequest | null> {
    const now = new Date().toISOString();
    const status = update.status.toUpperCase() as CollectionStatus;

    const extraTimestamps: any = {};
    if (status === "ACCEPTED") extraTimestamps.acceptedAt = now;
    if (status === "COLLECTED") extraTimestamps.collectedAt = now;
    if (status === "COMPLETED") extraTimestamps.completedAt = now;
    if (status === "REJECTED") extraTimestamps.acceptedAt = undefined;

    let targetReq: CollectionRequest | null = null;

    if (isDbConnected()) {
      try {
        const payload: any = {
          status,
          updatedAt: now,
          ...extraTimestamps,
        };
        if (update.recyclerId !== undefined) {
          payload.recyclerId = update.recyclerId;
        }

        const doc = await (CollectionRequestModel as any).findByIdAndUpdate(
          id,
          payload,
          { new: true }
        );
        if (doc) {
          const obj = doc.toObject();
          targetReq = { ...obj, id: obj._id ? obj._id.toString() : obj.id };
        }
      } catch (err) {
        // Fallback
      }
    }

    if (!targetReq) {
      const index = inMemoryCollectionRequests.findIndex(
        (r) => r.id === id || r._id === id
      );
      if (index === -1) return null;

      const current = inMemoryCollectionRequests[index];
      const updated: CollectionRequest = {
        ...current,
        status,
        recyclerId: update.recyclerId !== undefined ? update.recyclerId : current.recyclerId,
        updatedAt: now,
        ...(status === "ACCEPTED" ? { acceptedAt: now } : {}),
        ...(status === "COLLECTED" ? { collectedAt: now } : {}),
        ...(status === "COMPLETED" ? { completedAt: now } : {}),
      };

      inMemoryCollectionRequests[index] = updated;
      targetReq = updated;
    }

    // When status transitions to COMPLETED, calculate and award Green Points to user!
    if (status === "COMPLETED" && targetReq) {
      await this.awardPointsForRequest(targetReq);
    }

    return targetReq;
  },

  async awardPointsForRequest(request: CollectionRequest): Promise<PointsTransaction> {
    const calc = calculateGreenPoints(request.material, request.quantity);
    const txId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const transaction: PointsTransaction = {
      id: txId,
      requestId: request.id,
      userId: request.userId || "usr-maythiri",
      material: request.material,
      materialCategory: calc.materialCategory,
      quantity: request.quantity,
      weightKg: calc.weightKg,
      ratePerKg: calc.ratePerKg,
      pointsEarned: calc.pointsEarned,
      environmentalImpact: calc.environmentalImpact,
      timestamp: now,
    };

    // Update in-memory points transaction list
    const existingTx = inMemoryTransactions.find((t) => t.requestId === request.id);
    if (!existingTx) {
      inMemoryTransactions.unshift(transaction);
    }

    // Set points on in-memory collection request
    const reqIdx = inMemoryCollectionRequests.findIndex((r) => r.id === request.id);
    if (reqIdx !== -1) {
      inMemoryCollectionRequests[reqIdx].pointsAwarded = calc.pointsEarned;
    }

    try {
      await UserStore.incrementPoints(transaction.userId, calc.pointsEarned);
    } catch (err) {
      console.error("Failed to increment user points:", err);
    }

    if (isDbConnected()) {
      try {
        await UserRewardProfileModel.findOneAndUpdate(
          { userId: request.userId },
          {
            $inc: {
              totalPoints: calc.pointsEarned,
              itemsRecycledCount: 1,
              totalWeightKg: calc.weightKg,
              [`materialBreakdown.${calc.materialCategory}Kg`]: calc.weightKg,
              [`pointsBreakdown.${calc.materialCategory}Points`]: calc.pointsEarned,
              "environmentalImpact.landfillSavedKg": calc.environmentalImpact.landfillSavedKg,
              "environmentalImpact.co2SavedKg": calc.environmentalImpact.co2SavedKg,
              "environmentalImpact.treesSaved": calc.environmentalImpact.treesSaved,
              "environmentalImpact.waterSavedLiters": calc.environmentalImpact.waterSavedLiters,
            },
            $push: { transactions: transaction },
            $set: {
              "environmentalImpact.summaryStatement": calc.environmentalImpact.summaryStatement,
            },
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error("Failed to update UserRewardProfile in DB:", err);
      }
    }

    return transaction;
  },

  async getUserRewardProfile(userId: string = "usr-maythiri"): Promise<UserRewardProfile> {
    // 1. Gather all completed requests for this user
    const userCompletedRequests = inMemoryCollectionRequests.filter(
      (r) => (r.userId === userId || !r.userId) && r.status === "COMPLETED"
    );

    // Also include any user-specific transactions
    let userTransactions = inMemoryTransactions.filter((t) => t.userId === userId || !t.userId);

    // If transactions don't exist yet for existing seed completed requests, populate them
    for (const req of userCompletedRequests) {
      if (!userTransactions.some((t) => t.requestId === req.id)) {
        const calc = calculateGreenPoints(req.material, req.quantity);
        const tx: PointsTransaction = {
          id: `tx-${req.id}`,
          requestId: req.id,
          userId,
          material: req.material,
          materialCategory: calc.materialCategory,
          quantity: req.quantity,
          weightKg: calc.weightKg,
          ratePerKg: calc.ratePerKg,
          pointsEarned: calc.pointsEarned,
          environmentalImpact: calc.environmentalImpact,
          timestamp: req.completedAt || req.updatedAt || new Date().toISOString(),
        };
        inMemoryTransactions.push(tx);
        userTransactions.push(tx);
      }
    }

    // Default base metrics if user is brand new or demo (e.g. May Thiri baseline + live requests)
    let totalWeightKg = 0;
    let totalPoints = 0;
    let itemsRecycledCount = userCompletedRequests.length;

    const materialBreakdown = {
      plasticKg: 0,
      paperKg: 0,
      glassKg: 0,
      metalKg: 0,
      otherKg: 0,
    };

    const pointsBreakdown = {
      plasticPoints: 0,
      paperPoints: 0,
      glassPoints: 0,
      metalPoints: 0,
      otherPoints: 0,
    };

    let landfillSavedKg = 0;
    let co2SavedKg = 0;
    let treesSaved = 0;
    let waterSavedLiters = 0;

    // Seed baseline for May Thiri so dashboard is rich with history
    if (userId === "usr-maythiri" && userTransactions.length === 0) {
      // Add standard baseline transactions
      const base1 = calculateGreenPoints("Plastic (PET Bottles)", "15 kg");
      const base2 = calculateGreenPoints("Cardboard Boxes", "20 kg");
      const base3 = calculateGreenPoints("Aluminum Beverage Cans", "5 kg");
      const base4 = calculateGreenPoints("Glass Bottles", "10 kg");

      const seedTxs: PointsTransaction[] = [
        {
          id: "tx-init-1",
          requestId: "req-hist-1",
          userId: "usr-maythiri",
          material: "Plastic (PET Bottles)",
          materialCategory: base1.materialCategory,
          quantity: "15 kg",
          weightKg: 15,
          ratePerKg: 10,
          pointsEarned: 150,
          environmentalImpact: base1.environmentalImpact,
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: "tx-init-2",
          requestId: "req-hist-2",
          userId: "usr-maythiri",
          material: "Cardboard & Paper",
          materialCategory: base2.materialCategory,
          quantity: "20 kg",
          weightKg: 20,
          ratePerKg: 5,
          pointsEarned: 100,
          environmentalImpact: base2.environmentalImpact,
          timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
        },
        {
          id: "tx-init-3",
          requestId: "req-hist-3",
          userId: "usr-maythiri",
          material: "Scrap Metal & Cans",
          materialCategory: base3.materialCategory,
          quantity: "5 kg",
          weightKg: 5,
          ratePerKg: 15,
          pointsEarned: 75,
          environmentalImpact: base3.environmentalImpact,
          timestamp: new Date(Date.now() - 86400000 * 20).toISOString(),
        },
        {
          id: "tx-init-4",
          requestId: "req-hist-4",
          userId: "usr-maythiri",
          material: "Glass Bottles & Jars",
          materialCategory: base4.materialCategory,
          quantity: "10 kg",
          weightKg: 10,
          ratePerKg: 8,
          pointsEarned: 80,
          environmentalImpact: base4.environmentalImpact,
          timestamp: new Date(Date.now() - 86400000 * 28).toISOString(),
        },
      ];

      inMemoryTransactions.push(...seedTxs);
      userTransactions = inMemoryTransactions.filter((t) => t.userId === userId);
    }

    userTransactions.forEach((tx) => {
      totalPoints += tx.pointsEarned;
      totalWeightKg += tx.weightKg;
      landfillSavedKg += tx.environmentalImpact.landfillSavedKg;
      co2SavedKg += tx.environmentalImpact.co2SavedKg;
      treesSaved += tx.environmentalImpact.treesSaved;
      waterSavedLiters += tx.environmentalImpact.waterSavedLiters;

      if (tx.materialCategory === "plastic") {
        materialBreakdown.plasticKg += tx.weightKg;
        pointsBreakdown.plasticPoints += tx.pointsEarned;
      } else if (tx.materialCategory === "paper") {
        materialBreakdown.paperKg += tx.weightKg;
        pointsBreakdown.paperPoints += tx.pointsEarned;
      } else if (tx.materialCategory === "glass") {
        materialBreakdown.glassKg += tx.weightKg;
        pointsBreakdown.glassPoints += tx.pointsEarned;
      } else if (tx.materialCategory === "metal") {
        materialBreakdown.metalKg += tx.weightKg;
        pointsBreakdown.metalPoints += tx.pointsEarned;
      } else {
        materialBreakdown.otherKg += tx.weightKg;
        pointsBreakdown.otherPoints += tx.pointsEarned;
      }
    });

    itemsRecycledCount = Math.max(itemsRecycledCount, userTransactions.length);

    // Construct primary personalized summary statement
    // Example: "You recycled 5kg plastic and saved approximately 5kg of waste from landfill."
    let summaryStatement = "";
    if (materialBreakdown.plasticKg > 0) {
      summaryStatement = `You recycled ${materialBreakdown.plasticKg}kg plastic and saved approximately ${materialBreakdown.plasticKg}kg of waste from landfill.`;
    } else if (totalWeightKg > 0) {
      summaryStatement = `You recycled ${totalWeightKg}kg of recyclable materials and saved approximately ${landfillSavedKg}kg of waste from landfill.`;
    } else {
      summaryStatement = "Start recycling today to earn Green Points and divert waste from local landfills!";
    }

    const account = await UserStore.getById(userId);

    return {
      userId,
      name: account?.name || (userId === "usr-maythiri" ? "May Thiri" : "Citizen User"),
      totalPoints,
      itemsRecycledCount,
      totalWeightKg: Number(totalWeightKg.toFixed(1)),
      materialBreakdown: {
        plasticKg: Number(materialBreakdown.plasticKg.toFixed(1)),
        paperKg: Number(materialBreakdown.paperKg.toFixed(1)),
        glassKg: Number(materialBreakdown.glassKg.toFixed(1)),
        metalKg: Number(materialBreakdown.metalKg.toFixed(1)),
        otherKg: Number(materialBreakdown.otherKg.toFixed(1)),
      },
      pointsBreakdown,
      environmentalImpact: {
        landfillSavedKg: Number(landfillSavedKg.toFixed(1)),
        co2SavedKg: Number(co2SavedKg.toFixed(1)),
        treesSaved: Number(treesSaved.toFixed(2)),
        waterSavedLiters: Number(waterSavedLiters.toFixed(1)),
        summaryStatement,
      },
      transactions: userTransactions.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    };
  },

  async deleteCollectionRequest(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        await (CollectionRequestModel as any).findByIdAndDelete(id);
      } catch (err) {
        // Fallback
      }
    }

    const beforeLen = inMemoryCollectionRequests.length;
    inMemoryCollectionRequests = inMemoryCollectionRequests.filter(
      (r) => r.id !== id && r._id !== id
    );
    return inMemoryCollectionRequests.length < beforeLen;
  },
};


