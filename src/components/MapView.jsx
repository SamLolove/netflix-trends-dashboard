import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import s from '../styles/card.module.css'

export default function MapView({ data }){
  const [geo, setGeo] = useState(null)
  const GEO_URL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"

  useEffect(()=> {
    fetch(GEO_URL).then(r=>r.json()).then(setGeo).catch(()=>setGeo(null))
  },[])

  const counts = useMemo(()=>{
    const c={}
    data.forEach(d=> c[d.country] = (c[d.country]||0)+1)
    return c
  },[data])

  const [top1, top2] = useMemo(()=>{
    const arr = Object.entries(counts).sort((a,b)=>b[1]-a[1])
    return [arr[0]?.[0] || null, arr[1]?.[0] || null]
  },[counts])

  function getIntensityColor(value){
    if(!value) return '#111'
    if(value>200) return '#E50914'
    if(value>80) return '#7f0000'
    return '#2b0000'
  }

  function styleFeature(feature){
    const name = feature.properties.name
    const val = counts[name] || 0
    if(name === top1) return { fillColor:'#E50914', fillOpacity:0.85, color:'#000', weight:1 }
    if(name === top2) return { fillColor:'#7f0000', fillOpacity:0.85, color:'#000', weight:1 }
    return { fillColor: getIntensityColor(val), fillOpacity:0.55, color:'#000', weight:0.7 }
  }

  function onEachFeature(feature, layer){
    const name = feature.properties.name
    const val = counts[name] || 0
    layer.bindTooltip(`<b>${name}</b><br>${val} títulos`, { sticky: true })
  }

  return (
    <div className={s.card}>
      <h3>Mapa mundial</h3>
      <div style={{height:340}}>
        {geo ? (
          <MapContainer center={[20,0]} zoom={2} style={{height:'100%', width:'100%'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={geo} style={styleFeature} onEachFeature={onEachFeature} />
          </MapContainer>
        ) : <div style={{padding:20}}>Cargando mapa...</div>}
      </div>
    </div>
  )
}
