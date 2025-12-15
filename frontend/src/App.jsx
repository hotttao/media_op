import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CreatorProductAnalysis from './components/CreatorProductAnalysis'
import ProductVideoAnalysis from './components/ProductVideoAnalysis'
import ProductMatrix from './components/ProductMatrix'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>MediaOp 数据分析系统</h1>
            <nav className="main-nav">
              <Link to="/creator-product" className="nav-link">
                达人商品分析
              </Link>
              <Link to="/product-video" className="nav-link">
                商品视频分析
              </Link>
              <Link to="/product-matrix" className="nav-link">
                商品矩阵分析
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/creator-product" element={<CreatorProductAnalysis />} />
            <Route path="/product-video" element={<ProductVideoAnalysis />} />
            <Route path="/product-matrix" element={<ProductMatrix />} />
            <Route path="/" element={<CreatorProductAnalysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App