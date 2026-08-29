import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Sparkles,
  Search,
  CheckCircle,
  Building,
  Navigation,
  Gift,
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { WasteCategoryBadge } from "@/shared/components/WasteCategoryBadge";
import { DropOffHub } from "@/types";
import { api } from "@/shared/api";

export const DropOffHubsPage: React.FC = () => {
  const [hubs, setHubs] = useState<DropOffHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchHubs() {
      setLoading(true);
      try {
        const data = await api.getHubs(selectedCity);
        setHubs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHubs();
  }, [selectedCity]);

  const filteredHubs = hubs.filter((h) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.locationName.toLowerCase().includes(q) ||
      h.township.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="eco" className="text-xs">
          Community Drop-Off Stations
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Recycling Drop-Off Hubs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Drop off clean recyclables anytime at partner supermarkets, shopping plazas, and community centers in Myanmar. Instant reward points available at smart kiosk stations.
        </p>
      </div>

      {/* Filter toolbar */}
      <Card className="border border-slate-200/80 bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search hub by landmark, road, or mall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="All">All Regions & Cities</option>
                <option value="Yangon">Yangon (ရန်ကုန်)</option>
                <option value="Mandalay">Mandalay (မန္တလေး)</option>
                <option value="Bago">Bago (ပဲခူး)</option>
                <option value="Mawlamyine">Mawlamyine (မော်လမြိုင်)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hubs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-slate-200/60 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredHubs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-700">No drop-off hubs found</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCity("All"); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHubs.map((hub) => (
            <Card
              key={hub.id}
              className="border border-slate-200/80 bg-white hover:border-emerald-400 flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{hub.name}</h3>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                      📍 {hub.locationName}
                    </p>
                  </div>
                  <Badge
                    variant={hub.status === "open" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {hub.status === "open" ? "Open Now" : "Maintenance"}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {hub.township}, {hub.city}
                      </p>
                      <p className="text-slate-500">{hub.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{hub.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Contact: {hub.contactNumber}</span>
                  </div>
                </div>

                {/* Accepted Materials */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Accepted Streams at this Station:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.acceptedMaterials.map((mat) => (
                      <WasteCategoryBadge key={mat} category={mat} />
                    ))}
                  </div>
                </div>

                {/* Feature callout */}
                {hub.hasRewardKiosk && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200/80 p-2.5 rounded-xl text-xs">
                    <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong className="font-semibold">Smart QR Kiosk:</strong> Scan your Citizen ID on deposit to earn instant eco-points.
                    </span>
                  </div>
                )}
              </CardContent>

              <div className="p-6 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5"
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${hub.coordinates.lat},${hub.coordinates.lng}`;
                    window.open(url, "_blank");
                  }}
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open in Google Maps</span>
                </Button>
                <Link to={`/request-pickup`} className="w-full">
                  <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                    Schedule Pickup Instead
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
