"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/context/WizardContext';

export default function StepCompliance() {
    const { state, updateCompliance } = useWizard();

    return (
        <div className="space-y-6 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 7: Compliance y Seguridad</CardTitle>
                <CardDescription className="text-black font-medium text-lg">Requerimientos de acceso y verificaciones.</CardDescription>
            </div>

            <div className="space-y-6 p-6 border-2 border-black rounded-xl bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <Switch
                        checked={state.compliance.needsSecurityClearance}
                        onCheckedChange={v => updateCompliance({ needsSecurityClearance: v })}
                        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300 border-2 border-black"
                    />
                    <Label className="text-black font-bold text-lg">Requiere Security Clearance</Label>
                </div>

                <div className="flex items-center space-x-3 mt-4">
                    <Switch
                        checked={state.compliance.hasAlarmCode}
                        onCheckedChange={v => updateCompliance({ hasAlarmCode: v })}
                        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300 border-2 border-black"
                    />
                    <Label className="text-black font-bold text-lg">Requiere Código de Alarma / Llave maestra</Label>
                </div>
            </div>
        </div>
    );
}
