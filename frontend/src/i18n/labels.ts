const CITY_KEYS: Record<string, string> = {
  All: "city.all",
  Yangon: "city.yangon",
  Mandalay: "city.mandalay",
  Naypyidaw: "city.naypyidaw",
  Bago: "city.bago",
  Mawlamyine: "city.mawlamyine",
  Taunggyi: "city.taunggyi",
};

const MATERIAL_KEYS: Record<string, string> = {
  all: "material.all",
  plastic: "material.plastic",
  paper: "material.paper",
  metal: "material.metal",
  glass: "material.glass",
  electronic: "material.electronic",
  organic: "material.organic",
  textile: "material.textile",
};

export function cityLabelKey(city: string) {
  return CITY_KEYS[city] ?? "city.all";
}

export function materialLabelKey(material: string) {
  return MATERIAL_KEYS[material] ?? `material.${material}`;
}

export function statusLabelKey(status: string) {
  return `page.status.${status.toLowerCase()}`;
}
