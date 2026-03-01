"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { FloorRow } from '@/types/wizard';

export default function StepSiteProfile() {
    const { state, updateSite } = useWizard();

    // Safely initialize floorList if empty
    const floorList: FloorRow[] = state.site.floorList || [];

    const addFloorRow = () => {
        const newRow: FloorRow = { id: crypto.randomUUID(), floorType: '', sqft: 0 };
        updateSite({ floorList: [...floorList, newRow] });
    };

    const updateFloorRow = (id: string, updates: Partial<FloorRow>) => {
        const updated = floorList.map(row => row.id === id ? { ...row, ...updates } : row);
        updateSite({ floorList: updated });
    };

    const removeFloorRow = (id: string) => {
        const updated = floorList.filter(row => row.id !== id);
        updateSite({ floorList: updated });
    };

    // Helpert function to calculate individual row minutes based on context prices
    const getRowMinutes = (row: FloorRow) => {
        if (!row.sqft || !state.pricingModel) return 0;

        const sqft = Number(row.sqft);
        const findRate = (keywords: string[], fallback: number) => {
            const found = state.pricingModel?.taskPrices?.find(t =>
                keywords.some(kw => t.taskId.toLowerCase().includes(kw))
            );
            return found ? found.priceValue : fallback;
        };

        if (row.floorType === 'Carpet' || row.floorType === 'Alfombra') {
            const r = findRate(['vacuuming', 'vacuum', 'alfombra', 'carpet'], 2500);
            return (sqft / r) * 60;
        } else if (row.floorType && row.floorType !== '') {
            const dMop = findRate(['dust mopping', 'dust mop', 'sweeping'], 4000);
            const wMop = findRate(['wet mopping', 'wet mop', 'trapear'], 3500);
            return ((sqft / dMop) + (sqft / wMop)) * 60;
        }
        return 0;
    };

    return (
        <div className="space-y-8 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 2: Perfil Base del Edificio</CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Ingresa los datos fundamentales del sitio. Asegúrate de proporcionar el área total exacta.
                </CardDescription>
            </div>

            <div className="space-y-8">
                {/* DYNAMIC FLOOR INVENTORY TABLE */}
                <div className="bg-white border-4 border-black rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <Label className="text-2xl text-black font-black uppercase tracking-widest">Inventario de Pisos (SqFt)</Label>
                        <button
                            onClick={addFloorRow}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-black border-4 border-black hover:bg-slate-100 uppercase tracking-widest"
                        >
                            <Plus size={20} /> Add Floor Type
                        </button>
                    </div>

                    <div className="space-y-4">
                        {floorList.map((row) => (
                            <div key={row.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 border-2 border-slate-200">
                                <div className="col-span-12 md:col-span-4">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">Superficie</Label>
                                    <Select
                                        value={row.floorType}
                                        onValueChange={(val) => updateFloorRow(row.id, { floorType: val })}
                                    >
                                        <SelectTrigger className="mt-1 border-2 border-black text-black font-bold h-12 bg-white focus:ring-black rounded-none">
                                            <SelectValue placeholder="Seleccione Tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-2 border-black">
                                            <SelectItem value="Carpet" className="font-bold text-black focus:bg-slate-200 hover:bg-slate-200 cursor-pointer">Carpet (Alfombra)</SelectItem>
                                            <SelectItem value="Concrete" className="font-bold text-black focus:bg-slate-200 hover:bg-slate-200 cursor-pointer">Concrete (Concreto)</SelectItem>
                                            <SelectItem value="Vinyl" className="font-bold text-black focus:bg-slate-200 hover:bg-slate-200 cursor-pointer">Vinyl / VCT</SelectItem>
                                            <SelectItem value="Ceramic" className="font-bold text-black focus:bg-slate-200 hover:bg-slate-200 cursor-pointer">Ceramic Tile (Baldosa)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-12 md:col-span-3">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">SqFt</Label>
                                    <Input
                                        type="number" min="0" placeholder="0"
                                        value={row.sqft || ''}
                                        onChange={e => updateFloorRow(row.id, { sqft: Number(e.target.value) || 0 })}
                                        className="mt-1 border-2 border-black text-black font-black text-lg h-12 bg-white rounded-none"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-4 flex items-end h-full pb-2">
                                    <div className="px-4 py-2 bg-black text-white w-full border-black font-black uppercase text-center tracking-widest text-sm flex items-center justify-center gap-2">
                                        <span>Labor:</span>
                                        <span>{getRowMinutes(row).toFixed(1)} mins</span>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-1 flex items-end justify-center h-full pb-1">
                                    <button
                                        onClick={() => removeFloorRow(row.id)}
                                        className="p-3 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors border-2 border-transparent hover:border-red-200 rounded-none bg-white"
                                        title="Eliminar fila"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {floorList.length === 0 && (
                            <div className="text-center p-8 border-4 border-dashed border-slate-300">
                                <p className="text-slate-500 font-bold uppercase tracking-widest">No hay pisos agregados. Presiona '+ Add Floor Type' para comenzar.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* BASIC METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-white border-2 border-black rounded-xl shadow-sm">
                    <Label className="text-black font-bold uppercase tracking-widest text-lg">Cantidad de Escritorios</Label>
                    <Input
                        type="number" min="0" placeholder="Ej. 15"
                        value={state.site.desks || 0}
                        onChange={e => updateSite({ desks: Number(e.target.value) || 0 })}
                        className="bg-white border-2 border-black text-black text-xl font-black h-12 shadow-sm focus-visible:ring-black"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-black font-bold uppercase tracking-widest text-lg">Cantidad de Personas</Label>
                    <Input
                        type="number" min="0" placeholder="Ej. 20"
                        value={state.site.people || 0}
                        onChange={e => updateSite({ people: Number(e.target.value) || 0 })}
                        className="bg-white border-2 border-black text-black text-xl font-black h-12 shadow-sm focus-visible:ring-black"
                    />
                </div>



                <div className="space-y-3">
                    <Label className="text-black font-bold uppercase tracking-widest text-lg">Frecuencia Semanal</Label>
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                            <button
                                key={num}
                                onClick={() => updateSite({ cleaningFrequency: num })}
                                className={`w-12 h-12 rounded-full font-black text-xl transition-all ${state.site.cleaningFrequency === num
                                    ? 'bg-black text-white shadow-lg scale-105 border-2 border-black'
                                    : 'bg-white border-2 border-black text-black hover:bg-slate-200'
                                    }`}
                            >
                                {num}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
