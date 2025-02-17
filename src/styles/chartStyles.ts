import { cx } from '@/lib/utils';
import { getColorClassName } from '@/utils/chartUtils';

interface ChartStyle {
  gradient?: {
    from: string;
    to: string;
  };
  line?: {
    stroke: string;
    strokeWidth: number;
  };
  className: string;
}

interface DonutChartStyle {
  track?: {
    stroke: string;
    strokeWidth: number;
  };
  className: string;
}

interface BarChartStyle {
  bar?: {
    radius: number;
    gradient?: {
      from: string;
      to: string;
    };
  };
  className: string;
}

/**
 * Centralized chart styles using CSS variables and Tremor classes.
 * Organized by chart type with consistent styling patterns.
 */
export const chartStyles = {
  // Area Chart Styles
  areaChart: {
    gradient: {
      from: 'rgba(135, 250, 253, 0.15)',
      to: 'rgba(135, 250, 253, 0.01)',
    },
    line: {
      stroke: '#87fafd',
      strokeWidth: 2,
    },
    className: `
      [&_.tremor-AreaChart]:!w-full
      [&_.tremor-AreaChart]:!h-full
      [&_.tremor-AreaChart]:min-w-[300px]
      [&_.tremor-AreaChart]:min-h-[300px]
      [&_.tremor-AreaChart]:!overflow-visible
      [&_.tremor-AreaChart-path]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]
      [&_.tremor-Legend]:!mt-6 
      [&_.tremor-Legend]:!justify-start 
      [&_.tremor-Legend]:!overflow-x-auto 
      [&_.tremor-Legend-list]:!flex-wrap 
      [&_.tremor-Legend-list]:!gap-4 
      [&_.tremor-Legend]:antialiased 
      [&_text]:fill-white/70 
      [&_line]:stroke-white/5
      [&_line]:stroke-dasharray-2
      [&_.tremor-AreaChart-line]:!stroke-2
      [&_.tremor-AreaChart-area]:!opacity-40
      [&_.tremor-AreaChart-path]:!transition-all
      [&_.tremor-AreaChart-path]:hover:!opacity-100
      [&_.tremor-AreaChart-line]:hover:!stroke-[3px]
      [&_.tremor-AreaChart-dot]:!r-[3]
      [&_.tremor-AreaChart-dot]:!opacity-0
      [&_.tremor-AreaChart-dot]:!fill-current
      [&_.tremor-AreaChart-dot]:!transition-all
      [&_.tremor-AreaChart-dot]:hover:!r-[5]
      [&_.tremor-AreaChart-dot]:hover:!opacity-100
      [&_.tremor-AreaChart-dot]:focus:!r-[5]
      [&_.tremor-AreaChart-dot]:focus:!opacity-100
      [&_.tremor-AreaChart-dot]:focus:!outline-none
      [&_.tremor-AreaChart-dot]:focus:!ring-2
      [&_.tremor-AreaChart-dot]:focus:!ring-accent
      [&_.tremor-AreaChart-dot]:focus:!ring-offset-2
      [&_.tremor-AreaChart-dot][aria-selected=true]:!r-[5]
      [&_.tremor-AreaChart-dot][aria-selected=true]:!opacity-100
      [&_.tremor-Legend-item]:!px-3
      [&_.tremor-Legend-item]:!py-1.5
      [&_.tremor-Legend-item]:!rounded-lg
      [&_.tremor-Legend-item]:!bg-white/5
      [&_.tremor-Legend-item]:hover:!bg-white/10
      [&_.tremor-Legend-item]:!transition-colors
      [&_.tremor-Legend-item]:!cursor-pointer
      [&_.tremor-Legend-item]:focus:!outline-none
      [&_.tremor-Legend-item]:focus:!ring-2
      [&_.tremor-Legend-item]:focus:!ring-accent
      [&_.tremor-Legend-item_text]:!text-white/70
      [&_.tremor-Legend-item_rect]:!rx-[4px]
      [@media(max-width:768px)]:!text-sm
      [@media(max-width:640px)]:!text-xs
      [@media(prefers-reduced-motion:reduce)]:!transition-none
      [@media(prefers-reduced-motion:reduce)]:![&_*]:!transition-none
    `
      .replace(/\s+/g, ' ')
      .trim(),
  },

  // Bar Chart Styles
  barChart: {
    bar: {
      radius: 4,
      gradient: {
        from: 'rgba(135, 250, 253, 0.2)',
        to: 'rgba(135, 250, 253, 0.05)',
      },
    },
    className: `
      [&_.tremor-BarChart]:!w-full
      [&_.tremor-BarChart]:!h-full
      [&_.tremor-BarChart]:min-w-[300px]
      [&_.tremor-BarChart]:min-h-[300px]
      [&_.tremor-BarChart]:!overflow-visible
      [&_.tremor-BarChart-bar]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]
      [&_.tremor-Legend]:!mt-4 
      [&_.tremor-Legend]:!justify-start 
      [&_.tremor-Legend]:!overflow-x-auto 
      [&_.tremor-Legend-list]:!flex-wrap 
      [&_.tremor-Legend-list]:!gap-4 
      [&_.tremor-Legend]:antialiased 
      [&_text]:fill-white/70 
      [&_line]:stroke-white/5
      [&_.tremor-BarChart-bar]:!opacity-80
      [&_.tremor-BarChart-bar]:!transition-all
      [&_.tremor-BarChart-bar]:hover:!opacity-100
      [&_.tremor-BarChart-bar]:hover:!scale-x-[1.02]
      [&_.tremor-BarChart-bar]:hover:!stroke-white/10
      [&_.tremor-BarChart-bar]:hover:!stroke-[1px]
      [&_.tremor-BarChart-bar]:focus:!opacity-100
      [&_.tremor-BarChart-bar]:focus:!outline-none
      [&_.tremor-BarChart-bar]:focus:!ring-2
      [&_.tremor-BarChart-bar]:focus:!ring-accent
      [&_.tremor-BarChart-bar][aria-selected=true]:!opacity-100
      [&_.tremor-Legend-item]:!px-3
      [&_.tremor-Legend-item]:!py-1.5
      [&_.tremor-Legend-item]:!rounded-lg
      [&_.tremor-Legend-item]:!bg-white/5
      [&_.tremor-Legend-item]:hover:!bg-white/10
      [&_.tremor-Legend-item]:!transition-colors
      [&_.tremor-Legend-item]:!cursor-pointer
      [&_.tremor-Legend-item]:focus:!outline-none
      [&_.tremor-Legend-item]:focus:!ring-2
      [&_.tremor-Legend-item]:focus:!ring-accent
      [&_.tremor-Legend-item_text]:!text-white/70
      [&_.tremor-Legend-item_rect]:!rx-[4px]
      [@media(max-width:768px)]:!text-sm
      [@media(max-width:640px)]:!text-xs
      [@media(prefers-reduced-motion:reduce)]:!transition-none
      [@media(prefers-reduced-motion:reduce)]:![&_*]:!transition-none
    `
      .replace(/\s+/g, ' ')
      .trim(),
  },

  // Donut Chart Styles
  donutChart: {
    track: {
      stroke: 'rgba(255, 255, 255, 0.05)',
      strokeWidth: 2,
    },
    className: `
      [&_.tremor-DonutChart]:!w-full
      [&_.tremor-DonutChart]:!h-full
      [&_.tremor-DonutChart]:min-w-[300px]
      [&_.tremor-DonutChart]:min-h-[300px]
      [&_.tremor-DonutChart]:!overflow-visible
      [&_.tremor-DonutChart-slice]:drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]
      [&_.tremor-DonutChart-slice]:!opacity-80
      [&_.tremor-DonutChart-slice]:!transition-all
      [&_.tremor-DonutChart-slice]:hover:!opacity-100
      [&_.tremor-DonutChart-slice]:hover:!scale-105
      [&_.tremor-Legend]:!mt-4
      [&_.tremor-Legend]:!justify-start
      [&_.tremor-Legend]:!overflow-x-auto
      [&_.tremor-Legend-list]:!flex-wrap
      [&_.tremor-Legend-list]:!gap-4
      [&_.tremor-Legend]:antialiased
    `
      .replace(/\s+/g, ' ')
      .trim(),
  },
};
