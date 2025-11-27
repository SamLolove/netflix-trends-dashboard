import React, { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import s from '../styles/card.module.css'

export default function ReleasesChart({ data }){
  const byYear = useMemo(()=>{
    const years={}
    data.forEach(d=> { const y = d.release_year||'Unknown'; years[y]=(years[y]||0)+1 })
    return Object.entries(years).map(([year,count])=>({year:String(year),count})).sort((a,b)=> (Number(a.year)||0)-(Number(b.year)||0))
  },[data])
  return (
    <div className={s.card}>
      <h3>Evolución por año</h3>
      <div style={{height:300}}>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={byYear}>
            <defs>
              <linearGradient id="releasesGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#E50914" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#E50914" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="year" stroke="#b3b3b3" />
            <YAxis stroke="#b3b3b3" />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <Tooltip wrapperStyle={{background:'#111', border:'none'}} />
            <Area type="monotone" dataKey="count" stroke="#E50914" fill="url(#releasesGradient)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
