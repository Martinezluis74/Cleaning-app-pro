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
        sqft: 0,
        cleaningFrequency: 5,
        desks: 0,
        people: 0,
        trashCans: 0,
        floorMatrix: [
            { id: 1, floorType: 'Carpet', sqft: 0 },
            { id: 2, floorType: 'VCT', sqft: 0 },
            { id: 3, floorType: 'Ceramic Tile', sqft: 0 },
            { id: 4, floorType: '', sqft: 0 },
            { id: 5, floorType: '', sqft: 0 },
            { id: 6, floorType: '', sqft: 0 }
        ],
        floorList: [],
        fixtures: { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 },
        accessHours: 'After 6 PM'
    },
    areas: [],
    addons: [],
    compliance: { needsSecurityClearance: false, hasAlarmCode: false, alarmNotes: '' },
    evidence: { walkthroughNotes: '', photosAttached: false },
    financials: {
        laborRate: 17.60,
        hourlyPayRate: 18.00,
        remittances: 2.50,
        overheadMargin: 0.15,
        profitMargin: 0.20,
        discountPercentage: 0
    },
    pricingModel: null,
    totals: {
        totalSqft: 0,
        totalBathrooms: 0,
        calculatedHoursPerVisit: 0,
        hoursPerVisit: 0,
        bufferHours: 0,
        totalHours: 0, // Weekly Hours
        baseCost: 0,
        actualCost: 0,
        costWithOverhead: 0,
        subtotal: 0,
        discountAmount: 0,
        tax: 0,
        finalTotal: 0,
        grossProfit: 0,
        marginPercentage: 0
    }
};

type WizardContextType = {
    state: WizardState;
    setState: React.Dispatch<React.SetStateAction<WizardState>>;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    updateClient: (data: Partial<ClientProfile>) => void;
    updateSite: (data: Partial<SiteProfile>) => void;
    updateFinancials: (data: Partial<WizardState['financials']>) => void;

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
    }, [state.areas, state.addons, state.site, state.pricingModel, state.financials]);

    const recalculateTotals = () => {
        setState(prev => {
            const { areas, addons, pricingModel, financials, site } = prev;
            if (!pricingModel) return prev;

            const safeNum = (val: any) => {
                const num = Number(val);
                return isNaN(num) ? 0 : num;
            };

            let totalSqft = safeNum(site?.sqft);

            const hstRateStr = pricingModel.assumptions?.find(a => a.key === 'HST')?.value || 0.13;
            const hstRate = safeNum(hstRateStr);

            const prodRateStr = pricingModel.assumptions?.find(a => a.key === 'ProductionRate')?.value;
            const defaultProductionRate = prodRateStr ? safeNum(prodRateStr) : 2500;

            let floorHours = 0;

            // Multimaterial Floor Math (Vacuum vs Dust+Wet Mopping)
            const findRate = (keywords: string[], fallback: number) => {
                const found = pricingModel.taskPrices?.find(t =>
                    keywords.some(kw => t.taskId.toLowerCase().includes(kw))
                );
                return found ? found.priceValue : fallback;
            };

            const vacuumRate = findRate(['vacuuming', 'vacuum', 'alfombra', 'carpet'], 2500);
            const dustMopRate = findRate(['dust mopping', 'dust mop', 'sweeping'], 4000);
            const wetMopRate = findRate(['wet mopping', 'wet mop', 'trapear'], 3500);

            if (site.floorList && site.floorList.length > 0) {
                totalSqft = 0; // recalc total SqFt based on list explicitly
                site.floorList.forEach(f => {
                    const sqft = safeNum(f.sqft);
                    totalSqft += sqft;

                    if (f.floorType.toLowerCase().includes('alfombra') || f.floorType.toLowerCase().includes('carpet')) {
                        floorHours += (sqft / vacuumRate);
                    } else if (f.floorType.trim() !== '') {
                        // Duro (Baldosa/Concreto/Vinilo -> Dust + Wet)
                        floorHours += (sqft / dustMopRate) + (sqft / wetMopRate);
                    }
                });
            } else {
                floorHours = totalSqft / defaultProductionRate; // Manual fallback bridge
            }

            const desks = safeNum(site?.desks);
            const deskHours = (desks * 2) / 60; // 2 minutos por escritorio (Wipe down)

            const trashCans = safeNum(site?.trashCans);
            const trashHours = (trashCans * 1.5) / 60; // 1.5 minutos por caneca

            const fixtures = site?.fixtures || { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 };
            const rooms = safeNum(fixtures.rooms);
            const toilets = safeNum(fixtures.toilets);
            const urinals = safeNum(fixtures.urinals);
            const sinks = safeNum(fixtures.sinks);
            const showers = safeNum(fixtures.showers);
            const totalBathrooms = rooms;

            const fixtureHours = ((toilets * 3) + (urinals * 2) + (sinks * 1) + (showers * 5)) / 60;

            let areasSqft = 0;
            let areasFixtureHours = 0;
            let areasBathrooms = 0;

            if (areas && areas.length > 0) {
                areas.forEach(area => {
                    areasSqft += safeNum(area.sqft);
                    const af = area.fixtures || { toilets: 0, urinals: 0, sinks: 0 };
                    const aT = safeNum(af.toilets);
                    const aU = safeNum(af.urinals);
                    const aS = safeNum(af.sinks);
                    areasBathrooms += (aT + aU + aS);
                    areasFixtureHours += ((aT * 3) + (aU * 2) + (aS * 1)) / 60;
                });
            }

            const effectiveSqft = (areas && areas.length > 0) ? areasSqft : totalSqft;
            const effectiveBathrooms = (areas && areas.length > 0) ? areasBathrooms : totalBathrooms;
            const effectiveFixtureHours = (areas && areas.length > 0) ? areasFixtureHours : fixtureHours;

            // Suma de minutos totales convertida a Horas por Visita (REAL TIME)
            const baseDailyHours = (areas && areas.length > 0 ? (effectiveSqft / defaultProductionRate) : floorHours) + deskHours + trashHours + effectiveFixtureHours;
            const calculatedHoursPerVisit = safeNum(baseDailyHours);

            let totalHoursPerVisit = calculatedHoursPerVisit;

            if (addons && addons.length > 0) {
                addons.forEach(addon => {
                    totalHoursPerVisit += (safeNum(addon.sqft) / 500);
                });
            }

            // Aplicar Regla del Mínimo Facturable (3.0 horas)
            const billableHoursPerVisit = Math.max(3.0, totalHoursPerVisit);
            const bufferHours = Math.max(0, billableHoursPerVisit - totalHoursPerVisit);

            // Multiplica por la Frecuencia para dar el total de horas semanales
            const frequency = safeNum(site?.cleaningFrequency) || 1;
            const totalWeeklyBillableHours = billableHoursPerVisit * frequency;
            const totalWeeklyCalculatedHours = totalHoursPerVisit * frequency;

            // Calcula el costo
            const laborRate = safeNum(financials?.laborRate);
            const hourlyPayRate = financials?.hourlyPayRate !== undefined ? safeNum(financials.hourlyPayRate) : 18.00;
            const remittances = laborRate * 0.1865; // 18.65% Cargas Prestacionales automáticas
            const fullyLoadedLaborRate = laborRate + remittances;

            // Actual Cost / Total Labor Cost (Cálculo interno de empleado)
            const actualCost = hourlyPayRate * totalWeeklyCalculatedHours;

            // Base Cost (Costo base facturable para el modelo)
            const baseCost = fullyLoadedLaborRate * totalWeeklyBillableHours;

            const overheadMargin = safeNum(financials?.overheadMargin);
            const profitMargin = safeNum(financials?.profitMargin);
            const discountPercentage = safeNum(financials?.discountPercentage) / 100; // Si puso 10, es 0.10

            const costWithOverhead = baseCost + (baseCost * overheadMargin);
            const rawSubtotal = costWithOverhead + (costWithOverhead * profitMargin);

            // Apply Discount to Subtotal
            const discountAmount = rawSubtotal * discountPercentage;
            const discountedSubtotal = rawSubtotal - discountAmount;

            const tax = discountedSubtotal * hstRate;
            const finalTotal = discountedSubtotal + tax;

            // Gross Profit Analysis
            const grossProfit = discountedSubtotal - actualCost;
            const marginPercentage = discountedSubtotal > 0 ? (grossProfit / discountedSubtotal) * 100 : 0;

            return {
                ...prev,
                totals: {
                    totalSqft: effectiveSqft,
                    totalBathrooms: effectiveBathrooms,
                    calculatedHoursPerVisit: safeNum(totalHoursPerVisit.toFixed(2)),
                    hoursPerVisit: safeNum(billableHoursPerVisit.toFixed(2)),
                    bufferHours: safeNum(bufferHours.toFixed(2)),
                    totalHours: safeNum(totalWeeklyBillableHours.toFixed(2)),
                    baseCost: safeNum(baseCost.toFixed(2)),
                    actualCost: safeNum(actualCost.toFixed(2)),
                    costWithOverhead: safeNum(costWithOverhead.toFixed(2)),
                    subtotal: safeNum(discountedSubtotal.toFixed(2)),
                    discountAmount: safeNum(discountAmount.toFixed(2)),
                    tax: safeNum(tax.toFixed(2)),
                    finalTotal: safeNum(finalTotal.toFixed(2)),
                    grossProfit: safeNum(grossProfit.toFixed(2)),
                    marginPercentage: safeNum(marginPercentage.toFixed(2))
                }
            };
        });
    };

    const setStep = (step: number) => setState(prev => ({ ...prev, currentStep: step }));
    const nextStep = () => setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 8) }));
    const prevStep = () => setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));

    const updateFinancials = (data: Partial<WizardState['financials']>) => setState(prev => ({ ...prev, financials: { ...prev.financials, ...data } }));
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


    return (
        <WizardContext.Provider value={{
            state, setState, setStep, nextStep,
            prevStep,
            updateFinancials,
            updateClient,
            updateSite,
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
