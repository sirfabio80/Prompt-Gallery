import React, { useEffect, useState } from 'react';
import { display, value } from './utils/fields.js';

export default function DebugApp() {
  const [prompts, setPrompts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load prompts
        const promptResponse = await fetch('/api/now/table/x_snc_prompt_galle_prompt?sysparm_display_value=all&sysparm_query=is_active=true', {
          headers: {
            "Accept": "application/json",
            "X-UserToken": window.g_ck
          }
        });
        
        if (!promptResponse.ok) {
          throw new Error(`Failed to load prompts: ${promptResponse.status}`);
        }
        
        const promptData = await promptResponse.json();
        setPrompts(promptData.result || []);

        // Load versions
        const versionResponse = await fetch('/api/now/table/x_snc_prompt_galle_prompt_version?sysparm_display_value=all&sysparm_limit=20', {
          headers: {
            "Accept": "application/json",
            "X-UserToken": window.g_ck
          }
        });
        
        if (!versionResponse.ok) {
          throw new Error(`Failed to load versions: ${versionResponse.status}`);
        }
        
        const versionData = await versionResponse.json();
        setVersions(versionData.result || []);

      } catch (err) {
        console.error('Debug error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading data...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Prompt Gallery Debug Page</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Service Portal Status</h2>
        <p>If you can see this page, React and Table API are working correctly.</p>
        <p><strong>Service Portal URL:</strong> <a href="/sp?id=prompt_gallery" target="_blank">https://demoalectriallwfze132297.service-now.com/sp?id=prompt_gallery</a></p>
        <p><strong>Alternative URL:</strong> <a href="/prompt-gallery" target="_blank">https://demoalectriallwfze132297.service-now.com/prompt-gallery</a></p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Prompts Data ({prompts.length} records)</h2>
        {prompts.length === 0 ? (
          <p style={{ color: 'orange' }}>No prompts found</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {prompts.map(prompt => (
              <div key={value(prompt.sys_id)} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h3>{display(prompt.name)}</h3>
                <p><strong>Category:</strong> {display(prompt.category)}</p>
                <p><strong>Description:</strong> {display(prompt.short_description)}</p>
                <p><strong>Usage Count:</strong> {display(prompt.total_usage_count)}</p>
                <p><strong>Active:</strong> {display(prompt.is_active)}</p>
                <p><strong>Sys ID:</strong> {value(prompt.sys_id)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Prompt Versions Data ({versions.length} records)</h2>
        {versions.length === 0 ? (
          <p style={{ color: 'orange' }}>No versions found</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {versions.map(version => (
              <div key={value(version.sys_id)} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <h4>{display(version.version_display)}</h4>
                <p><strong>Version:</strong> {display(version.version_number)}</p>
                <p><strong>Status:</strong> {display(version.status)}</p>
                <p><strong>Target Tool:</strong> {display(version.target_tool)}</p>
                <p><strong>Rating:</strong> {display(version.rating_sum)} / {display(version.rating_count)} (avg: {display(version.average_rating)})</p>
                <p><strong>Usage Count:</strong> {display(version.usage_count)}</p>
                <p><strong>Prompt:</strong> {value(version.prompt)}</p>
                <details>
                  <summary>View Prompt Body</summary>
                  <pre style={{ background: '#f0f0f0', padding: '10px', whiteSpace: 'pre-wrap' }}>{display(version.prompt_body)}</pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '5px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>If this debug page works but Service Portal doesn't, try clearing your browser cache</li>
          <li>Check browser console for JavaScript errors when visiting the Service Portal</li>
          <li>Try accessing Service Portal in incognito/private mode</li>
          <li>Verify you have proper ServiceNow permissions for Service Portal</li>
        </ol>
      </div>
    </div>
  );
}