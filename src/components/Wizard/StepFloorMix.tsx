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
        <div className="space-y-8 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 3: Mix de Pisos</CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Desglosa el Total SqFt en diferentes tipos de piso. Esto nos ayuda a entender la composición del edificio (La suma idealmente debe acercarse al Total del edificio).
                </CardDescription>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end border-b-2 border-black pb-2">
                    <Label className="text-black font-black uppercase tracking-widest text-lg">
                        Matriz de 6 Zonas
                    </Label>
                    <div className="text-right">
                        <span className="text-sm text-black font-bold uppercase block">Base de Cálculo (Paso 2)</span>
                        <div className="text-2xl font-black text-black">{totalSqft.toLocaleString('en-US')} SqFt</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {state.site.floorMatrix?.map((floor, index) => {
                        const pct = totalSqft > 0 && floor.sqft ? ((floor.sqft / totalSqft) * 100).toFixed(1) : "0.0";
                        return (
                            <div key={index} className="p-4 bg-white border-2 border-black rounded-xl shadow-sm space-y-3">
                                <div className="flex justify-between items-center mb-1 border-b-2 border-black pb-2">
                                    <span className="text-sm font-black text-black uppercase">Zona {index + 1}</span>
                                    <span className={`text-sm font-black px-2 py-1 rounded border-2 border-black ${Number(pct) > 0 ? "text-white bg-black" : "text-black bg-white"}`}>
                                        {pct}%
                                    </span>
                                </div>
                                <Select value={floor.floorType} onValueChange={v => handleFloorChange(index, 'floorType', v)}>
                                    <SelectTrigger className="bg-white border-2 border-black text-black h-12 font-bold text-lg">
                                        <SelectValue placeholder="Tipo de Piso" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-2 border-black text-black font-bold">
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
                                        value={floor.sqft || 0}
                                        onChange={e => handleFloorChange(index, 'sqft', e.target.value)}
                                        className="pl-4 pr-16 h-12 font-black text-lg text-black bg-white border-2 border-black focus-visible:ring-black"
                                    />
                                    <span className="absolute right-4 top-3 text-sm font-black text-black uppercase">SqFt</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
