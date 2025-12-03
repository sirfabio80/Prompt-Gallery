import React, { useState, useEffect } from 'react';
import { PromptGalleryService } from '../services/PromptGalleryServiceEnhanced.js';
import { display, value } from '../utils/fields.js';
import './PromptDetail.css';

export default function PromptDetail({ promptId, onBack, onEdit }) {
  const [prompt, setPrompt] = useState(null);
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [tags, setTags] = useState([]);
  const [usage, setUsage] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [service] = useState(() => new PromptGalleryService());

  useEffect(() => {
    if (promptId) {
      loadPromptDetails();
    }
  }, [promptId]);

  const loadPromptDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [promptData, versionsData, tagsData, engagementsData] = await Promise.all([
        service.getPrompt(promptId),
        service.getPromptVersions(promptId),
        service.getPromptTags(promptId),
        service.getEngagements()
      ]);
      
      setPrompt(promptData);
      setVersions(versionsData);
      setTags(tagsData);
      setEngagements(engagementsData);
      
      // Set current version to latest or recommended
      const recommended = versionsData.find(v => display(v.status) === 'recommended');
      const latest = versionsData[versionsData.length - 1];
      setCurrentVersion(recommended || latest);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to load prompt details:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVersionUsage = async (versionId) => {
    try {
      const usageData = await service.getVersionUsage(versionId);
      setUsage(usageData);
    } catch (err) {
      console.error('Failed to load usage:', err);
    }
  };

  useEffect(() => {
    if (currentVersion) {
      loadVersionUsage(value(currentVersion.sys_id));
    }
  }, [currentVersion]);

  const copyPromptToClipboard = async () => {
    const role = display(currentVersion.role_instructions);
    const body = display(currentVersion.prompt_body);
    const textToCopy = role ? `${role}\n\n${body}` : body;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert('Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy prompt. Please copy manually.');
    }
  };

  const submitRating = async (rating) => {
    try {
      await service.rateVersion(value(currentVersion.sys_id), rating);
      // Reload version to get updated rating
      const updatedVersions = await service.getPromptVersions(promptId);
      setVersions(updatedVersions);
      const updated = updatedVersions.find(v => value(v.sys_id) === value(currentVersion.sys_id));
      setCurrentVersion(updated);
      alert('Rating submitted successfully!');
    } catch (err) {
      alert('Failed to submit rating: ' + err.message);
    }
  };

  const markAsUsed = async (engagement = null, context = '') => {
    try {
      const usageData = {
        context_description: context,
        tool_used: display(currentVersion.target_tool)
      };
      if (engagement) {
        usageData.engagement = engagement;
      }
      
      await service.markAsUsed(value(currentVersion.sys_id), usageData);
      
      // Reload version and usage
      const updatedVersions = await service.getPromptVersions(promptId);
      setVersions(updatedVersions);
      const updated = updatedVersions.find(v => value(v.sys_id) === value(currentVersion.sys_id));
      setCurrentVersion(updated);
      loadVersionUsage(value(currentVersion.sys_id));
      
      alert('Usage recorded successfully!');
    } catch (err) {
      alert('Failed to record usage: ' + err.message);
    }
  };

  if (loading) {
    return <div className="prompt-detail-loading">Loading prompt details...</div>;
  }

  if (error) {
    return (
      <div className="prompt-detail-error">
        <p>Error loading prompt: {error}</p>
        <button onClick={onBack}>Back to Gallery</button>
      </div>
    );
  }

  if (!prompt || !currentVersion) {
    return (
      <div className="prompt-detail-error">
        <p>Prompt not found</p>
        <button onClick={onBack}>Back to Gallery</button>
      </div>
    );
  }

  const averageRating = currentVersion.rating_count?.value > 0 
    ? (parseFloat(currentVersion.rating_sum.value) / parseFloat(currentVersion.rating_count.value)).toFixed(1)
    : 'No ratings';

  return (
    <div className="prompt-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">← Back to Gallery</button>
        <div className="header-actions">
          <button onClick={() => onEdit(promptId)} className="edit-button">Edit Prompt</button>
        </div>
      </div>

      <div className="prompt-info">
        <div className="prompt-header">
          <h1>{display(prompt.name)}</h1>
          <span className="category-badge">{display(prompt.category) || prompt.category_display || prompt.category?.display_value}</span>
        </div>
        
        <p className="prompt-description">{display(prompt.short_description)}</p>
        
        {display(prompt.owner_team) && (
          <p className="owner-team">Owner Team: {display(prompt.owner_team)}</p>
        )}
        
        {tags.length > 0 && (
          <div className="tags-section">
            <span className="tags-label">Tags:</span>
            <div className="tags-list">
              {tags.map(tagRel => (
                <span key={value(tagRel.sys_id)} className="tag">
                  {display(tagRel.tag)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="versions-section">
        <h2>Versions</h2>
        
        <div className="version-tabs">
          {versions.map(version => (
            <button
              key={value(version.sys_id)}
              onClick={() => setCurrentVersion(version)}
              className={`version-tab ${value(version.sys_id) === value(currentVersion.sys_id) ? 'active' : ''}`}
            >
              v{display(version.version_number)}
              {display(version.status) === 'recommended' && <span className="recommended-badge">★</span>}
            </button>
          ))}
        </div>

        <div className="version-content">
          <div className="version-meta">
            <div className="meta-grid">
              <div className="meta-item">
                <span className="meta-label">Status:</span>
                <span className={`status-badge status-${display(currentVersion.status)}`}>
                  {display(currentVersion.status)}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Target Tool:</span>
                <span>{display(currentVersion.target_tool) || 'General'}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Language:</span>
                <span>{display(currentVersion.language) || 'en'}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Rating:</span>
                <span>{averageRating} ({display(currentVersion.rating_count)} reviews)</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Usage Count:</span>
                <span>{display(currentVersion.usage_count) || '0'}</span>
              </div>
            </div>
          </div>

          <div className="version-text">
            {display(currentVersion.role_instructions) && (
              <div className="text-section">
                <h3>Role / Instructions</h3>
                <div className="text-content">
                  {display(currentVersion.role_instructions)}
                </div>
              </div>
            )}
            
            <div className="text-section">
              <h3>Prompt Body</h3>
              <div className="text-content main-prompt">
                {display(currentVersion.prompt_body)}
              </div>
            </div>
            
            {display(currentVersion.example_input) && (
              <div className="text-section">
                <h3>Example Input</h3>
                <div className="text-content example">
                  {display(currentVersion.example_input)}
                </div>
              </div>
            )}
            
            {display(currentVersion.example_output) && (
              <div className="text-section">
                <h3>Example Output</h3>
                <div className="text-content example">
                  {display(currentVersion.example_output)}
                </div>
              </div>
            )}
          </div>

          <div className="version-actions">
            <button onClick={copyPromptToClipboard} className="copy-button">
              📋 Copy Prompt
            </button>
            
            <RatingControl onRate={submitRating} />
            
            <MarkUsedControl 
              engagements={engagements}
              onMarkUsed={markAsUsed}
            />
          </div>

          {usage.length > 0 && (
            <div className="usage-section">
              <h3>Recent Usage</h3>
              <div className="usage-list">
                {usage.map(u => (
                  <div key={value(u.sys_id)} className="usage-item">
                    <span className="usage-user">{display(u.used_by)}</span>
                    <span className="usage-date">{display(u.used_at)}</span>
                    {display(u.engagement) && (
                      <span className="usage-engagement">({display(u.engagement)})</span>
                    )}
                    {display(u.context_description) && (
                      <span className="usage-context"> - {display(u.context_description)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingControl({ onRate }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const submitRating = () => {
    if (selectedRating > 0) {
      onRate(selectedRating);
      setShowRating(false);
      setSelectedRating(0);
    }
  };

  if (!showRating) {
    return (
      <button onClick={() => setShowRating(true)} className="rate-button">
        ⭐ Rate Version
      </button>
    );
  }

  return (
    <div className="rating-control">
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setSelectedRating(star)}
            className={`star ${star <= selectedRating ? 'selected' : ''}`}
          >
            ⭐
          </button>
        ))}
      </div>
      <div className="rating-actions">
        <button onClick={submitRating} disabled={selectedRating === 0}>Submit</button>
        <button onClick={() => setShowRating(false)}>Cancel</button>
      </div>
    </div>
  );
}

function MarkUsedControl({ engagements, onMarkUsed }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState('');
  const [context, setContext] = useState('');

  const submitUsage = () => {
    onMarkUsed(selectedEngagement || null, context);
    setShowForm(false);
    setSelectedEngagement('');
    setContext('');
  };

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} className="used-button">
        ✅ Mark as Used
      </button>
    );
  }

  return (
    <div className="mark-used-form">
      {engagements.length > 0 && (
        <select
          value={selectedEngagement}
          onChange={(e) => setSelectedEngagement(e.target.value)}
          className="engagement-select"
        >
          <option value="">Select engagement (optional)</option>
          {engagements.map(eng => (
            <option key={value(eng.sys_id)} value={value(eng.sys_id)}>
              {display(eng.name)}
            </option>
          ))}
        </select>
      )}
      
      <input
        type="text"
        placeholder="Context (optional)"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        className="context-input"
      />
      
      <div className="form-actions">
        <button onClick={submitUsage}>Submit</button>
        <button onClick={() => setShowForm(false)}>Cancel</button>
      </div>
    </div>
  );
}