import React from 'react';

interface Preset {
    name: string;
}

interface PresetManagerProps {
    presets: Preset[];
    onRename: (oldName: string) => void;
    onDelete: (name: string) => void;
    onExport: (preset: Preset) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
                                                         presets,
                                                         onRename,
                                                         onDelete,
                                                         onExport,
                                                     }) => {
    if (presets.length === 0) return null;

    return (
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <h2 className="text-md font-semibold mb-3 text-black dark:text-white">
                📁 Manage Presets
            </h2>
            <div className="space-y-2">
                {presets.map((p) => (
                    <div
                        key={p.name}
                        className="flex justify-between items-center bg-white dark:bg-gray-900 px-4 py-2 rounded border border-gray-300 dark:border-gray-600"
                    >
            <span className="truncate text-sm font-medium text-black dark:text-white">
              {p.name}
            </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onRename(p.name)}
                                className="text-xs bg-yellow-500 text-white px-2 rounded hover:bg-yellow-600"
                            >
                                ✏ Rename
                            </button>
                            <button
                                onClick={() => onDelete(p.name)}
                                className="text-xs bg-red-600 text-white px-2 rounded hover:bg-red-700"
                            >
                                🗑 Delete
                            </button>
                            <button
                                onClick={() => onExport(p)}
                                className="text-xs bg-blue-600 text-white px-2 rounded hover:bg-blue-700"
                            >
                                ⬇ Export
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PresetManager;
