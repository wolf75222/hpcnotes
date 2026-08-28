// Options page script

// Load saved options
async function loadOptions() {
  const result = await chrome.storage.local.get(['webhookUrl', 'profiles']);
  
  const webhookUrl = result.webhookUrl || '';
  document.getElementById('webhookUrl').value = webhookUrl;
  
  const profiles = result.profiles || [];
  document.getElementById('profileCount').textContent = profiles.length;
}

// Save options
async function saveOptions() {
  const webhookUrl = document.getElementById('webhookUrl').value.trim();
  
  await chrome.storage.local.set({ webhookUrl });
  
  const statusEl = document.getElementById('saveStatus');
  statusEl.textContent = '✓ Options enregistrées avec succès !';
  statusEl.className = 'status-message success';
  
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 3000);
}

// Event listeners
document.getElementById('saveBtn').addEventListener('click', saveOptions);

// Load on page load
loadOptions();
