"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
    WizardState, ClientProfile, SiteProfile, Area, Addon,
    ComplianceData, EvidenceData, PricingData
} from '@/types/wizard';

// Default initial state
const defaultState: WizardState = {
    currentStep: 1,
    client: { name: '', email: '', phone: '', company: '' },
    site: {
        siteType: 'Office',
        buildingClass: 'B',
        sqft: 0,
        cleaningFrequency: 5,
        floorMatrix: [
            { id: 1, floorType: 'Carpet', sqft: 0 },
            { id: 2, floorType: 'VCT', sqft: 0 },
            { id: 3, floorType: 'Ceramic Tile', sqft: 0 },
            { id: 4, floorType: '', sqft: 0 },
            { id: 5, floorType: '', sqft: 0 },
            { id: 6, floorType: '', sqft: 0 }
        ],
        fixtures: { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 },
        accessHours: 'After 6 PM'
    },
    areas: [],
    addons: [],
    compliance: { needsSecurityClearance: false, hasAlarmCode: false, alarmNotes: '' },
    evidence: { walkthroughNotes: '', photosAttached: false },
    financials: {
        laborRate: 17.60,
        remittances: 2.50,
        overheadMargin: 0.15,
        profitMargin: 0.20
    },
    pricingModel: null,
    totals: {
        totalSqft: 0,
        totalBathrooms: 0,
        totalHours: 0,
        baseCost: 0,
        costWithOverhead: 0,
        subtotal: 0,
        tax: 0,
        finalTotal: 0
    }
};

type WizardContextType = {
    state: WizardState;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    updateClient: (data: Partial<ClientProfile>) => void;
    updateSite: (data: Partial<SiteProfile>) => void;

    addArea: (area: Area) => void;
    updateArea: (id: string, element: Partial<Area>) => void;
    removeArea: (id: string) => void;
    duplicateArea: (id: string) => void;

    addAddon: (addon: Addon) => void;
    updateAddon: (id: string, element: Partial<Addon>) => void;
    removeAddon: (id: string) => void;

    updateCompliance: (data: Partial<ComplianceData>) => void;
    updateEvidence: (data: Partial<EvidenceData>) => void;

    updateFinancials: (data: Partial<WizardState['financials']>) => void;

    calculateTotals: () => void;
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<WizardState>(defaultState);

    // Fetch pricing model from Neon API on mount
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await fetch('/api/prices');
                if (res.ok) {
                    const data = await res.json();
                    setState(prev => ({ ...prev, pricingModel: data }));
                }
            } catch (err) {
                console.error("Failed to fetch Neon pricing data:", err);
            }
        };
        fetchPricing();
    }, []);

    // Helper: trigger recaculation whenever core cost drivers change
    useEffect(() => {
        if (state.pricingModel) {
            recalculateTotals();
        }
    }, [state.areas, state.addons, state.site, state.pricingModel, state.financials]);

    const recalculateTotals = () => {
        setState(prev => {
            const { areas, addons, pricingModel, financials, site } = prev;
            if (!pricingModel) return prev;

            let totalSqft = site.sqft || 0;
            let totalHours = 0;

            const hstRateStr = pricingModel.assumptions.find(a => a.key === 'HST')?.value || 0.13;
            const hstRate = Number(hstRateStr);

            // Determine Production Rate based on Building Class
            let productionRate = 2500; // Default Class B
            if (site.buildingClass === 'A') productionRate = 2000;
            if (site.buildingClass === 'C') productionRate = 3000;

            // 1. Calculate Base Building Hours
            const { rooms, toilets, urinals, sinks, showers } = site.fixtures || { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 };
            const totalBathrooms = rooms || 0;

            // Estimate hours: (Area / Production Rate) + (Fixtures * Mins/Unit / 60)
            // Timings: Toilet: 3 mins, Urinal: 2 mins, Sink: 1 min, Shower: 5 mins
            const fixtureHours = ((toilets * 3) + (urinals * 2) + (sinks * 1) + (showers * 5)) / 60;

            // Si hay áreas detalladas (Paso 3 y 4 se mantienen temporalmente), las sumamos.
            // Pero la base principal ahora viene del Step 2 (Levantamiento Técnico).
            let areasSqft = 0;
            let areasFixtureHours = 0;
            let areasBathrooms = 0;
            areas.forEach(area => {
                areasSqft += area.sqft;
                const { toilets: aT, urinals: aU, sinks: aS } = area.fixtures || { toilets: 0, urinals: 0, sinks: 0 };
                areasBathrooms += (aT + aU + aS);
                areasFixtureHours += ((aT * 3) + (aU * 2) + (aS * 1)) / 60;
            });

            // Usar áreas detalladas si existen, si no, usar el total del edificio
            const effectiveSqft = areas.length > 0 ? areasSqft : totalSqft;
            const effectiveBathrooms = areas.length > 0 ? areasBathrooms : totalBathrooms;
            const effectiveFixtureHours = areas.length > 0 ? areasFixtureHours : fixtureHours;

            // Base Hours per Day
            const baseDailyHours = (effectiveSqft / productionRate) + effectiveFixtureHours;

            // Adjust Total Hours based on Frequency (assuming rate is hourly, frequency affects weekly/monthly totals. For this mock, we calculate per visit)
            // If the quote is per month, it would be baseDailyHours * (site.cleaningFrequency * 4.33).
            // For now, we simulate a single visit or a week's snapshot as `totalHours`. Let's assume daily snapshot to match standard rate cards.
            totalHours += baseDailyHours;

            // 2. Add Add-ons hours
            addons.forEach(addon => {
                // Estimate 1 hour per 500 sqft for addons as a baseline
                totalHours += (addon.sqft / 500);
            });

            // Financial Calculation: 4-Step Logic
            const { laborRate, remittances, overheadMargin, profitMargin } = financials;

            // Step 1: Base Cost (Labor + Remittances)
            const baseCost = (laborRate + remittances) * totalHours;

            // Step 2: Overhead
            const costWithOverhead = baseCost + (baseCost * overheadMargin);

            // Step 3: Profit Margin (Subtotal)
            const subtotal = costWithOverhead + (costWithOverhead * profitMargin);

            // Step 4: Tax and Total
            const tax = subtotal * hstRate;
            const finalTotal = subtotal + tax;

            return {
                ...prev,
                totals: {
                    totalSqft: effectiveSqft,
                    totalBathrooms: effectiveBathrooms,
                    totalHours: Number(totalHours.toFixed(2)),
                    baseCost: Number(baseCost.toFixed(2)),
                    costWithOverhead: Number(costWithOverhead.toFixed(2)),
                    subtotal: Number(subtotal.toFixed(2)),
                    tax: Number(tax.toFixed(2)),
                    finalTotal: Number(finalTotal.toFixed(2))
                }
            };
        });
    };

    const setStep = (step: number) => setState(prev => ({ ...prev, currentStep: step }));
    const nextStep = () => setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 8) }));
    const prevStep = () => setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));

    const updateClient = (data: Partial<ClientProfile>) => setState(prev => ({ ...prev, client: { ...prev.client, ...data } }));
    const updateSite = (data: Partial<SiteProfile>) => setState(prev => ({ ...prev, site: { ...prev.site, ...data } }));

    // Areas
    const addArea = (area: Area) => setState(prev => ({ ...prev, areas: [...prev.areas, area] }));
    const updateArea = (id: string, data: Partial<Area>) => setState(prev => ({
        ...prev,
        areas: prev.areas.map(a => a.id === id ? { ...a, ...data } : a)
    }));
    const removeArea = (id: string) => setState(prev => ({
        ...prev,
        areas: prev.areas.filter(a => a.id !== id)
    }));
    const duplicateArea = (id: string) => setState(prev => {
        const target = prev.areas.find(a => a.id === id);
        if (!target) return prev;
        const copy: Area = {
            ...target,
            id: crypto.randomUUID(),
            name: `${target.name} (Copy)`,
            fixtures: { ...target.fixtures }
        };
        return { ...prev, areas: [...prev.areas, copy] };
    });

    // Addons
    const addAddon = (addon: Addon) => setState(prev => ({ ...prev, addons: [...prev.addons, addon] }));
    const updateAddon = (id: string, data: Partial<Addon>) => setState(prev => ({
        ...prev,
        addons: prev.addons.map(a => a.id === id ? { ...a, ...data } : a)
    }));
    const removeAddon = (id: string) => setState(prev => ({
        ...prev,
        addons: prev.addons.filter(a => a.id !== id)
    }));

    // Compliance & Evidence
    const updateCompliance = (data: Partial<ComplianceData>) => setState(prev => ({ ...prev, compliance: { ...prev.compliance, ...data } }));
    const updateEvidence = (data: Partial<EvidenceData>) => setState(prev => ({ ...prev, evidence: { ...prev.evidence, ...data } }));

    // Financials
    const updateFinancials = (data: Partial<WizardState['financials']>) => setState(prev => ({ ...prev, financials: { ...prev.financials, ...data } }));

    return (
        <WizardContext.Provider value={{
            state, setStep, nextStep, prevStep,
            updateClient, updateSite,
            addArea, updateArea, removeArea, duplicateArea,
            addAddon, updateAddon, removeAddon,
            updateCompliance, updateEvidence,
            updateFinancials,
            calculateTotals: recalculateTotals
        }}>
            {children}
        </WizardContext.Provider>
    );
}

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
};
