"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StepFloorMix() {
    const { state, updateSite } = useWizard();

    // The user input Total SqFt from Step 2
    const totalSqft = (typeof state.site.sqft === 'number' && !isNaN(state.site.sqft)) ? state.site.sqft : 0;

    const handleFloorChange = (index: number, field: string, value: any) => {
        const newMatrix = [...(state.site.floorMatrix || [])];

        let safeValue = value;
        if (field === 'sqft') {
            safeValue = Number(value) || 0;
        }

        newMatrix[index] = { ...newMatrix[index], [field]: safeValue };
        updateSite({ floorMatrix: newMatrix });
    };

    return (
        <div className="space-y-8">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 3: Mix de Pisos</CardTitle>
                <CardDescription className="text-slate-500">
                    Desglosa el Total SqFt en diferentes tipos de piso. Esto nos ayuda a entender la composición del edificio (La suma idealmente debe acercarse al Total del edificio).
                </CardDescription>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs text-blue-600">
                        Matriz de 6 Zonas
                    </Label>
                    <div className="text-right">
                        <span className="text-xs text-slate-500 font-bold uppercase">Base de Cálculo (Del Paso 2)</span>
                        <div className="text-xl font-black text-slate-900">{totalSqft.toLocaleString('en-US')} SqFt</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {state.site.floorMatrix?.map((floor, index) => {
                        const pct = totalSqft > 0 && floor.sqft ? ((floor.sqft / totalSqft) * 100).toFixed(1) : "0.0";
                        return (
                            <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3 hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-400">Zona {index + 1}</span>
                                    <span className={`text-xs font-black px-2 py-1 rounded ${Number(pct) > 0 ? "text-blue-600 bg-blue-50 border border-blue-100" : "text-slate-400 bg-slate-50"}`}>
                                        {pct}%
                                    </span>
                                </div>
                                <Select value={floor.floorType} onValueChange={v => handleFloorChange(index, 'floorType', v)}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 h-10 font-medium">
                                        <SelectValue placeholder="Tipo de Piso" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                        <SelectItem value="Carpet">Carpet</SelectItem>
                                        <SelectItem value="VCT">VCT</SelectItem>
                                        <SelectItem value="Ceramic Tile">Ceramic Tile</SelectItem>
                                        <SelectItem value="Concrete">Concrete</SelectItem>
                                        <SelectItem value="Hardwood">Hardwood</SelectItem>
                                        <SelectItem value="">Sin Asignar</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative">
                                    <Input
                                        type="number" min="0" placeholder="0"
                                        value={floor.sqft || ''}
                                        onChange={e => handleFloorChange(index, 'sqft', e.target.value)}
                                        className="pl-4 pr-16 h-10 font-bold text-slate-900 bg-slate-50 focus-visible:ring-blue-500"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">SqFt</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
