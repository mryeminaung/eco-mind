import React, { useState, useEffect } from "react";
import { Plus, X, Building2, MapPin, Phone, Clock, Layers, Sparkles } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../shared/ui/dialog";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { RecyclingCenter } from "@/types";

interface RecyclingCenterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centerToEdit?: RecyclingCenter | null;
  onSave: (data: {
    name: string;
    location: string;
    acceptedMaterials: string[];
    phone: string;
    openingHours: string;
  }) => Promise<void>;
}

const COMMON_MATERIALS = [
  "Plastic",
  "PET Bottles",
  "Paper",
  "Cardboard",
  "Scrap Metal",
  "Aluminum Cans",
  "Glass",
  "Electronic Waste",
  "Batteries",
  "Organic Waste",
  "Textiles",
  "Industrial Plastic",
];

const PRESET_HOURS = [
  "Mon - Sat: 8:00 AM - 5:00 PM",
  "Mon - Sat: 8:30 AM - 5:30 PM",
  "Mon - Sun: 7:30 AM - 6:00 PM",
  "Daily: 9:00 AM - 5:00 PM",
  "Tue - Sun: 8:00 AM - 4:00 PM",
  "Open 24/7 (Staffed 8am - 6pm)",
];

export const RecyclingCenterModal: React.FC<RecyclingCenterModalProps> = ({
  open,
  onOpenChange,
  centerToEdit,
  onSave,
}) => {
  const isEditing = Boolean(centerToEdit);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [customMaterial, setCustomMaterial] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form when opening or changing centerToEdit
  useEffect(() => {
    if (centerToEdit) {
      setName(centerToEdit.name || "");
      setLocation(centerToEdit.location || "");
      setPhone(centerToEdit.phone || "");
      setOpeningHours(centerToEdit.openingHours || "");
      setSelectedMaterials(centerToEdit.acceptedMaterials || []);
    } else {
      setName("");
      setLocation("");
      setPhone("+95 9 ");
      setOpeningHours("Mon - Sat: 8:00 AM - 5:00 PM");
      setSelectedMaterials(["Plastic", "Paper", "Scrap Metal"]);
    }
    setErrors({});
    setCustomMaterial("");
  }, [centerToEdit, open]);

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
    if (errors.materials) {
      setErrors((prev) => ({ ...prev, materials: "" }));
    }
  };

  const handleAddCustomMaterial = () => {
    const trimmed = customMaterial.trim();
    if (!trimmed) return;
    if (!selectedMaterials.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedMaterials((prev) => [...prev, trimmed]);
    }
    setCustomMaterial("");
    if (errors.materials) {
      setErrors((prev) => ({ ...prev, materials: "" }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Center name is required.";
    if (!location.trim()) newErrors.location = "Location / Address is required.";
    if (!phone.trim() || phone.trim() === "+95 9") newErrors.phone = "Phone number is required.";
    if (!openingHours.trim()) newErrors.openingHours = "Opening hours are required.";
    if (selectedMaterials.length === 0) newErrors.materials = "Please select at least one accepted material.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        location: location.trim(),
        acceptedMaterials: selectedMaterials,
        phone: phone.trim(),
        openingHours: openingHours.trim(),
      });
      onOpenChange(false);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, form: err.message || "Failed to save recycling center" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100/80 text-emerald-800">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {isEditing ? "Edit Recycling Center" : "Add New Recycling Center"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {isEditing
                  ? "Update facility profile, location, accepted streams, and contact numbers."
                  : "Register a verified recycling center or waste recovery depot to the Myanmar network."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errors.form && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
            {errors.form}
          </div>
        )}

        <div className="space-y-3.5 text-xs text-slate-700">
          {/* Center Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Recycling Center Name <span className="text-rose-500">*</span>
            </label>
            <Input
              id="input-center-name"
              placeholder="e.g., RecyGlo Green Recovery Hub Mandalay"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={errors.name ? "border-rose-400 focus:ring-rose-400" : ""}
            />
            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Location / Full Address <span className="text-rose-500">*</span>
            </label>
            <Input
              id="input-center-location"
              placeholder="e.g., 73rd Street, Between 31st & 32nd, Chanayethazan, Mandalay"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
              }}
              className={errors.location ? "border-rose-400 focus:ring-rose-400" : ""}
            />
            {errors.location && <p className="text-[11px] text-rose-500 font-medium">{errors.location}</p>}
          </div>

          {/* Phone & Operating Hours (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-center-phone"
                placeholder="+95 9 123 456 789"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                className={errors.phone ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.phone && <p className="text-[11px] text-rose-500 font-medium">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Opening Hours <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-center-hours"
                placeholder="Mon - Sat: 8:00 AM - 5:00 PM"
                value={openingHours}
                onChange={(e) => {
                  setOpeningHours(e.target.value);
                  if (errors.openingHours) setErrors((prev) => ({ ...prev, openingHours: "" }));
                }}
                className={errors.openingHours ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.openingHours && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.openingHours}</p>
              )}
            </div>
          </div>

          {/* Quick presets for opening hours */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Quick Hour Presets:</span>
            <div className="flex flex-wrap gap-1">
              {PRESET_HOURS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setOpeningHours(preset)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    openingHours === preset
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Accepted Materials Stream */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Accepted Materials Stream <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Selected: {selectedMaterials.length}
              </span>
            </div>

            {/* Common tags */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/80">
              {COMMON_MATERIALS.map((mat) => {
                const isSelected = selectedMaterials.includes(mat);
                return (
                  <button
                    type="button"
                    key={mat}
                    onClick={() => toggleMaterial(mat)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {isSelected && <span className="text-xs">✓</span>}
                    {mat}
                  </button>
                );
              })}
            </div>

            {/* Custom material input */}
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="Add custom material (e.g. Copper Wire, Lead Batteries)..."
                value={customMaterial}
                onChange={(e) => setCustomMaterial(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomMaterial();
                  }
                }}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomMaterial}
                className="shrink-0 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </Button>
            </div>

            {errors.materials && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.materials}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            id="btn-save-center"
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            {isSubmitting ? (
              <span>Saving Center...</span>
            ) : isEditing ? (
              <span>Update Center</span>
            ) : (
              <span>Publish Recycling Center</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
