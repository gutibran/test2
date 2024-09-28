        document.addEventListener('DOMContentLoaded', function () {
            let gazeDetected = false;
            let progress = 0;
            let startTime = null;
            const loadingBar = document.getElementById("loading-bar");
            const message = document.getElementById("message");

            // Initialize WebGazer
            function startEyeTracking() {
                webgazer.setGazeListener((data, elapsedTime) => {
                    if (data == null) {
                        gazeDetected = false;
                        resetProgress();
                        return;
                    }

                    const x = data.x;
                    const y = data.y;

                    // Check if gaze is within the viewport
                    if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
                        gazeDetected = true;
                    } else {
                        gazeDetected = false;
                        resetProgress();
                    }
                }).begin();

                webgazer.showVideo(false).showPredictionPoints(false);
            }

            // Update the progress bar based on time and eye tracking
            function updateProgress() {
                console.log("updating progress")
                if (gazeDetected && progress < 100) {
                    if (!startTime) {
                        startTime = Date.now();
                    }
                    const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
                    progress = (elapsedTime / 3600) * 100; // 1 hour = 3600 seconds

                    loadingBar.style.width = progress + "%";

                    if (progress >= 100) {
                        finishSession();
                        return;
                    }
                } else if (!gazeDetected) {
                    resetProgress(); // Reset if gaze is not detected
                }

                // Call updateProgress every second
                setTimeout(updateProgress, 1000);
            }

            // Reset the progress if the user looks away or interacts with the computer
            function resetProgress() {
                progress = 0;
                loadingBar.style.width = "0%";
                startTime = null;
                message.style.display = "none"; // Hide the message during progress
            }

            // Finish the session
            function finishSession() {
                document.getElementById("loading-bar-container").style.display = "none"; // Hide loading bar container
                message.style.display = "block"; // Show the message after finishing
            }

            // Handle window blur event to reset progress
            window.addEventListener('blur', resetProgress); // Reset when the window loses focus

            // Handle mouse movement event to reset progress
            window.addEventListener('mousemove', resetProgress); // Reset when mouse moves

            // Disable right-click functionality
            document.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });

            // Start the eye-tracking and progress bar on page load
            startEyeTracking();
            updateProgress();
        });