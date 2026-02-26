export type PricingData = {
    taskPrices: Array<{ taskId: string; priceValue: number }>;
    assumptions: Array<{ key: string; value: number }>;
};

export type ClientProfile = {
    name: string;
    email: string;
    phone: string;
    company: string;
};

export type SiteProfile = {
    siteType: string;
    sqft: number;
    cleaningFrequency: string; // e.g. "Weekly"
    accessHours: string;
};

export type InventoryItem = {
    id: string; // unique
    type: string; // 'Restroom', 'Kitchen', 'Stairwell', etc
    count: number;
};

export type Area = {
    id: string; // uuid
    name: string; // e.g. "Main Floor"
    sqft: number;
    floorType: string; // 'Carpet', 'Hardwood', 'VCT'
    inventory: InventoryItem[];
};

export type Addon = {
    id: string;
    name: string; // 'Carpet Extraction', 'Floor Scrub'
    frequency: 'One-time' | 'Recurring';
    clientInterest: 'Hot' | 'Warm' | 'Cold';
    sqft: number;
};

export type ComplianceData = {
    needsSecurityClearance: boolean;
    hasAlarmCode: boolean;
    alarmNotes: string;
};

export type EvidenceData = {
    walkthroughNotes: string;
    photosAttached: boolean; // Mock for now
};

export type WizardState = {
    currentStep: number;
    client: ClientProfile;
    site: SiteProfile;
    areas: Area[];
    addons: Addon[];
    compliance: ComplianceData;
    evidence: EvidenceData;

    // Dynamic Pricing (fetched from API)
    pricingModel: PricingData | null;

    // Calculated Totals
    totals: {
        totalSqft: number;
        totalBathrooms: number;
        subtotal: number;
        tax: number;
        finalTotal: number;
    }
};
