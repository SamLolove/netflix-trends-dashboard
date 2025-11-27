import React from 'react'
import s from '../styles/sidebar.module.css'

export default function Sidebar({ active, setActive }){
  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div className={s.logo}>N</div>
        <div>
          <div className={s.title}>Netflix</div>
          <div className={s.small}>Trends</div>
        </div>
      </div>

      <nav className={s.menu}>
        <button className={`${s.item} ${active==='kpis' ? s.active : ''}`} onClick={()=>setActive('kpis')}>KPIs</button>
        <button className={`${s.item} ${active==='map' ? s.active : ''}`} onClick={()=>setActive('map')}>Mapa Global</button>
        <button className={`${s.item} ${active==='table' ? s.active : ''}`} onClick={()=>setActive('table')}>Concentrado</button>
      </nav>

      <div style={{marginTop:'auto', color:'#b3b3b3', fontSize:12}}>versión: 1.0 • tema: Netflix</div>
    </aside>
  )
}
