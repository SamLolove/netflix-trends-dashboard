import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts'
import s from '../styles/card.module.css'

export default function MediaTypePie({ movies, tv, data }){ 
  // accept either movies/tv numbers or data prop (backwards compat)
  let m = movies, t = tv
  if(!m && !t && data){
    m = data.filter(d=>d.type==='Movie').length
    t = data.filter(d=>d.type==='TV Show').length
  }
  const arr = [{name:'Movies', value: m || 0},{name:'TV Shows', value: t || 0}]
  const COLORS = ['#E50914', '#7f0000']
  return (
    <div className={s.card}>
      <h3>Movies vs TV Shows</h3>
      <div style={{height:220}}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie data={arr} dataKey='value' nameKey='name' outerRadius={70} label>
              {arr.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
            <Legend wrapperStyle={{color:'#b3b3b3'}} />
            <Tooltip wrapperStyle={{background:'#111', border:'none'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
