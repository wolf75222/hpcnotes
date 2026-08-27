// Content script for LinkedIn profile pages
// Injects a button next to the profile name to save alumni data

(function() {
  'use strict';

  const BUTTON_ID = 'linkedin-alumni-collector-btn';
  let currentProfileUrl = null;
  let buttonInjected = false;

  // Parse the profile URL to get canonical form
  function getProfileUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/in\/([^\/]+)/);
    if (match) {
      return `https://www.linkedin.com/in/${match[1]}`;
    }
    return window.location.href;
  }

  // Extract profile data from the page
  function extractProfileData() {
    const data = {
      profileUrl: getProfileUrl(),
      timestamp: new Date().toISOString(),
      fullName: '',
      firstName: '',
      lastName: '',
      headline: '',
      currentTitle: '',
      currentCompany: '',
      location: '',
      education: ''
    };

    // Extract full name - try multiple selectors for resilience
    const nameSelectors = [
      'h1.text-heading-xlarge',
      'h1[class*="text-heading"]',
      '.pv-top-card h1',
      '.ph5 h1',
      'main h1'
    ];

    for (const selector of nameSelectors) {
      const nameEl = document.querySelector(selector);
      if (nameEl && nameEl.textContent.trim()) {
        data.fullName = nameEl.textContent.trim();
        break;
      }
    }

    // Split name into first and last
    if (data.fullName) {
      const parts = data.fullName.split(/\s+/);
      if (parts.length >= 2) {
        data.firstName = parts[0];
        data.lastName = parts.slice(1).join(' ');
      } else {
        data.firstName = data.fullName;
      }
    }

    // Extract headline
    const headlineSelectors = [
      '.text-body-medium.break-words',
      '.pv-top-card-section__headline',
      '[class*="headline"]',
      'h1 + div.text-body-medium'
    ];

    for (const selector of headlineSelectors) {
      const headlineEl = document.querySelector(selector);
      if (headlineEl && headlineEl.textContent.trim() && !headlineEl.textContent.includes('Contact info')) {
        data.headline = headlineEl.textContent.trim();
        break;
      }
    }

    // Extract location
    const locationSelectors = [
      '.text-body-small.inline.t-black--light.break-words',
      '.pv-top-card-section__location',
      '[class*="location"]'
    ];

    for (const selector of locationSelectors) {
      const locationEl = document.querySelector(selector);
      if (locationEl && locationEl.textContent.trim()) {
        const text = locationEl.textContent.trim();
        if (text && !text.includes('Contact') && text.length < 100) {
          data.location = text;
          break;
        }
      }
    }

    // Extract current experience (title and company)
    try {
      const experienceSection = document.querySelector('#experience')?.closest('section');
      if (experienceSection) {
        const firstExperience = experienceSection.querySelector('li');
        if (firstExperience) {
          const titleEl = firstExperience.querySelector('[class*="mr1"][class*="t-bold"]') || 
                         firstExperience.querySelector('.t-bold span[aria-hidden="true"]');
          const companyEl = firstExperience.querySelector('.t-14.t-normal span[aria-hidden="true"]') ||
                           firstExperience.querySelector('.t-14 span[aria-hidden="true"]');
          
          if (titleEl) data.currentTitle = titleEl.textContent.trim();
          if (companyEl) data.currentCompany = companyEl.textContent.trim();
        }
      }
    } catch (e) {
      console.log('Could not extract experience:', e);
    }

    // Extract education - collect all education entries
    try {
      const educationSection = document.querySelector('#education')?.closest('section');
      if (educationSection) {
        const educationItems = educationSection.querySelectorAll('li');
        const educationTexts = [];
        educationItems.forEach(item => {
          const schoolEl = item.querySelector('[class*="mr1"][class*="t-bold"]') || 
                          item.querySelector('.t-bold span[aria-hidden="true"]');
          const degreeEl = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
          
          if (schoolEl) {
            let eduText = schoolEl.textContent.trim();
            if (degreeEl) {
              eduText += ' - ' + degreeEl.textContent.trim();
            }
            educationTexts.push(eduText);
          }
        });
        data.education = educationTexts.join(' | ');
      }
    } catch (e) {
      console.log('Could not extract education:', e);
    }

    return data;
  }

  // Check if profile is already saved
  async function isProfileSaved(profileUrl) {
    const result = await chrome.storage.local.get(['profiles']);
    const profiles = result.profiles || [];
    return profiles.some(p => p.profileUrl === profileUrl);
  }

  // Save profile to storage
  async function saveProfile(data) {
    const result = await chrome.storage.local.get(['profiles']);
    const profiles = result.profiles || [];
    
    // Check for duplicates
    if (profiles.some(p => p.profileUrl === data.profileUrl)) {
      return { success: false, message: 'Déjà ajouté' };
    }
    
    profiles.push(data);
    await chrome.storage.local.set({ profiles });
    
    // Send to webhook if configured
    try {
      const options = await chrome.storage.local.get(['webhookUrl']);
      if (options.webhookUrl && options.webhookUrl.trim()) {
        fetch(options.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          mode: 'no-cors'
        }).catch(err => console.log('Webhook error:', err));
      }
    } catch (e) {
      console.log('Could not send to webhook:', e);
    }
    
    return { success: true, message: 'Ajouté ✓' };
  }

  // Create and inject the button
  async function injectButton() {
    // Remove existing button if any
    const existingBtn = document.getElementById(BUTTON_ID);
    if (existingBtn) {
      existingBtn.remove();
    }

    // Find the profile name element
    const nameSelectors = [
      'h1.text-heading-xlarge',
      'h1[class*="text-heading"]',
      '.pv-top-card h1',
      '.ph5 h1',
      'main h1'
    ];

    let nameElement = null;
    for (const selector of nameSelectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        nameElement = el;
        break;
      }
    }

    if (!nameElement) {
      console.log('Name element not found yet');
      return;
    }

    // Create button
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.className = 'linkedin-alumni-collector-button';
    
    // Check if already saved
    const profileUrl = getProfileUrl();
    const alreadySaved = await isProfileSaved(profileUrl);
    
    if (alreadySaved) {
      button.textContent = 'Déjà ajouté ✓';
      button.classList.add('already-saved');
    } else {
      button.textContent = 'Ajouter à l\'Excel';
    }

    // Add click handler
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (button.classList.contains('already-saved')) {
        return;
      }
      
      button.disabled = true;
      button.textContent = 'Extraction...';
      
      try {
        const data = extractProfileData();
        const result = await saveProfile(data);
        
        if (result.success) {
          button.textContent = result.message;
          button.classList.add('success');
          setTimeout(() => {
            button.textContent = 'Déjà ajouté ✓';
            button.classList.remove('success');
            button.classList.add('already-saved');
          }, 2000);
        } else {
          button.textContent = result.message;
          button.classList.add('already-saved');
        }
      } catch (err) {
        console.error('Error saving profile:', err);
        button.textContent = 'Erreur';
        button.classList.add('error');
        setTimeout(() => {
          button.textContent = 'Ajouter à l\'Excel';
          button.disabled = false;
          button.classList.remove('error');
        }, 2000);
      }
    });

    // Insert button next to name
    const container = nameElement.parentElement;
    if (container) {
      // Try to insert in a clean way
      const wrapper = document.createElement('div');
      wrapper.style.display = 'inline-block';
      wrapper.style.marginLeft = '16px';
      wrapper.style.verticalAlign = 'middle';
      wrapper.appendChild(button);
      
      // Insert after the name element if possible
      if (nameElement.nextSibling) {
        container.insertBefore(wrapper, nameElement.nextSibling);
      } else {
        container.appendChild(wrapper);
      }
      
      buttonInjected = true;
      currentProfileUrl = profileUrl;
    }
  }

  // Initialize and watch for navigation
  function init() {
    // Initial injection
    setTimeout(injectButton, 1000);
    
    // Watch for DOM changes (LinkedIn is an SPA)
    const observer = new MutationObserver(() => {
      const newUrl = getProfileUrl();
      if (newUrl !== currentProfileUrl || !document.getElementById(BUTTON_ID)) {
        buttonInjected = false;
        currentProfileUrl = newUrl;
        setTimeout(injectButton, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Also listen to history changes
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        buttonInjected = false;
        setTimeout(injectButton, 1000);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
