import React, { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import s from '../styles/card.module.css'

export default function TopGenresChart({ data }){
  const top = useMemo(()=>{
    const counts={}
    data.forEach(d=> (d.listed_in||'').split(',').map(g=>g.trim()).filter(Boolean).forEach(g=> counts[g]=(counts[g]||0)+1))
    return Object.entries(counts).map(([genre,value])=>({genre,value})).sort((a,b)=>b.value-a.value).slice(0,8)
  },[data])
  return (
    <div className={s.card}>
      <h3>Top géneros</h3>
      <div style={{height:300}}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={top} layout="vertical" margin={{left:20}}>
            <defs>
              <linearGradient id="genreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E50914" stopOpacity={0.85}/>
                <stop offset="100%" stopColor="#E50914" stopOpacity={0.12}/>
              </linearGradient>
            </defs>
            <XAxis type="number" stroke="#b3b3b3" />
            <YAxis type="category" dataKey="genre" width={120} stroke="#b3b3b3" />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <Tooltip wrapperStyle={{background:'#111', border:'none'}} />
            <Bar dataKey="value" stroke="#E50914" fill="url(#genreGradient)">
              {top.map((e,i)=> <Cell key={i} fill={i===0? '#E50914' : '#7f0000'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
