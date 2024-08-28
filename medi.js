let sd = document.getElementById("rect");
let text1 = document.getElementById("text");
let fg = document.getElementById("att");
chrome.storage.local.get('count1', (result) => {
    const count = result.count1 || 0; // Retrieve count, default to 0 if not set
    fg.textContent = result.count1;
    // You can now use the count value in your code
});
function setTimer() {
  const timerDuration = document.getElementById('timerDuration').value; // Get timer duration from input
  const currentTime = new Date().toLocaleString(); // Get current time as the set time
  
  // Store these values in localStorage
  localStorage.setItem('timerDuration', timerDuration);
  localStorage.setItem('timerSetTime', currentTime);
  
  // Optionally navigate to results.html after setting timer
  window.open('results.html', 'resultsPopup', 'width=600,height=400');
}
// chrome.storage.local.get('count1', (result) => {
//     fg.textContent = result;
//   });
// Apply the first animation to grow the element
sd.style.animation = 'growDown 5s forwards';

// Listen for the end of the first animation
sd.addEventListener('animationend', function() {
    if (sd.style.animationName === 'growDown') {
        text1.textContent="BREATH OUT";
        // Apply the second animation to shrink the element
        sd.style.animation = 'growTop 5s forwards';
    }
});
// chrome.storage.local.set({ count1: 0 }, () => {
//     console.log('Count has been reset to 0');
//     // You can also update the UI or perform other actions after resetting
// });
showOverlay();
function showOverlay() {
    // let overlay = document.getElementById('overlay');
    // if (!overlay) {
    //   overlay = document.createElement('div');
    //   overlay.id = 'overlay';
    //   overlay.style.position = 'fixed';
    //   overlay.style.top = '0';
    //   overlay.style.left = '0';
    //   overlay.style.width = '100%';
    //   overlay.style.height = '100%';
    //   overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    //   overlay.style.color = 'white';
    //   overlay.style.display = 'flex';
    //   overlay.style.flexDirection = 'column';
    //   overlay.style.justifyContent = 'center';
    //   overlay.style.alignItems = 'center';
    //   overlay.style.fontSize = '18px';
    //   overlay.style.zIndex = '9999';
    //   overlay.style.padding = '20px';
    //   overlay.style.boxSizing = 'border-box';
  
    //   const message = document.createElement('div');
    //   message.textContent = "Your timer has expired.";
    //   message.style.marginBottom = '20px';
    //   message.style.fontSize = '24px';
    //   message.style.fontWeight = 'bold';
    //   overlay.appendChild(message);
  
    //   const buttonContainer = document.createElement('div');
    //   buttonContainer.style.display = 'flex';
    //   buttonContainer.style.flexDirection = 'row';
    //   buttonContainer.style.gap = '10px';
  
    //   const extendButton = document.createElement('button');
    //   extendButton.id = 'extendButton';
    //   extendButton.textContent = 'Extend';
    //   extendButton.style.padding = '10px 20px';
    //   extendButton.style.fontSize = '16px';
    //   extendButton.style.backgroundColor = '#28a745';
    //   extendButton.style.color = 'white';
    //   extendButton.style.border = 'none';
    //   extendButton.style.borderRadius = '5px';
    //   extendButton.style.cursor = 'pointer';
    //   extendButton.style.transition = 'background-color 0.3s';
    //   extendButton.addEventListener('mouseover', () => extendButton.style.backgroundColor = '#218838');
    //   extendButton.addEventListener('mouseout', () => extendButton.style.backgroundColor = '#28a745');
    //   buttonContainer.appendChild(extendButton);
  
    //   const closeButton = document.createElement('button');
    //   closeButton.id = 'closeButton';
    //   closeButton.textContent = 'Close';
    //   closeButton.style.padding = '10px 20px';
    //   closeButton.style.fontSize = '16px';
    //   closeButton.style.backgroundColor = '#dc3545';
    //   closeButton.style.color = 'white';
    //   closeButton.style.border = 'none';
    //   closeButton.style.borderRadius = '5px';
    //   closeButton.style.cursor = 'pointer';
    //   closeButton.style.transition = 'background-color 0.3s';
    //   closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = '#c82333');
    //   closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = '#dc3545');
    //   buttonContainer.appendChild(closeButton);
  
    //   overlay.appendChild(buttonContainer);
    //   document.body.appendChild(overlay);
    // } else {
    //   overlay.style.display = 'flex'; // Show the overlay if it already exists
    // }
  
    document.getElementById('continue').addEventListener('click', () => {
      const additionalSeconds = prompt("Enter additional seconds:");
      const duration = parseInt(additionalSeconds, 10);
      if (!isNaN(duration) && duration > 0) {
        chrome.storage.local.get('timerDuration', (result) => {
          const currentDuration = result.timerDuration || 0;
          chrome.storage.local.set({ extended: true }); // Set the extended flag
          startTimer(currentDuration + duration, 'easy'); // Extend timer and keep in easy mode
          chrome.storage.local.set({ timerDuration: currentDuration + duration });
        });
      }
      chrome.windows.create({
               url: 'popup.html',
                 type: 'popup',
                 width: 300,
                 height: 400
               });
               
    });
  
    document.getElementById('close').addEventListener('click', () => {
      
      closeYouTubeTabs();
    });
  }
  
//   function hideOverlay() {
//     const overlay = document.getElementById('overlay');
//     if (overlay) {
//       overlay.style.display = 'none';
//     }
//   }
  
  function closeYouTubeTabs() {
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.remove(tab.id);
      });
    });
  }
  function startTimer(duration, mode) {
    clearInterval(window.timerInterval);
    window.timer = duration;
  
    // Close all existing timer popups
    chrome.storage.local.get('timerWindowIds', (result) => {
      const timerWindowIds = result.timerWindowIds || [];
      timerWindowIds.forEach((windowId) => {
        chrome.windows.remove(windowId);
      });
  
      chrome.storage.local.set({ timerMode: mode });
  
      window.timerInterval = setInterval(() => {
        let hours = Math.floor(window.timer / 3600);
        let minutes = Math.floor((window.timer % 3600) / 60);
        let seconds = Math.floor(window.timer % 60);
  
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
  
        if (document.getElementById("hrs1")) {
          document.getElementById("hrs1").textContent = hours + ":";
        }
        if (document.getElementById("min1")) {
          document.getElementById("min1").textContent = minutes + ":";
        }
        if (document.getElementById("sec1")) {
          document.getElementById("sec1").textContent = seconds;
        }
  
        if (--window.timer < 0) {
          clearInterval(window.timerInterval);
  
          chrome.storage.local.get('extended', (result) => {
            const hasExtended = result.extended || false;
  
            if (mode === 'easy' && !hasExtended) {
              window.open("medi.html");
            } else if (mode === 'hard' || hasExtended) {
              closeYouTubeTabs();
            }
          });
        }
      }, 1000);
    });
  }
  