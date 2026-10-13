import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import type { Place } from '../lib/analyze'
import type { LatLon } from '../lib/types'

interface Props {
  places: Place[]
  routes: { from: LatLon; to: LatLon; km: number }[]
  labels: { home: string; work: string; visits: string }
}

function Fit({ pts }: { pts: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 13 })
  }, [map, pts])
  return null
}

export default function MapView({ places, routes, labels }: Props) {
  const css = getComputedStyle(document.documentElement)
  const c = (n: string) => css.getPropertyValue(`--${n}`).trim()
  const pts: [number, number][] = [...places.map((p) => [p.lat, p.lon] as [number, number]), ...routes.flatMap((r) => [[r.from.lat, r.from.lon], [r.to.lat, r.to.lon]] as [number, number][])]
  const maxV = Math.max(1, ...places.map((p) => p.visits))
  const center: [number, number] = pts[0] ?? [44, 18]
  return (
    <MapContainer center={center} zoom={9} scrollWheelZoom={false} style={{ height: 380, width: '100%' }} attributionControl>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Fit pts={pts} />
      {routes.map((r, i) => (
        <Polyline key={i} positions={[[r.from.lat, r.from.lon], [r.to.lat, r.to.lon]]} pathOptions={{ color: c('gold'), weight: 2, opacity: 0.35 }} />
      ))}
      {places.map((p) => {
        const color = p.role === 'home' ? c('save') : p.role === 'work' ? c('el') : c('dist')
        return (
          <CircleMarker key={p.id} center={[p.lat, p.lon]} radius={6 + 14 * Math.sqrt(p.visits / maxV)} pathOptions={{ color: '#fff', weight: 2, fillColor: color, fillOpacity: 0.85 }}>
            <Tooltip direction="top">
              <b>{p.role === 'home' ? labels.home : p.role === 'work' ? labels.work : `#${p.id + 1}`}</b> · {p.visits} {labels.visits}
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
