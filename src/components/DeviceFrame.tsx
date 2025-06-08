import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface Props {
    id: string;
    name: string;
    width: number;
    height: number;
    url: string;
    isLandscape?: boolean;
    onRotate?: () => void;
    onRemove?: () => void;
    fitToWidth?: boolean;
    zoom?: number;
    onZoomChange?: (zoom: number) => void;
    autoReload?: boolean;
}

const DeviceFrame: React.FC<Props> = ({
                                          name,
                                          width,
                                          height,
                                          url,
                                          isLandscape,
                                          onRotate,
                                          onRemove,
                                          fitToWidth,
                                          zoom: initialZoom = 1,
                                          autoReload,
                                      }) => {
    const w = isLandscape ? height : width;
    const h = isLandscape ? width : height;

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [reloadKey, setReloadKey] = useState(Date.now());
    const [zoom, setZoom] = useState(initialZoom);
    const frameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        setIsDarkMode(theme === 'dark');
    }, []);

    const finalUrl = isDarkMode ? `${url}?theme=dark` : url;

    const handleReload = () => {
        setReloadKey(Date.now());
    };


    const handleScreenshot = async () => {
        if (!frameRef.current) return;
        const canvas = await html2canvas(frameRef.current, { backgroundColor: null });
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const urlObj = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlObj;
            link.download = `${name}.png`;
            link.click();

            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob }) as unknown as ClipboardItem
                ]);
                toast.success('Screenshot copied to clipboard');
            } catch (err) {
                console.error('Clipboard copy failed', err);
            }

            setTimeout(() => URL.revokeObjectURL(urlObj), 100);
        });
    };

    useEffect(() => {
        if (autoReload) {
            setReloadKey(Date.now());
        }
    }, [url, isLandscape, autoReload]);


    const scaleStyle = fitToWidth
        ? {
            width: '100%',
            aspectRatio: `${w} / ${h}`,
        }
        : {
            width: `${w * zoom}px`,
            height: `${h * zoom}px`,
        };

    return (
        <div
            ref={frameRef}
            className="flex flex-col items-center p-4 border rounded-md shadow-md bg-white dark:bg-gray-800 text-black dark:text-white relative"
        >
            <div className="text-sm font-semibold mb-2">{name}</div>

            <div className="absolute top-2 right-2 flex gap-1">
                {onRotate && (
                    <button
                        onClick={onRotate}
                        title="Rotate"
                        className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600"
                    >
                        🔁
                    </button>
                )}
                {onRemove && (
                    <button
                        onClick={onRemove}
                        title="Remove"
                        className="text-xs bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700"
                    >
                        ❌
                    </button>
                )}
                <button
                    onClick={handleReload}
                    title="Reload"
                    className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
                >
                    🔄
                </button>
                <button
                    onClick={handleScreenshot}
                    title="Screenshot"
                    className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded hover:bg-purple-700"
                >
                    📸
                </button>
            </div>

            {!fitToWidth && (
                <div className="flex items-center gap-2 mb-2">
                    <label className="text-xs">Zoom:</label>
                    <select
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="text-xs px-1 py-0.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    >
                        <option value={0.5}>50%</option>
                        <option value={0.75}>75%</option>
                        <option value={1}>100%</option>
                        <option value={1.25}>125%</option>
                        <option value={1.5}>150%</option>
                    </select>
                </div>
            )}

            <div
                className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                style={{
                    ...scaleStyle,
                    overflow: 'hidden',
                }}
            >
                <iframe
                    key={reloadKey}
                    src={finalUrl}
                    width={w}
                    height={h}
                    style={{
                        border: 'none',
                        pointerEvents: 'auto',
                        width: '100%',
                        height: '100%',
                    }}
                    className="rounded"
                />
            </div>
        </div>
    );
};

export default DeviceFrame;
