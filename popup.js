// //popup.js
// document.addEventListener('DOMContentLoaded', () => {
//   chrome.storage.local.get('timerDuration', (result) => {
//     const duration = result.timerDuration;
//     if (duration) {
//       startTimer(duration);
//     }
//   });

//   const startButton = document.getElementById('start');
//   const timerInput = document.getElementById('timerInput');
//   const viewResultsButton = document.getElementById('viewResults');

//   if (startButton) {
//     startButton.addEventListener('click', () => {
//       const duration = parseInt(timerInput.value, 10);
//       if (isNaN(duration) || duration <= 0) {
//         alert("Please enter a valid number of seconds.");
//         return;
//       }
//       chrome.runtime.sendMessage({ action: 'startTimer', duration: duration });
//       window.close(); // Close the popup
//     });
//   }

//   if (viewResultsButton) {
//     viewResultsButton.addEventListener('click', () => {
//       chrome.tabs.create({ url: chrome.runtime.getURL("results.html") });
//     });
//   }
// });

// function startTimer(duration) {
//   clearInterval(window.timerInterval);
//   window.timer = duration;

//   window.timerInterval = setInterval(() => {
//     let hours = Math.floor(window.timer / 3600);
//     let minutes = Math.floor((window.timer % 3600) / 60);
//     let seconds = Math.floor(window.timer % 60);

//     hours = hours < 10 ? "0" + hours : hours;
//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     if (document.getElementById("hrs1")) document.getElementById("hrs1").textContent = hours + ":";
//     if (document.getElementById("min1")) document.getElementById("min1").textContent = minutes + ":";
//     if (document.getElementById("sec1")) document.getElementById("sec1").textContent = seconds;

//     if (--window.timer < 0) {
//       clearInterval(window.timerInterval);
//       chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
//         tabs.forEach((tab) => {
//           chrome.tabs.remove(tab.id);
//         });
//       });
//     }
//   }, 1000);
// }
// popup.js

// Example: Open medi.html first



document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['timerDuration', 'timerMode', 'count1'], (result) => {
    const duration = result.timerDuration;
    const mode = result.timerMode || 'easy'; // Default to easy mode if not set
    const count = result.count1 || 0; // Initialize count if not set
    console.log('Current count:', count); // Optional: Log current count
    if (duration) {
      startTimer(duration, mode);
    }
  });

  const startButton = document.getElementById('start');
  const timerInput = document.getElementById('timerInput');
  const viewResultsButton = document.getElementById('viewResults');

  if (startButton) {
    startButton.addEventListener('click', () => {
      const duration = parseInt(timerInput.value, 10);
      const duration1 = document.getElementById("timerInput").value; // Get the duration set by the user
      const currentTime = new Date().toLocaleTimeString(); // Get the current time
  
      // Store the timer data in localStorage
      const newEntry = {
        duration: duration1,
        timeSet: currentTime
      };
      
      // Retrieve existing entries from chrome.storage.local
      chrome.storage.local.get(['timerEntries'], function(result) {
        const timerEntries = result.timerEntries || [];
        
        // Add the new entry
        timerEntries.push(newEntry);
        
        // Save the updated entries back to chrome.storage.local
        chrome.storage.local.set({ timerEntries: timerEntries }, function() {
          console.log('Timer entry has been stored.');
        });
      });
      if (isNaN(duration) || duration <= 0) {
        alert("Please enter a valid number of seconds.");
        return;
      }

      const mode = prompt("Enter mode: 'easy' or 'hard'", "easy").toLowerCase();

      if (mode !== 'easy' && mode !== 'hard') {
        alert("Please enter a valid mode: 'easy' or 'hard'.");
        return;
      }

      chrome.storage.local.get('count1', (result) => {
        let count = result.count1 || 0;
        count++; // Increment the count
        chrome.storage.local.set({ 
          timerDuration: duration, 
          timerMode: mode, 
          extended: false, 
          count1: count 
        }, () => {
          console.log('Updated count:', count); // Optional: Log updated count
          chrome.runtime.sendMessage({ 
            action: 'startTimer', 
            duration: duration, 
            mode: mode 
          });
          window.close(); // Close the popup
        });
      });
    });
  }

  if (viewResultsButton) {
    viewResultsButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'getVisitLogs' }, (logs) => {
        console.log("Visit logs:", logs);
        // Update your results display here
      });
    });
  }
});

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
            window.open('medi.html');

// Save data from medi.html to localStorage or sessionStorage
// Assuming you have collected some data in `medi.html`, store it



// Open results.html after saving data
window.open('results.html', 'resultsPopup', 'width=600,height=400');
window.close();
          } else if (mode === 'hard' || hasExtended) {
            closeYouTubeTabs();
          }
        });
      }
    }, 1000);
  });
}

function showOverlay() {
  let overlay = document.getElementById('overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontSize = '18px';
    overlay.style.zIndex = '9999';
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';

    const message = document.createElement('div');
    message.textContent = "Your timer has expired.";
    message.style.marginBottom = '20px';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    overlay.appendChild(message);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row';
    buttonContainer.style.gap = '10px';

    const extendButton = document.createElement('button');
    extendButton.id = 'extendButton';
    extendButton.textContent = 'Extend';
    extendButton.style.padding = '10px 20px';
    extendButton.style.fontSize = '16px';
    extendButton.style.backgroundColor = '#28a745';
    extendButton.style.color = 'white';
    extendButton.style.border = 'none';
    extendButton.style.borderRadius = '5px';
    extendButton.style.cursor = 'pointer';
    extendButton.style.transition = 'background-color 0.3s';
    extendButton.addEventListener('mouseover', () => extendButton.style.backgroundColor = '#218838');
    extendButton.addEventListener('mouseout', () => extendButton.style.backgroundColor = '#28a745');
    buttonContainer.appendChild(extendButton);

    const closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.textContent = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'background-color 0.3s';
    closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = '#c82333');
    closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = '#dc3545');
    buttonContainer.appendChild(closeButton);

    overlay.appendChild(buttonContainer);
    document.body.appendChild(overlay);
  } else {
    overlay.style.display = 'flex'; // Show the overlay if it already exists
  }

  document.getElementById('extendButton').addEventListener('click', () => {
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
    hideOverlay();
  });

  document.getElementById('closeButton').addEventListener('click', () => {
    hideOverlay();
    closeYouTubeTabs();
  });
}

function hideOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function closeYouTubeTabs() {
  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
}
