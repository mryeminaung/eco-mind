// Shared API client
export { api } from "./api";

// Shared seed data
export * from "./seedData";

// Shared utilities
export { cn, formatWeight, formatCurrency } from "./utils";
export { MATERIAL_RATES, parseWeightKg, categorizeMaterial, calculateGreenPoints } from "./pointsCalculator";

// Shared components
export { PickupRequestCard } from "./components/PickupRequestCard";
export { EnvironmentalImpactCard } from "./components/EnvironmentalImpactCard";
export { ImpactOverview } from "./components/ImpactOverview";
export { WasteCategoryBadge, categoryMeta } from "./components/WasteCategoryBadge";
export { CollectionStatusBadge } from "./components/CollectionStatusBadge";

// Shared UI primitives
export { Button } from "./ui/button";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
export { Input } from "./ui/input";
export { Textarea } from "./ui/textarea";
export { Badge } from "./ui/badge";
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
