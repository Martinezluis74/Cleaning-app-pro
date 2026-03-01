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

export type FloorEntry = {
    id: number;
    floorType: string; // 'Carpet', 'Hardwood', 'VCT', 'Ceramic', 'Concrete', ''
    sqft: number;
};

export type FloorRow = {
    id: string;
    floorType: string; // 'Carpet', 'Concrete', 'Vinyl', 'Tile', ''
    sqft: number;
};

export type SiteProfile = {
    siteType: string;
    sqft: number; // Keep this mainly as a sum aggregate if needed, or backward compatibility
    floorList: FloorRow[];
    cleaningFrequency: number; // e.g. 1 to 7
    desks: number;
    people: number;
    trashCans: number;
    floorMatrix: FloorEntry[]; // Legacy Matrix
    fixtures: {
        rooms: number;
        toilets: number;
        urinals: number;
        sinks: number;
        showers: number;
    };
    accessHours: string;
};

export type Area = {
    id: string; // uuid
    name: string; // e.g. "Main Floor"
    sqft: number;
    floorType: string; // 'Carpet', 'Hardwood', 'VCT'
    fixtures: {
        toilets: number;
        urinals: number;
        sinks: number;
    };
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

    // Financial Variables (Editable in Sidebar)
    financials: {
        laborRate: number;
        remittances: number;
        overheadMargin: number; // Percentage (e.g., 0.15 for 15%)
        profitMargin: number; // Percentage (e.g., 0.20 for 20%)
    };

    // Dynamic Pricing (fetched from API)
    pricingModel: PricingData | null;

    // Calculated Totals
    totals: {
        totalSqft: number;
        totalBathrooms: number;
        hoursPerVisit: number;
        totalHours: number;
        baseCost: number;
        costWithOverhead: number;
        subtotal: number;
        tax: number;
        finalTotal: number;
    }
};
