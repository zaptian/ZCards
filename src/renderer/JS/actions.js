// (async function () {
//   const versionEl = document.getElementById("version");
//   const statusEl = document.getElementById("update-status");
//   const checkBtn = document.getElementById("check-update");
//   const restartBtn = document.getElementById("restart-now");

//   const version = await window.zcards.getVersion();
//   versionEl.textContent = `v${version}`;

//   function setStatus(text) {
//     statusEl.textContent = text;
//   }

//   window.zcards.onUpdateEvent((event) => {
//     const { status, payload } = event;
//     switch (status) {
//       case "checking":
//         setStatus("Checking for updates...");
//         break;
//       case "update-available":
//         setStatus("Update available — downloading...");
//         break;
//       case "download-progress":
//         if (payload && payload.percent)
//           setStatus(`Downloading: ${Math.round(payload.percent)}%`);
//         break;
//       case "update-downloaded":
//         setStatus("Update downloaded. Ready to install.");
//         restartBtn.style.display = "inline-block";
//         break;
//       case "update-not-available":
//         setStatus("No updates available.");
//         break;
//       case "error":
//         setStatus("Update error: " + (payload || "unknown"));
//         break;
//       default:
//         setStatus(status);
//     }
//   });

//   checkBtn.addEventListener("click", () => {
//     setStatus("Manual update check...");
//     window.zcards.checkForUpdates();
//   });

//   restartBtn.addEventListener("click", () => {
//     setStatus("Installing update and restarting...");
//     window.zcards.quitAndInstall();
//   });
// })();
