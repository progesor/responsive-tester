import React, { useState } from 'react';

interface Props {
    defaultZoom: number;
    onAddDevice: (device: { name: string; width: number; height: number }) => void;
}

const CustomDeviceForm: React.FC<Props> = ({ onAddDevice }) => {
    const [customName, setCustomName] = useState('');
    const [customWidth, setCustomWidth] = useState(0);
    const [customHeight, setCustomHeight] = useState(0);

    const handleSubmit = () => {
        if (!customName || customWidth < 100 || customHeight < 100) {
            alert('Please enter valid name and size (min 100px).');
            return;
        }

        onAddDevice({
            name: customName,
            width: customWidth,
            height: customHeight,
        });

        setCustomName('');
        setCustomWidth(0);
        setCustomHeight(0);
    };

    return (
        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
            <h3 className="text-md font-semibold mb-2 text-black dark:text-white">
                Create Custom Device
            </h3>
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col">
                    <label className="text-sm">Name</label>
                    <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="border px-2 py-1 rounded w-40 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                        placeholder="My Device"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm">Width (px)</label>
                    <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="border px-2 py-1 rounded w-32 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm">Height (px)</label>
                    <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="border px-2 py-1 rounded w-32 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    ➕ Add Device
                </button>
            </div>
        </div>
    );
};

export default CustomDeviceForm;
