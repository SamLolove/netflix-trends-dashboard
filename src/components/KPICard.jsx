import React from 'react'
import s from '../styles/card.module.css'

export default function KPICard({ title, value }){
  return (
    <div className={s.kpi}>
      <div className={s.title}>{title}</div>
      <div className={s.value}>{value}</div>
    </div>
  )
}
