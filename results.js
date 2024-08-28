document.addEventListener('DOMContentLoaded', function() {
  // Function to load timer data from chrome.storage.local
  function loadTimerResults() {
    chrome.storage.local.get(['timerEntries'], function(result) {
      const timerEntries = result.timerEntries || [];
      const tableBody = document.getElementById('timerTableBody');

      // Clear existing rows
      tableBody.innerHTML = '';

      // Add a row for each timer entry
      timerEntries.forEach(entry => {
        const row = document.createElement('tr');

        const durationCell = document.createElement('td');
        durationCell.textContent = entry.duration;
        row.appendChild(durationCell);

        const timeSetCell = document.createElement('td');
        timeSetCell.textContent = entry.timeSet;
        row.appendChild(timeSetCell);

        tableBody.appendChild(row);
      });
    });
  }

  // Call the function to load and display timer results
  loadTimerResults();
});
