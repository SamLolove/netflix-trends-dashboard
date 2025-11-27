import React from 'react'
import s from '../styles/header.module.css'

export default function Header({ filters, onChange, lists }){
  function update(key, value){
    onChange(prev => ({ ...prev, [key]: value }))
  }

  return (
    <header className={s.header}>
      <div>
        <h1 className="h1">Netflix Trends</h1>
        <div className={s.subtitle}>Country • Genre • Year</div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:8}} className={s.controls}>
        <select value={filters.country} onChange={e=>update('country', e.target.value)}>
          {lists.countries.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.type} onChange={e=>update('type', e.target.value)}>
          {lists.types.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.year} onChange={e=>update('year', e.target.value)}>
          {lists.years.map(y=> <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filters.genre} onChange={e=>update('genre', e.target.value)}>
          {lists.genres.map(g=> <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
    </header>
  )
}
