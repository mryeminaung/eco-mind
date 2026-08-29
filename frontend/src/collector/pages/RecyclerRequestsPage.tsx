import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  RefreshCw,
  AlertCircle,
  Building2,
  Check,
  Layers,
  ArrowRight,
  Package,
  CheckCircle,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { CollectionStatusBadge } from "@/shared/components/CollectionStatusBadge";
import { CollectionRequest, CollectionStatus } from "@/types";
import { api } from "@/shared/api";
import { calculateGreenPoints } from "@/shared/pointsCalculator";
import { useAuth } from "@/auth/AuthContext";
import { Sparkles, Leaf } from "lucide-react";

export const RecyclerRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { user } = useAuth();
  const activeRecyclerId = user?.id || "rec-1";
  const activeRecyclerName = user?.name || "Certified Recycler";

  const fetchRequests = async () => {
    try {
      const data = await api.getCollectionRequests({
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch collection requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: CollectionStatus) => {
    setActionLoadingId(id);
    setNotification(null);
    try {
      const updatedReq = await api.updateCollectionRequestStatus(id, {
        status: newStatus,
        recyclerId: activeRecyclerId,
      });

      if (newStatus === "COMPLETED") {
        const preview = calculateGreenPoints(updatedReq.material, updatedReq.quantity);
        setNotification({
          type: "success",
          message: `Request #${id} marked as COMPLETED! Awarded +${preview.pointsEarned} Green Points to citizen (${updatedReq.userId || "user"}) & updated landfill savings!`,
        });
      } else {
        setNotification({
          type: "success",
          message: `Request #${id} status updated to ${newStatus}`,
        });
      }
      await fetchRequests();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to update status",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.material.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q) ||
      r.userId.toLowerCase().includes(q)
    );
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const acceptedCount = requests.filter((r) => r.status === "ACCEPTED").length;
  const collectedCount = requests.filter((r) => r.status === "COLLECTED").length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recycler Requests Dashboard
            </h1>
            <Badge variant="eco" className="text-xs">
              Recycler Workflow
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            View available waste collection requests, claim pickup orders, and update collection lifecycle statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              fetchRequests();
            }}
            disabled={refreshing}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Link to="/request-pickup">
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 font-semibold">
              <Package className="w-3.5 h-3.5 text-lima-400" />
              <span>Citizen Request View</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Recycler Profile Banner */}
      <div className="bg-gradient-to-r from-lima-950 to-lima-800 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-lima-400 flex items-center justify-center text-lima-950 shadow-md shrink-0">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {activeRecyclerName}
              </h2>
              <span className="bg-emerald-500/20 text-lima-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Verified Recycler
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Station ID: <code className="font-mono text-white">{activeRecyclerId}</code> • Authorized for Industrial & Household Recycling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-300 self-end sm:self-center">
          <span className="w-2 h-2 rounded-full bg-lima-400 animate-ping" />
          <span>Live Dispatch Queue Active</span>
        </div>
      </div>

      {/* Metric Stat Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "PENDING"
              ? "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/20 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Available (Pending)
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{pendingCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for accept</p>
        </button>

        <button
          onClick={() => setStatusFilter("ACCEPTED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "ACCEPTED"
              ? "border-blue-400 bg-blue-50/70 ring-2 ring-blue-400/20 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Accepted
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{acceptedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Dispatched to driver</p>
        </button>

        <button
          onClick={() => setStatusFilter("COLLECTED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "COLLECTED"
              ? "border-purple-400 bg-purple-50/70 ring-2 ring-purple-400/20 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
              Collected
            </span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{collectedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">In transit to depot</p>
        </button>

        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "COMPLETED"
              ? "border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-400/20 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Completed
            </span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{completedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Processed & logged</p>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material, address, or ID..."
            className="pl-9 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "ACCEPTED", "COLLECTED", "COMPLETED", "REJECTED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Requests" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
            Loading waste collection requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No Collection Requests Match</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No requests found matching your filter criteria. Switch filters or clear your search term.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isActionLoading = actionLoadingId === req.id;

            return (
              <Card
                key={req.id}
                className="border-slate-200 hover:border-slate-300 transition-all shadow-2xs overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top line: Material, Quantity, ID and Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-slate-900">
                            {req.material}
                          </h3>
                          <Badge variant="outline" className="text-xs font-semibold bg-slate-50">
                            {req.quantity}
                          </Badge>
                          {(() => {
                            const pts = calculateGreenPoints(req.material, req.quantity);
                            return (
                              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold text-[11px] gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                <span>+{pts.pointsEarned} pts</span>
                              </Badge>
                            );
                          })()}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          Request ID: {req.id} • User: {req.userId}
                        </span>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto">
                      <CollectionStatusBadge status={req.status} size="md" />
                    </div>
                  </div>

                  {/* Body Info: Address, Description, Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* Address & Note */}
                    <div className="md:col-span-7 space-y-2">
                      <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700 block">Pickup Location:</span>
                          <p className="text-slate-800 font-medium">{req.address}</p>
                        </div>
                      </div>

                      {req.description && (
                        <div className="bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-amber-900">
                          <span className="font-semibold block text-[11px] text-amber-800 mb-0.5">
                            Citizen Notes:
                          </span>
                          <p className="italic">{req.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Status Updates Log */}
                    <div className="md:col-span-5 space-y-2 text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Submitted:</span>
                        <span className="font-medium">
                          {req.createdAt ? new Date(req.createdAt).toLocaleString() : "Recently"}
                        </span>
                      </div>

                      {req.acceptedAt && (
                        <div className="flex justify-between items-center text-[11px] text-blue-800 font-medium">
                          <span>Accepted:</span>
                          <span>{new Date(req.acceptedAt).toLocaleTimeString()}</span>
                        </div>
                      )}

                      {req.collectedAt && (
                        <div className="flex justify-between items-center text-[11px] text-purple-800 font-medium">
                          <span>Collected:</span>
                          <span>{new Date(req.collectedAt).toLocaleTimeString()}</span>
                        </div>
                      )}

                      {req.completedAt && (
                        <div className="flex justify-between items-center text-[11px] text-emerald-800 font-medium">
                          <span>Completed:</span>
                          <span>{new Date(req.completedAt).toLocaleTimeString()}</span>
                        </div>
                      )}

                      {req.recyclerId && (
                        <div className="pt-1 text-[11px] text-slate-700 border-t border-slate-200/80">
                          Claimed by: <strong className="text-slate-900">{req.recyclerId}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recycler Workflow Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Current Phase: <strong className="text-slate-800">{req.status}</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Workflow Step 1: Accept Request */}
                      {req.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            disabled={isActionLoading}
                            onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 rounded-xl shadow-xs"
                          >
                            {isActionLoading ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>Accept Request</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isActionLoading}
                            onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                            className="text-xs font-bold gap-1.5 rounded-xl"
                          >
                            <span>Reject</span>
                          </Button>
                        </>
                      )}

                      {/* Workflow Step 2: Mark as Collected */}
                      {req.status === "ACCEPTED" && (
                        <Button
                          size="sm"
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(req.id, "COLLECTED")}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-1.5 rounded-xl shadow-xs"
                        >
                          {isActionLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Truck className="w-3.5 h-3.5" />
                          )}
                          <span>Mark as Collected</span>
                        </Button>
                      )}

                      {/* Workflow Step 3: Complete Request */}
                      {req.status === "COLLECTED" && (
                        <Button
                          size="sm"
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-1.5 rounded-xl shadow-xs"
                        >
                          {isActionLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-lima-400" />
                          )}
                          <span>Complete & Log Waste</span>
                        </Button>
                      )}

                      {/* Optional: Reset or jump status dropdown for testing/management */}
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        <span className="text-[11px] text-slate-400">Jump to:</span>
                        {(["PENDING", "ACCEPTED", "COLLECTED", "COMPLETED", "REJECTED"] as const).map((targetSt) => {
                          if (targetSt === req.status) return null;
                          return (
                            <button
                              key={targetSt}
                              disabled={isActionLoading}
                              onClick={() => handleUpdateStatus(req.id, targetSt)}
                              className="text-[10px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                            >
                              {targetSt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
