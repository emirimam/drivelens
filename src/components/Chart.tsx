import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, HeatmapChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, MarkLineComponent, PolarComponent, TitleComponent, TooltipComponent, VisualMapComponent, AriaComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import type { EChartsCoreOption } from 'echarts/core'

echarts.use([BarChart, GaugeChart, HeatmapChart, LineChart, PieChart, GridComponent, LegendComponent, MarkLineComponent, PolarComponent, TitleComponent, TooltipComponent, VisualMapComponent, AriaComponent, SVGRenderer])

interface Props {
  option: EChartsCoreOption
  height?: number
  className?: string
  onClick?: (p: { dataIndex: number; seriesIndex?: number; name?: string }) => void
  label?: string
}

export function Chart({ option, height = 260, className, onClick, label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inst = useRef<echarts.ECharts | null>(null)
  const clickRef = useRef(onClick)
  clickRef.current = onClick

  useEffect(() => {
    if (!ref.current) return
    const c = echarts.init(ref.current, undefined, { renderer: 'svg' })
    inst.current = c
    c.on('click', (p) => clickRef.current?.(p as never))
    const ro = new ResizeObserver(() => c.resize())
    ro.observe(ref.current)
    return () => {
      ro.disconnect()
      c.dispose()
      inst.current = null
    }
  }, [])

  useEffect(() => {
    inst.current?.setOption(option, { notMerge: true })
  }, [option])

  return <div ref={ref} role="img" aria-label={label} className={className} style={{ height, width: '100%' }} />
}
