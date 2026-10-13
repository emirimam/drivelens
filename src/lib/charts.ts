import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import type { Analysis } from './analyze'

export type Palette = Record<'t1' | 't2' | 't3' | 'line' | 'card' | 'card2' | 'gold' | 'gold2' | 'el' | 'el2' | 'fuel' | 'fuel2' | 'save' | 'dist' | 'bad' | 'warn', string>

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement)
  const g = (n: string) => cs.getPropertyValue(`--${n}`).trim()
  return { t1: g('t1'), t2: g('t2'), t3: g('t3'), line: g('line'), card: g('card'), card2: g('card2'), gold: g('gold'), gold2: g('gold2'), el: g('el'), el2: g('el2'), fuel: g('fuel'), fuel2: g('fuel2'), save: g('save'), dist: g('dist'), bad: g('bad'), warn: g('warn') }
}

const grad = (a: string, b: string, vertical = false) =>
  new echarts.graphic.LinearGradient(0, vertical ? 1 : 0, vertical ? 0 : 1, 0, [
    { offset: 0, color: a },
    { offset: 1, color: b },
  ])

const tooltip = (p: Palette) => ({
  backgroundColor: p.card,
  borderColor: p.line,
  borderWidth: 1,
  padding: [8, 12],
  textStyle: { color: p.t1, fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
  extraCssText: 'border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18)',
})

const axisBase = (p: Palette) => ({
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: p.t3, fontSize: 11, fontFamily: 'Plus Jakarta Sans' },
  splitLine: { lineStyle: { color: p.line, type: 'dashed' as const } },
})

export interface GaugeSpec {
  value: number
  max: number
  min?: number
  unit: string
  decimals?: number
  colors: [string, string]
  /** optional marker on the scale (e.g. reference value) */
  marker?: number
}

export function gaugeOption(p: Palette, g: GaugeSpec, fmt: (v: number, d?: number) => string): EChartsCoreOption {
  const min = g.min ?? 0
  const v = Math.min(g.max, Math.max(min, g.value))
  const series: unknown[] = [
    {
      type: 'gauge',
      startAngle: 215,
      endAngle: -35,
      min,
      max: g.max,
      radius: '86%',
      center: ['50%', '55%'],
      splitNumber: 5,
      progress: { show: true, width: 16, roundCap: true, itemStyle: { color: grad(g.colors[0], g.colors[1]), shadowBlur: 18, shadowColor: g.colors[1] + '66' } },
      axisLine: { roundCap: true, lineStyle: { width: 16, color: [[1, p.card2]] } },
      pointer: { show: true, icon: 'circle', length: 9, width: 9, offsetCenter: [0, '-74%'], itemStyle: { color: p.card, borderColor: g.colors[1], borderWidth: 3 } },
      anchor: { show: false },
      axisTick: { distance: 6, length: 3, splitNumber: 4, lineStyle: { color: p.t3, width: 1, opacity: 0.45 } },
      splitLine: { distance: 6, length: 7, lineStyle: { color: p.t3, width: 1.5, opacity: 0.6 } },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '8%'],
        formatter: () => `{v|${fmt(g.value, g.decimals ?? 0)}}\n{u|${g.unit}}`,
        rich: {
          v: { fontSize: 30, fontWeight: 800, color: p.t1, fontFamily: 'Sora', lineHeight: 36 },
          u: { fontSize: 12, color: p.t2, fontFamily: 'Plus Jakarta Sans', lineHeight: 16 },
        },
      },
      data: [{ value: v }],
      animationDuration: 1400,
      animationEasing: 'cubicOut',
    },
  ]
  if (g.marker !== undefined) {
    series.push({
      type: 'gauge', startAngle: 215, endAngle: -35, min, max: g.max, radius: '86%', center: ['50%', '55%'],
      axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, progress: { show: false }, detail: { show: false }, title: { show: false },
      pointer: { show: true, icon: 'rect', length: 22, width: 3, offsetCenter: [0, '-66%'], itemStyle: { color: p.bad } },
      data: [{ value: Math.min(g.max, g.marker) }],
    })
  }
  return { series }
}

export function monthlyOption(p: Palette, a: Analysis, labels: string[], names: { el: string; fuel: string; gap: string; excluded: string }, fmt: (v: number) => string): EChartsCoreOption {
  const ex = a.months.map((m) => m.excluded)
  const item = (v: number, i: number, color: unknown) => ({ value: Math.round(v), itemStyle: { color, opacity: ex[i] ? 0.22 : 1 } })
  const hasEl = a.powertrain !== 'ice'
  const series: unknown[] = []
  if (hasEl) series.push({ name: names.el, type: 'bar', stack: 'k', barMaxWidth: 34, itemStyle: { color: p.el }, data: a.months.map((m, i) => item(m.elKm, i, grad(p.el, p.el2, true))) })
  if (a.powertrain !== 'ev') series.push({ name: names.fuel, type: 'bar', stack: 'k', barMaxWidth: 34, itemStyle: { color: p.fuel }, data: a.months.map((m, i) => item(m.fuelKm, i, grad(p.fuel, p.fuel2, true))) })
  series.push({
    name: names.gap, type: 'bar', stack: 'k', barMaxWidth: 34, itemStyle: { color: p.bad + '55' },
    data: a.months.map((m, i) => ({ value: m.gapKm >= 30 ? Math.round(m.gapKm) : '-', itemStyle: { color: p.bad + '30', borderColor: p.bad, borderWidth: 1, borderType: 'dashed', opacity: ex[i] ? 0.25 : 1, borderRadius: [8, 8, 0, 0] }, decal: { symbol: 'rect', dashArrayX: [1, 0], dashArrayY: [3, 5], rotation: -0.8, color: p.bad + '55' } })),
  })
  // round the top-most visible segment
  ;(series as { data: { value: number; itemStyle: Record<string, unknown> }[] }[]).forEach((s, si, arr) => {
    s.data.forEach((d, i) => {
      const above = arr.slice(si + 1).some((o) => Number(o.data[i].value) > 0)
      if (!above) d.itemStyle.borderRadius = [8, 8, 0, 0]
    })
  })
  return {
    aria: { enabled: true },
    tooltip: {
      ...tooltip(p), trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: p.line + '55' } },
      formatter: (ps: { axisValue: string; seriesName: string; value: number; color: unknown; dataIndex: number }[]) => {
        const i = ps[0].dataIndex
        const head = `<b>${ps[0].axisValue}</b>${ex[i] ? ` · <i>${names.excluded}</i>` : ''}`
        return head + ps.filter((x) => Number(x.value) > 0).map((x) => `<br/>${x.seriesName}: <b>${fmt(x.value)} km</b>`).join('')
      },
    },
    legend: { bottom: 0, icon: 'roundRect', itemWidth: 10, itemHeight: 10, textStyle: { color: p.t2 } },
    grid: { left: 8, right: 8, top: 16, bottom: 34, containLabel: true },
    xAxis: { type: 'category', data: labels, ...axisBase(p), splitLine: { show: false } },
    yAxis: { type: 'value', ...axisBase(p) },
    series,
  }
}

export function costOption(p: Palette, a: Analysis, labels: string[], cur: string, fmt: (v: number) => string): EChartsCoreOption {
  const vals = a.months.map((m) => Math.round(m.fuelCost))
  const max = Math.max(...a.months.filter((m) => !m.excluded).map((m) => m.fuelCost))
  return {
    tooltip: { ...tooltip(p), trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: p.line + '55' } }, valueFormatter: (v: number) => `${fmt(v)} ${cur}` },
    grid: { left: 8, right: 8, top: 26, bottom: 8, containLabel: true },
    xAxis: { type: 'category', data: labels, ...axisBase(p), splitLine: { show: false } },
    yAxis: { type: 'value', ...axisBase(p) },
    series: [{
      type: 'bar', barMaxWidth: 30,
      data: a.months.map((m, i) => ({
        value: vals[i],
        itemStyle: { borderRadius: [8, 8, 0, 0], color: m.fuelCost === max ? grad(p.fuel, p.fuel2, true) : p.fuel + '66', opacity: m.excluded ? 0.25 : 1 },
        label: m.fuelCost === max ? { show: true, position: 'top', color: p.t1, fontWeight: 700, formatter: `${fmt(vals[i])} ${cur}` } : undefined,
      })),
    }],
  }
}

export function priceOption(p: Palette, pts: { date: string; price: number }[], cur: string, fmt: (v: number, d?: number) => string, fmtDate: (d: Date) => string): EChartsCoreOption {
  return {
    tooltip: { ...tooltip(p), trigger: 'axis', valueFormatter: (v: number) => `${fmt(v, 2)} ${cur}` },
    grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
    xAxis: { type: 'time', ...axisBase(p), splitLine: { show: false }, splitNumber: 5, axisLabel: { color: p.t3, fontSize: 11, hideOverlap: true, formatter: (v: number) => fmtDate(new Date(v)) } },
    yAxis: { type: 'value', scale: true, ...axisBase(p), axisLabel: { color: p.t3, fontSize: 11, formatter: (v: number) => fmt(v, 2) } },
    series: [{
      type: 'line', smooth: 0.3, symbol: 'circle', symbolSize: 7, showSymbol: true,
      lineStyle: { width: 3, color: grad(p.fuel2, p.fuel) }, itemStyle: { color: p.fuel, borderColor: p.card, borderWidth: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: p.fuel + '55' }, { offset: 1, color: p.fuel + '00' }]) },
      data: pts.map((x) => [new Date(x.date + 'T12:00:00').getTime(), x.price]),
    }],
  }
}

export function donutOption(p: Palette, el: number, fuel: number, names: { el: string; fuel: string }, center: string, sub: string, fmt: (v: number) => string): EChartsCoreOption {
  return {
    tooltip: { ...tooltip(p), trigger: 'item', valueFormatter: (v: number) => `${fmt(v)} km` },
    title: { text: center, subtext: sub, left: 'center', top: '38%', textStyle: { color: p.t1, fontSize: 28, fontWeight: 800, fontFamily: 'Sora' }, subtextStyle: { color: p.t2, fontSize: 12 } },
    series: [{
      type: 'pie', radius: ['64%', '84%'], padAngle: 3, itemStyle: { borderRadius: 10 }, label: { show: false },
      data: [
        { name: names.el, value: Math.round(el), itemStyle: { color: grad(p.el2, p.el) } },
        { name: names.fuel, value: Math.round(fuel), itemStyle: { color: grad(p.fuel2, p.fuel) } },
      ],
    }],
  }
}

export function heatOption(p: Palette, heat: number[][], weekdays: string[], label: string): EChartsCoreOption {
  const data: [number, number, number][] = []
  heat.forEach((row, d) => row.forEach((v, h) => data.push([h, d, v])))
  const max = Math.max(1, ...data.map((x) => x[2]))
  return {
    tooltip: { ...tooltip(p), formatter: (x: { value: [number, number, number] }) => `${weekdays[x.value[1]]} ${String(x.value[0]).padStart(2, '0')}:00<br/><b>${x.value[2]}</b> ${label}` },
    grid: { left: 4, right: 4, top: 4, bottom: 4, containLabel: true },
    xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')), ...axisBase(p), splitLine: { show: false }, axisLabel: { color: p.t3, fontSize: 10, interval: 2 } },
    yAxis: { type: 'category', data: weekdays, inverse: true, ...axisBase(p), splitLine: { show: false } },
    visualMap: { show: false, min: 0, max, inRange: { color: [p.card2, p.gold2, p.gold, p.fuel] } },
    series: [{ type: 'heatmap', data, itemStyle: { borderColor: p.card, borderWidth: 2, borderRadius: 4 }, emphasis: { itemStyle: { borderColor: p.t1, borderWidth: 1 } } }],
  }
}

export function histOption(p: Palette, hist: { label: string; count: number }[], label: string): EChartsCoreOption {
  const max = Math.max(...hist.map((h) => h.count))
  return {
    tooltip: { ...tooltip(p), trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: p.line + '55' } }, valueFormatter: (v: number) => `${v} ${label}` },
    grid: { left: 8, right: 8, top: 24, bottom: 8, containLabel: true },
    xAxis: { type: 'category', data: hist.map((h) => h.label + ' km'), ...axisBase(p), splitLine: { show: false } },
    yAxis: { type: 'value', ...axisBase(p) },
    series: [{ type: 'bar', barMaxWidth: 40, data: hist.map((h) => ({ value: h.count, itemStyle: { borderRadius: [8, 8, 0, 0], color: h.count === max ? grad(p.dist, p.el2, true) : p.dist + '55' }, label: h.count === max ? { show: true, position: 'top', color: p.t1, fontWeight: 700 } : undefined })) }],
  }
}

export function weekdayOption(p: Palette, km: number[], weekdays: string[], fmt: (v: number) => string): EChartsCoreOption {
  const max = Math.max(...km)
  return {
    tooltip: { ...tooltip(p), valueFormatter: (v: number) => `${fmt(v)} km` },
    angleAxis: { type: 'category', data: weekdays, axisLine: { lineStyle: { color: p.line } }, axisLabel: { color: p.t2, fontWeight: 600 }, axisTick: { show: false } },
    radiusAxis: { axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: p.line, type: 'dashed' } } },
    polar: { radius: ['14%', '82%'] },
    series: [{ type: 'bar', coordinateSystem: 'polar', roundCap: true, data: km.map((v) => ({ value: Math.round(v), itemStyle: { color: v === max ? grad(p.gold, p.fuel) : p.gold + '77' } })) }],
  }
}

export function odoOption(p: Palette, series: { odo: [number, number][]; logged: [number, number][] }, names: { odo: string; logged: string }, fmt: (v: number) => string, fmtMonth: (d: Date) => string): EChartsCoreOption {
  return {
    tooltip: { ...tooltip(p), trigger: 'axis', valueFormatter: (v: number) => `${fmt(v)} km` },
    legend: { bottom: 0, icon: 'roundRect', itemWidth: 10, itemHeight: 10, textStyle: { color: p.t2 } },
    grid: { left: 8, right: 16, top: 16, bottom: 34, containLabel: true },
    xAxis: { type: 'time', ...axisBase(p), splitLine: { show: false }, splitNumber: 5, axisLabel: { color: p.t3, fontSize: 11, hideOverlap: true, formatter: (v: number) => fmtMonth(new Date(v)) } },
    yAxis: { type: 'value', ...axisBase(p), axisLabel: { color: p.t3, fontSize: 11, formatter: (v: number) => fmt(v / 1000) + 'k' } },
    series: [
      { name: names.odo, type: 'line', step: 'end', symbol: 'none', itemStyle: { color: p.dist }, lineStyle: { width: 2.5, color: p.dist }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: p.dist + '44' }, { offset: 1, color: p.dist + '00' }]) }, data: series.odo },
      { name: names.logged, type: 'line', step: 'end', symbol: 'none', itemStyle: { color: p.gold }, lineStyle: { width: 2.5, color: p.gold }, data: series.logged },
    ],
  }
}
