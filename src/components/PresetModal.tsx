import React from 'react';
import { LayoutPreset } from '../types/devices';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    presets: LayoutPreset[];
    onLoad: (name: string) => void;
    onRename: (oldName: string) => void;
    onDelete: (name: string) => void;
    onExport: (preset: LayoutPreset) => void;
    onImportFile: (file: File) => void;

}

const PresetModal: React.FC<Props> = ({
                                          isOpen,
                                          onClose,
                                          presets,
                                          onLoad,
                                          onRename,
                                          onDelete,
                                          onExport,
                                          onImportFile,
                                      }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
                className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full p-6 shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-black dark:text-white">📁 Presets</h2>
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500"
                    >
                        ✖ Close
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {presets.map((p) => (
                        <div
                            key={p.name}
                            className="group relative border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 cursor-pointer hover:shadow"
                            onClick={() => onLoad(p.name)}
                        >
                            <div className="font-semibold text-sm text-black dark:text-white mb-2 truncate">
                                {p.name}
                            </div>

                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {p.devices.length} device{p.devices.length !== 1 ? 's' : ''} · {p.layout}
                            </div>

                            <div
                                className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRename(p.name);
                                    }}
                                    className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600"
                                >
                                    ✏
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(p.name);
                                    }}
                                    className="text-xs bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700"
                                >
                                    🗑
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onExport(p);
                                    }}
                                    className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
                                >
                                    ⬇
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) onImportFile(file);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="mt-6 border-2 border-dashed rounded px-4 py-4 text-sm text-center cursor-pointer bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-500 transition"
                >
                    <label className="cursor-pointer block">
                        ⬆ Drag & drop preset file here or{' '}
                        <span className="underline text-blue-600">click to upload</span>
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onImportFile(file);
                            }}
                        />
                    </label>
                </div>

            </div>
        </div>
    );
};

export default PresetModal;
