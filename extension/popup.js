// Popup script for LinkedIn Alumni Collector

let allProfiles = [];
let filteredProfiles = [];

// Load profiles from storage
async function loadProfiles() {
  const result = await chrome.storage.local.get(['profiles']);
  allProfiles = result.profiles || [];
  filteredProfiles = [...allProfiles];
  updateUI();
}

// Update the UI
function updateUI() {
  document.getElementById('profileCount').textContent = filteredProfiles.length;
  renderProfiles();
}

// Render profile list
function renderProfiles() {
  const container = document.getElementById('profileList');
  
  if (filteredProfiles.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">
          Aucun profil enregistré.<br>
          Visitez un profil LinkedIn et cliquez sur "Ajouter à l'Excel".
        </div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredProfiles.map((profile, index) => {
    const date = new Date(profile.timestamp);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <div class="profile-item" data-url="${escapeHtml(profile.profileUrl)}">
        <div class="profile-header">
          <div>
            <div class="profile-name">${escapeHtml(profile.fullName || 'Sans nom')}</div>
            ${profile.headline ? `<div class="profile-headline">${escapeHtml(profile.headline)}</div>` : ''}
            <div class="profile-info">
              ${profile.currentTitle ? `<div>💼 ${escapeHtml(profile.currentTitle)}${profile.currentCompany ? ` · ${escapeHtml(profile.currentCompany)}` : ''}</div>` : ''}
              ${profile.location ? `<div>📍 ${escapeHtml(profile.location)}</div>` : ''}
              ${profile.education ? `<div>🎓 ${escapeHtml(profile.education)}</div>` : ''}
              <div>🕒 ${dateStr}</div>
            </div>
          </div>
          <div class="profile-actions">
            <button class="icon-btn" onclick="openProfile('${escapeHtml(profile.profileUrl)}')" title="Ouvrir le profil">🔗</button>
            <button class="icon-btn delete" onclick="deleteProfile('${escapeHtml(profile.profileUrl)}')" title="Supprimer">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Search/filter profiles
function filterProfiles(query) {
  const q = query.toLowerCase().trim();
  
  if (!q) {
    filteredProfiles = [...allProfiles];
  } else {
    filteredProfiles = allProfiles.filter(profile => {
      return (
        (profile.fullName && profile.fullName.toLowerCase().includes(q)) ||
        (profile.firstName && profile.firstName.toLowerCase().includes(q)) ||
        (profile.lastName && profile.lastName.toLowerCase().includes(q)) ||
        (profile.headline && profile.headline.toLowerCase().includes(q)) ||
        (profile.currentTitle && profile.currentTitle.toLowerCase().includes(q)) ||
        (profile.currentCompany && profile.currentCompany.toLowerCase().includes(q)) ||
        (profile.location && profile.location.toLowerCase().includes(q)) ||
        (profile.education && profile.education.toLowerCase().includes(q))
      );
    });
  }
  
  updateUI();
}

// Delete a profile
window.deleteProfile = async function(profileUrl) {
  if (!confirm('Supprimer ce profil ?')) {
    return;
  }
  
  allProfiles = allProfiles.filter(p => p.profileUrl !== profileUrl);
  await chrome.storage.local.set({ profiles: allProfiles });
  await loadProfiles();
};

// Open profile in new tab
window.openProfile = function(url) {
  chrome.tabs.create({ url });
};

// Clear all profiles
async function clearAllProfiles() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer TOUS les profils ?\n\nCette action est irréversible !')) {
    return;
  }
  
  await chrome.storage.local.set({ profiles: [] });
  await loadProfiles();
}

// Export to Excel (.xlsx)
function exportToExcel() {
  if (allProfiles.length === 0) {
    alert('Aucun profil à exporter.');
    return;
  }
  
  // Prepare data for Excel
  const data = allProfiles.map(p => {
    const date = new Date(p.timestamp);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      'Prénom': p.firstName || '',
      'Nom': p.lastName || '',
      'Nom complet': p.fullName || '',
      'Headline': p.headline || '',
      'Poste': p.currentTitle || '',
      'Entreprise': p.currentCompany || '',
      'Lieu': p.location || '',
      'Formation': p.education || '',
      'URL LinkedIn': p.profileUrl || '',
      'Ajouté le': dateStr
    };
  });
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Alumni CHPS');
  
  // Auto-size columns
  const colWidths = [
    { wch: 15 }, // Prénom
    { wch: 20 }, // Nom
    { wch: 25 }, // Nom complet
    { wch: 40 }, // Headline
    { wch: 30 }, // Poste
    { wch: 30 }, // Entreprise
    { wch: 25 }, // Lieu
    { wch: 50 }, // Formation
    { wch: 50 }, // URL
    { wch: 18 }  // Date
  ];
  ws['!cols'] = colWidths;
  
  // Generate filename with timestamp
  const now = new Date();
  const filename = `Alumni_CHPS_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;
  
  // Download
  XLSX.writeFile(wb, filename);
}

// Export to CSV
function exportToCsv() {
  if (allProfiles.length === 0) {
    alert('Aucun profil à exporter.');
    return;
  }
  
  // Prepare CSV headers
  const headers = [
    'Prénom', 'Nom', 'Nom complet', 'Headline', 'Poste', 
    'Entreprise', 'Lieu', 'Formation', 'URL LinkedIn', 'Ajouté le'
  ];
  
  // Prepare rows
  const rows = allProfiles.map(p => {
    const date = new Date(p.timestamp);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return [
      p.firstName || '',
      p.lastName || '',
      p.fullName || '',
      p.headline || '',
      p.currentTitle || '',
      p.currentCompany || '',
      p.location || '',
      p.education || '',
      p.profileUrl || '',
      dateStr
    ];
  });
  
  // Build CSV content
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const now = new Date();
  link.download = `Alumni_CHPS_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
  
  link.click();
  URL.revokeObjectURL(url);
}

// Open options page
function openOptions() {
  chrome.runtime.openOptionsPage();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', (e) => {
  filterProfiles(e.target.value);
});

document.getElementById('exportExcel').addEventListener('click', exportToExcel);
document.getElementById('exportCsv').addEventListener('click', exportToCsv);
document.getElementById('clearAll').addEventListener('click', clearAllProfiles);
document.getElementById('openOptions').addEventListener('click', openOptions);

// Initialize
loadProfiles();
