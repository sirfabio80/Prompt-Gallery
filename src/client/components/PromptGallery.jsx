import React, { useState, useEffect } from 'react';
import { PromptGalleryService } from '../services/PromptGalleryServiceEnhanced.js';
import { display, value } from '../utils/fields.js';
import './PromptGallery.css';

export default function PromptGallery({ onSelectPrompt }) {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [service] = useState(() => new PromptGalleryService());
  
  const itemsPerPage = 9;

  const categories = [
    { value: 'discovery', label: 'Discovery' },
    { value: 'design', label: 'Design' },
    { value: 'solution_architecture', label: 'Solution Architecture' },
    { value: 'implementation', label: 'Implementation' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'communication', label: 'Communication / Email' },
    { value: 'demo_script', label: 'Demo Script' },
    { value: 'internal_productivity', label: 'Internal Productivity' }
  ];

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const allData = await service.getPrompts(filters);
      setTotalCount(allData.length);
      
      // Calculate pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = allData.slice(startIndex, endIndex);
      
      setPrompts(paginatedData);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const filters = {
      category: categoryFilter || undefined,
      search: searchText || undefined
    };
    setCurrentPage(1);
    await loadPrompts(1, filters);
  };

  const clearFilters = () => {
    setSearchText('');
    setCategoryFilter('');
    setCurrentPage(1);
    loadPrompts(1);
  };

  const handlePageChange = (page) => {
    const filters = {
      category: categoryFilter || undefined,
      search: searchText || undefined
    };
    loadPrompts(page, filters);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading) {
    return <div className="prompt-gallery-loading">Loading prompts...</div>;
  }

  if (error) {
    return (
      <div className="prompt-gallery-error">
        <p>Error loading prompts: {error}</p>
        <button onClick={loadPrompts}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="prompt-gallery">
      <div className="gallery-header">
        <h1>Prompt Gallery</h1>
        <p>Find and share high-quality AI prompts across teams</p>
      </div>

      <div className="gallery-filters">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          <button onClick={clearFilters} className="clear-button">
            Clear
          </button>
        </div>
      </div>

      <div className="gallery-stats">
        <span>{totalCount} prompts found</span>
        {totalPages > 1 && (
          <span className="page-info">
            {' '}• Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      <div className="prompts-grid">
        {prompts.map(prompt => (
          <PromptCard
            key={value(prompt.sys_id)}
            prompt={prompt}
            onClick={() => onSelectPrompt(value(prompt.sys_id))}
          />
        ))}
        
        {prompts.length === 0 && (
          <div className="no-prompts">
            <p>No prompts found matching your criteria</p>
            <button onClick={clearFilters}>Show All Prompts</button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

function PromptCard({ prompt, onClick }) {
  return (
    <div className="prompt-card" onClick={onClick}>
      <div className="card-header">
        <h3 className="prompt-name">{display(prompt.name)}</h3>
        <span className="prompt-category">{display(prompt.category) || prompt.category_display || prompt.category?.display_value}</span>
      </div>
      
      <div className="card-body">
        <p className="prompt-description">
          {display(prompt.short_description) || 'No description available'}
        </p>
        
        <div className="prompt-meta">
          <div className="meta-item">
            <span className="meta-label">Version:</span>
            <span className="meta-value">v{display(prompt.latest_version_number) || '1'}</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Usage:</span>
            <span className="meta-value">{display(prompt.total_usage_count) || '0'}</span>
          </div>
          
          {display(prompt.owner_team) && (
            <div className="meta-item">
              <span className="meta-label">Team:</span>
              <span className="meta-value">{display(prompt.owner_team)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <span className="view-details">Click to view details →</span>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis-start');
        start = currentPage - 1;
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination-container">
      <nav className="pagination-nav">
        <button 
          className="pagination-btn pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <span className="pagination-arrow">‹</span>
          <span className="pagination-text">Previous</span>
        </button>
        
        <div className="pagination-numbers">
          {visiblePages.map((page, index) => (
            page === 'ellipsis-start' || page === 'ellipsis-end' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">…</span>
            ) : (
              <button
                key={page}
                className={`pagination-btn pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button 
          className="pagination-btn pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span className="pagination-text">Next</span>
          <span className="pagination-arrow">›</span>
        </button>
      </nav>
    </div>
  );
}