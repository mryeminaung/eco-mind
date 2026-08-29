import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../shared/ui/dialog";
import { Button } from "../../shared/ui/button";
import { RecyclingCenter } from "@/types";

interface DeleteCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  center: RecyclingCenter | null;
  onConfirmDelete: (centerId: string) => Promise<void>;
}

export const DeleteCenterDialog: React.FC<DeleteCenterDialogProps> = ({
  open,
  onOpenChange,
  center,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!center) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirmDelete(center.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete center:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Delete Recycling Center?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                This action is irreversible and will remove the facility from the public map.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <p className="font-semibold text-slate-900">{center.name}</p>
          <p className="text-slate-600">📍 {center.location}</p>
          <p className="text-slate-500">📞 {center.phone}</p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            id="btn-confirm-delete-center"
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white border-transparent gap-1.5 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};
