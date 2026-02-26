"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/context/WizardContext';

export default function StepCompliance() {
    const { state, updateCompliance } = useWizard();

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 7: Compliance y Seguridad</CardTitle>
                <CardDescription className="text-slate-500">Requerimientos de acceso y verificaciones.</CardDescription>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={state.compliance.needsSecurityClearance}
                        onCheckedChange={v => updateCompliance({ needsSecurityClearance: v })}
                    />
                    <Label className="text-slate-700">Requiere Security Clearance</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        checked={state.compliance.hasAlarmCode}
                        onCheckedChange={v => updateCompliance({ hasAlarmCode: v })}
                    />
                    <Label className="text-slate-700">Requiere Código de Alarma / Llave maestra</Label>
                </div>
            </div>
        </div>
    );
}
