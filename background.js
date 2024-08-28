// // Common functions for both popup and background script
// //background.js
// chrome.action.onClicked.addListener((tab) => {
//   if (tab.url && tab.url.includes("youtube.com")) {
//     chrome.action.openPopup(); // Open the popup if on YouTube
//   }
// });

// // Check if the current active tab is not YouTube and show a message
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const tab = tabs[0];
//   if (tab.url && (!tab.url.includes("youtube.com") && !tab.url.includes("popup.html"))) {
//     let lo = document.getElementById("jik");
//     if (lo) lo.style.display='none';
//   }
// });
// chrome.action.onClicked.addListener((tab) => {
//   if (tab.url && tab.url.includes("youtube.com")) {
//     chrome.action.openPopup(); // Open the popup if on YouTube
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startTimer') {
//     chrome.storage.local.set({ timerDuration: message.duration }, () => {
//       chrome.windows.create({
//         url: 'popup.html',
//         type: 'popup',
//         width: 300,
//         height: 400
//       }, (window) => {
//         console.log('New window created:', window);
//       });
//     });
//   }
// });

// /*
// chrome.browserAction.onClicked.addListener(() => {
//   chrome.windows.create({
//     url: "popup.html",
//     type: "popup",
//     width: 300,
//     height: 200
//   });
// });
// /*
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startTimer') {
//     startTimer(message.duration);
//   } else if (message.action === 'viewResults') {
//     chrome.tabs.create({ url: chrome.runtime.getURL("results.html") });
//   }
// })*//*
// chrome.action.onClicked.addListener((tab) => {
//   if (tab.url && tab.url.includes("youtube.com")) {
//     chrome.action.openPopup(); // Open the popup if on YouTube
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startTimer') {
//     chrome.tabs.create({ url: 'popup.html' }, (tab) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: startTimer,
//         args: [message.duration]
//       });
//     });
//   }
// });

// function startTimer(duration) {
//   clearInterval(window.timerInterval);
//   window.timer = duration;

//   const now = new Date();
//   const date = now.toDateString();
//   const time = now.toLocaleTimeString();
//   const day = now.toLocaleDateString('en-us', { weekday: 'long' });

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


// document.addEventListener('DOMContentLoaded', () => {
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
//       startTimer(duration);
//     });
//   }

//   if (viewResultsButton) {
//     viewResultsButton.addEventListener('click', () => {
//       chrome.tabs.create({ url: chrome.runtime.getURL("results.html") });
//     });
//   }
// });
// */
// background.js

// Provide the tracking data when requested


// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    // Here you would start your timer and save timer data
    const duration = message.duration; // Assuming you get the duration from the message
    const timeSet = new Date().toLocaleString();

    // Retrieve existing timer data
    chrome.storage.local.get(['timerData'], (result) => {
      let timerData = result.timerData || [];
      timerData.push({ duration, timeSet });

      // Save updated timer data
      chrome.storage.local.set({ timerData }, () => {
        console.log('Timer data saved.');
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    chrome.storage.local.set({ timerDuration: message.duration }, () => {
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 380,
        height: 280
      }, (window) => {
        console.log('New window created:', window);
      });
    });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    startTimer(message.duration, message.mode);
  } else if (message.action === 'extendTimer') {
    // We don't need to handle extendTimer in the background script anymore
    // because it's handled directly in the popup now
  }
});

function startTimer(duration, mode) {
  
  window.timer = duration;

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
      window.close();
      
    }
  }, 1000);
}
