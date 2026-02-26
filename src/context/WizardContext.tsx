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
    site: { siteType: 'Office', sqft: 0, cleaningFrequency: 'Weekly', accessHours: 'After 6 PM' },
    areas: [],
    addons: [],
    compliance: { needsSecurityClearance: false, hasAlarmCode: false, alarmNotes: '' },
    evidence: { walkthroughNotes: '', photosAttached: false },
    pricingModel: null,
    totals: {
        totalSqft: 0,
        totalBathrooms: 0,
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
    }, [state.areas, state.addons, state.site.cleaningFrequency, state.pricingModel]);

    const recalculateTotals = () => {
        setState(prev => {
            const { areas, addons, pricingModel } = prev;
            if (!pricingModel) return prev;

            let totalSqft = 0;
            let totalBathrooms = 0;
            let rawSubtotal = 0; // Simple mock calculation logic for the frontend until matched with specific Task IDs

            const hstRateStr = pricingModel.assumptions.find(a => a.key === 'HST')?.value || 0.13;
            const hstRate = Number(hstRateStr);

            // 1. Calculate Areas base cost
            areas.forEach(area => {
                totalSqft += area.sqft;
                const bathCount = area.inventory.find(i => i.type === 'Restroom')?.count || 0;
                totalBathrooms += bathCount;

                // Base 0.05 per sqft + 15 per bathroom (Simulated using dynamic logic rules, real app uses exact Task values from the fetched pricingModel)
                // In a true M5 calculation, this iterates the Engine rules using pricingModel.taskPrices values
                rawSubtotal += (area.sqft * 0.05) + (bathCount * 15.0);
            });

            // 2. Add Add-ons cost
            addons.forEach(addon => {
                if (addon.frequency === 'Recurring') {
                    // e.g. Carpet Extraction recurring
                    rawSubtotal += (addon.sqft * 0.15);
                } else {
                    // One-time is separated, but we can add to a unique 'Setup Fee' or keep in subtotal based on business rules
                    rawSubtotal += (addon.sqft * 0.20);
                }
            });

            const tax = rawSubtotal * hstRate;
            const finalTotal = rawSubtotal + tax;

            return {
                ...prev,
                totals: {
                    totalSqft,
                    totalBathrooms,
                    subtotal: Number(rawSubtotal.toFixed(2)),
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
        const copy = { ...target, id: crypto.randomUUID(), name: `${target.name} (Copy)` };
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

    return (
        <WizardContext.Provider value={{
            state, setStep, nextStep, prevStep,
            updateClient, updateSite,
            addArea, updateArea, removeArea, duplicateArea,
            addAddon, updateAddon, removeAddon,
            updateCompliance, updateEvidence,
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
