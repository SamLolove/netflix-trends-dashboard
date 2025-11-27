// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import KPICard from '../components/KPICard'
import MapView from '../components/MapView'
import TopGenresChart from '../components/TopGenresChart'
import ReleasesChart from '../components/ReleasesChart'
import MediaTypePie from '../components/MediaTypePie'
import DataTable from '../components/DataTable'

import layout from '../styles/layout.module.css'
import card from '../styles/card.module.css'

const CSV_URL = '/netflix_titles.csv' // coloca el CSV en public/

export default function Dashboard(){
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ country:'All', type:'All', year:'All', genre:'All' })
  const [activeTab, setActiveTab] = useState('kpis')

  // Load CSV once
  useEffect(() => {
    let canceled = false
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        if (canceled) return
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            // normalize rows defensively
            const normalized = (res.data || []).map((r, i) => ({
              __id: i,
              show_id: r.show_id ?? i,
              type: r.type ?? 'Movie',
              title: r.title ?? 'Unknown',
              director: r.director ?? 'Unknown',
              country: (r.country || 'Unknown').split(',')[0].trim(),
              release_year: r.release_year ? Number(r.release_year) : null,
              rating: r.rating ?? '',
              listed_in: r.listed_in ?? '',
              date_added: r.date_added ?? ''
            }))
            setRawData(normalized)
            setLoading(false)
          },
          error: (err) => {
            console.error('CSV parse error', err)
            setLoading(false)
          }
        })
      })
      .catch(err => {
        console.error('CSV fetch error', err)
        setLoading(false)
      })

    return () => { canceled = true }
  }, [])

  // compute unique lists once from rawData (use clear variable names)
  const uniqueLists = useMemo(() => {
    const countriesSet = new Set(['All'])
    const typesSet = new Set(['All'])
    const yearsSet = new Set(['All'])
    const genresSet = new Set(['All'])

    // guard against rawData not array
    if (!Array.isArray(rawData)) return {
      countries: ['All'], types: ['All'], years: ['All'], genres: ['All']
    }

    for (const row of rawData) {
      if (row && row.country) countriesSet.add(row.country)
      if (row && row.type) typesSet.add(row.type)
      if (row && row.release_year) yearsSet.add(String(row.release_year))
      const listed = row?.listed_in || ''
      if (listed) {
        for (const g of listed.split(',').map(x => x.trim()).filter(Boolean)) {
          genresSet.add(g)
        }
      }
    }

    const countries = Array.from(countriesSet).sort()
    const types = Array.from(typesSet).sort()
    const years = Array.from(yearsSet).sort((a,b) => {
      if (a === 'All') return -1
      if (b === 'All') return 1
      // put numeric sort; unknown fallback last
      const na = Number(a) || 0
      const nb = Number(b) || 0
      return na - nb
    })
    const genres = Array.from(genresSet).sort()
    return { countries, types, years, genres }
  }, [rawData])

  // filtered rows
  const filtered = useMemo(() => {
    if (!Array.isArray(rawData)) return []
    return rawData.filter(r => {
      if (filters.country !== 'All' && r.country !== filters.country) return false
      if (filters.type !== 'All' && r.type !== filters.type) return false
      if (filters.year !== 'All' && String(r.release_year) !== String(filters.year)) return false
      if (filters.genre !== 'All' && !(r.listed_in || '').includes(filters.genre)) return false
      return true
    })
  }, [rawData, filters])

  // kpis
  const kpis = useMemo(() => {
    const total = filtered.length
    const movies = filtered.filter(x => x.type === 'Movie').length
    const tv = total - movies

    const genreCounts = {}
    for (const row of filtered) {
      const listed = row?.listed_in || ''
      for (const g of listed.split(',').map(x => x.trim()).filter(Boolean)) {
        genreCounts[g] = (genreCounts[g] || 0) + 1
      }
    }
    const topGenre = Object.entries(genreCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A'

    const countryCounts = {}
    for (const row of filtered) {
      const c = row?.country || 'Unknown'
      countryCounts[c] = (countryCounts[c] || 0) + 1
    }
    const topCountry = Object.entries(countryCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A'

    return { total, movies, tv, moviesPct: total ? Math.round(movies/total*100) : 0, topGenre, topCountry }
  }, [filtered])

  // leaders used by map tab
  const leaders = useMemo(() => {
    const cc = {}
    for (const r of rawData) {
      const c = r?.country || 'Unknown'
      cc[c] = (cc[c] || 0) + 1
    }
    const sorted = Object.entries(cc).sort((a,b)=>b[1]-a[1])
    return { top1: sorted[0]?.[0] || 'N/A', top2: sorted[1]?.[0] || 'N/A' }
  }, [rawData])

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar active={activeTab} setActive={setActiveTab} />

      <div style={{flex:1, marginLeft:230, padding:20}}>
        <Header filters={filters} onChange={setFilters} lists={uniqueLists} />

        {loading ? <div style={{padding:40}}>Cargando datos...</div> : (
          <>
            {activeTab === 'kpis' && (
              <>
                <div className={layout.kpiRow + ' fadeIn'}>
                  <KPICard title="Total titles" value={kpis.total} />
                  <KPICard title="% Movies" value={`${kpis.moviesPct}%`} />
                  <KPICard title="Top genre" value={kpis.topGenre} />
                  <KPICard title="Top country" value={kpis.topCountry} />
                </div>

                <div className={layout.grid + ' fadeIn'} style={{marginTop:12}}>
                  <ReleasesChart data={filtered} />
                  <TopGenresChart data={filtered} />
                  <MediaTypePie movies={kpis.movies} tv={kpis.tv} />
                </div>
              </>
            )}

            {activeTab === 'map' && (
              <>
                <h3 className="sectionTitle">Mapa Global</h3>
                <MapView data={filtered} />
                <div style={{display:'flex',gap:12,marginTop:12}}>
                  <div style={{padding:8,background:'#111',borderRadius:8}}>País con mayor catálogo: <strong style={{color:'#E50914'}}>{leaders.top1}</strong></div>
                  <div style={{padding:8,background:'#111',borderRadius:8}}>Segundo lugar: <strong style={{color:'#7f0000'}}>{leaders.top2}</strong></div>
                </div>
              </>
            )}

            {activeTab === 'table' && (
              <>
                <h3 className="sectionTitle">Concentrado</h3>
                <div className={layout.grid} style={{marginTop:8}}>
                  <ReleasesChart data={filtered} />
                  <TopGenresChart data={filtered} />
                  <MediaTypePie movies={kpis.movies} tv={kpis.tv} />
                </div>
                <div style={{marginTop:12}}>
                  <DataTable data={filtered} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
