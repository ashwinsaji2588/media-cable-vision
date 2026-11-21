import plansJson from "./plans-data.json";

export type ProviderName =
  | "Asianet"
  | "Kerala Vision"
  | "BSNL"
  | "KFON"
  | "Extranet";
export type PlanCategory = "broadband" | "cable-tv" | "combo";

export interface Plan {
  id: string;
  name: string;
  provider: ProviderName;
  providerLogo: string;
  category: PlanCategory;
  price: number;
  speed?: string;
  data?: string;
  channels?: string;
  badge?: string;
  popular?: boolean;
  ottApps?: string[];
  features: string[];
  serviceCode: "BROADBAND" | "CABLE_TV" | "BOTH";
}

export const LAST_SYNCED: string = plansJson.lastSynced;
export const PROVIDER_PLANS: Plan[] = plansJson.plans as Plan[];
