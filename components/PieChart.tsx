import React from 'react';

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

const PieChart: React.FC<{ data: PieChartData[]; size?: number; }> = ({ data, size = 160 }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) return (
        <div className="flex items-center justify-center text-sm text-on-surface-variant" style={{height: `${size}px`, width: `${size}px`}}>
             <div className="h-full w-full rounded-full bg-surface-container-highest flex items-center justify-center">No Data</div>
        </div>
    );

    let cumulativePercent = 0;
    const segments = data.map(item => {
        const percent = item.value / total;
        const segment = {
            ...item,
            percent,
            startAngle: cumulativePercent * 360,
            endAngle: (cumulativePercent + percent) * 360
        };
        cumulativePercent += percent;
        return segment;
    });

    const getCoords = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="flex items-center justify-center gap-x-4">
            <svg viewBox="-1 -1 2 2" className="transform -rotate-90" style={{width: `${size}px`, height: `${size}px`}}>
                {segments.map(seg => {
                    if (seg.value <= 0) return null;
                    const [startX, startY] = getCoords(seg.startAngle / 360);
                    const [endX, endY] = getCoords(seg.endAngle / 360);
                    const largeArcFlag = seg.percent > 0.5 ? 1 : 0;
                    const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
                    return <path key={seg.label} d={pathData} fill={seg.color} />;
                })}
            </svg>
            <div className="space-y-2 text-sm">
                {data.map(item => (
                    item.value > 0 && <div key={item.label} className="flex items-center">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-on-surface-variant">{item.label}: <b className="text-on-surface">{((item.value / total) * 100).toFixed(1)}%</b></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;