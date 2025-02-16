interface ChartStyle {
  gradient: {
    from: string;
    to: string;
  };
  line: {
    stroke: string;
    strokeWidth: number;
  };
  className: string;
}

interface DonutChartStyle {
  track: {
    stroke: string;
    strokeWidth: number;
  };
  className: string;
}

interface BarChartStyle {
  bar: {
    radius: number;
    gradient: {
      from: string;
      to: string;
    };
  };
  className: string;
}

export const chartStyles = {
  areaChart: {
    gradient: { from: 'rgba(135, 250, 253, 0.15)', to: 'rgba(135, 250, 253, 0.01)' },
    line: { stroke: '#87fafd', strokeWidth: 2 },
    className: `
      [&_.tremor-AreaChart-path]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]
      [&_.tremor-Legend]:!mt-6 
      [&_.tremor-Legend]:!justify-start 
      [&_.tremor-Legend]:!overflow-x-auto 
      [&_.tremor-Legend-list]:!flex-wrap 
      [&_.tremor-Legend-list]:!gap-4 
      [&_.tremor-Legend]:antialiased 
      [&_text]:fill-white/70 
      [&_line]:stroke-white/5
      [&_.tremor-AreaChart]:!h-[300px]
      [&_.tremor-AreaChart-line]:!stroke-2
      [&_.tremor-AreaChart-area]:!opacity-80
      [&_.tremor-AreaChart-path]:!transition-all
      [&_.tremor-AreaChart-path]:hover:!opacity-100
      [&_.tremor-AreaChart-line]:hover:!stroke-[3px]
      [&_.tremor-AreaChart-dot]:!r-[3]
      [&_.tremor-AreaChart-dot]:!opacity-0
      [&_.tremor-AreaChart-dot]:!fill-current
      [&_.tremor-AreaChart-dot]:!transition-all
      [&_.tremor-AreaChart-dot]:hover:!r-[5]
      [&_.tremor-AreaChart-dot]:hover:!opacity-100
      [&_.tremor-AreaChart]:!overflow-visible
      [&_.tremor-AreaChart-grid]:!stroke-white/5
      [&_.tremor-AreaChart-gridLine]:!stroke-dasharray-2
    `.replace(/\s+/g, ' ').trim()
  } as ChartStyle,
  barChart: {
    bar: {
      radius: 4,
      gradient: {
        from: 'rgba(135, 250, 253, 0.2)',
        to: 'rgba(135, 250, 253, 0.05)',
      }
    },
    className: `
      [&_.tremor-BarChart-bar]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]
      [&_.tremor-Legend]:!mt-4 
      [&_.tremor-Legend]:!justify-start 
      [&_.tremor-Legend]:!overflow-x-auto 
      [&_.tremor-Legend-list]:!flex-wrap 
      [&_.tremor-Legend-list]:!gap-4
    `.replace(/\s+/g, ' ').trim()
  } as BarChartStyle,
  donutChart: {
    track: { stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 2 },
    className: '[&_.tremor-DonutChart-slice]:drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]'
  } as DonutChartStyle
}; 