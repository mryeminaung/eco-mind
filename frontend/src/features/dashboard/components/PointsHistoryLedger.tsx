import React from "react";
import { Sparkles, Calendar, Scale, Leaf, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { PointsTransaction } from "@/types";

interface PointsHistoryLedgerProps {
  transactions: PointsTransaction[];
  loading?: boolean;
}

export const PointsHistoryLedger: React.FC<PointsHistoryLedgerProps> = ({
  transactions,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200">
        <CardContent className="p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Points Transactions Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Submit a recycling collection request or drop-off materials to start earning Green Points and reducing landfill waste!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "plastic":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Plastic (10 pts/kg)</Badge>;
      case "paper":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Paper (5 pts/kg)</Badge>;
      case "glass":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Glass (8 pts/kg)</Badge>;
      case "metal":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Metal (15 pts/kg)</Badge>;
      default:
        return <Badge variant="outline">Recyclable (8 pts/kg)</Badge>;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Green Points Activity Log
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Verified record of completed recycling requests & environmental credits
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold bg-white">
            {transactions.length} Completed Records
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-slate-100">
        {transactions.map((tx) => {
          const dateStr = new Date(tx.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={tx.id}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{tx.material}</span>
                  {getCategoryBadge(tx.materialCategory)}
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {dateStr}
                  </span>
                </div>

                {/* Environmental impact note for each transaction */}
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    {tx.environmentalImpact?.summaryStatement ||
                      `Recycled ${tx.weightKg}kg and saved ${tx.weightKg}kg landfill waste.`}
                  </span>
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span>Batch: <strong className="text-slate-700">{tx.quantity}</strong></span>
                  <span>•</span>
                  <span>Rate: <strong className="text-slate-700">{tx.ratePerKg} pts/kg</strong></span>
                  <span>•</span>
                  <span>Weight: <strong className="text-slate-700">{tx.weightKg} kg</strong></span>
                </div>
              </div>

              {/* Points Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-lg sm:text-xl">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>+{tx.pointsEarned}</span>
                  <span className="text-xs font-bold text-emerald-800">pts</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Recycled</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
