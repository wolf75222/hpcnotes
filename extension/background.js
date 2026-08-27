// Background service worker for LinkedIn Alumni Collector

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('LinkedIn Alumni Collector installed');
    
    // Initialize storage
    chrome.storage.local.get(['profiles'], (result) => {
      if (!result.profiles) {
        chrome.storage.local.set({ profiles: [] });
      }
    });
  }
});

// Keep service worker alive if needed (Manifest V3)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle any messages from content scripts if needed
  return true;
});
