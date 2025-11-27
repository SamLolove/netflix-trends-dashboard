import React from 'react'
import s from '../styles/table.module.css'

export default function DataTable({ data }){
  return (
    <div className={s.card}>
      <h3>Tabla detallada</h3>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr><th>Title</th><th>Country</th><th>Year</th><th>Genre</th><th>Type</th></tr>
          </thead>
          <tbody>
            {data.slice(0,200).map(r=>(
              <tr key={r.__id}>
                <td>{r.title}</td>
                <td>{r.country}</td>
                <td>{r.release_year}</td>
                <td style={{maxWidth:300,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.listed_in}</td>
                <td>{r.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:12,color:'#b3b3b3',marginTop:8}}>Mostrando primeras 200 filas. Usa filtros para afinar la vista.</div>
    </div>
  )
}
