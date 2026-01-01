function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById('clock').textContent = timeString;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString(undefined, options);
  document.getElementById('date').textContent = dateString;
}

setInterval(updateClock, 1000);
updateClock(); // run once immediately

// Ask for notification permission
Notification.requestPermission().then(permission => {
  if (permission !== "granted") {
    alert("Please enable notifications to receive alerts.");
  }
});

function startTimer() {
  const seconds = parseInt(document.getElementById('timeInput').value);
  const status = document.getElementById('status');

  if (isNaN(seconds) || seconds < 1) {
    status.textContent = "Please enter a valid time.";
    return;
  }

  status.textContent = `Timer started for ${seconds} seconds...`;

  setTimeout(() => {
    showNotification("⏰ Time's up!", `Your ${seconds}-second timer has ended.`);
    status.textContent = "Timer ended.";
  }, seconds * 1000);
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: "https://cdn-icons-png.flaticon.com/512/727/727399.png"
    });
  }
}
