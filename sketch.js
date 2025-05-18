// Main p5.js sketch for CodeQuest: Space Coder
let gameState = "menu";
let stars = [];
let currentLevel = 1;
let score = 0;
let hintCount = 0;
let elements = {};

// Initialize p5.js canvas and DOM elements
function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("game-container");

  // Generate background stars
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(0, width),
      y: random(0, height),
      size: random(1, 3)
    });
  }

  // Cache DOM elements
  elements = {
    playButton: select("#play-button"),
    tutorialButton: select("#tutorial-button"),
    aboutButton: select("#about-button"),
    challengeScreen: select("#challenge-screen"),
    codeEditor: select("#code-editor"),
    playerButton: select("#player-button"),
    playerLayout: select("#player-layout"),
    playerJsButton: select("#player-js-button"),
    playerText: select("#player-text"),
    submitButton: select("#submit-button"),
    nextButton: select("#next-button"),
    menuButton: select("#menu-button"),
    hintButton: select("#hint-button"),
    scoreDisplay: select("#score-display"),
    hintDisplay: select("#hint-display"),
    aboutScreen: select("#about-screen"),
    scoreInput: select("#score"),
    formConfirmation: select("#form-confirmation"),
    aboutMenuButton: select("#about-menu-button")
  };

  // Bind event handlers
  elements.playButton.mousePressed(() => {
    gameState = "play";
    currentLevel = 1;
    score = 0;
    hintCount = 0;
    resetChallenge();
  });
  elements.tutorialButton.mousePressed(() => { gameState = "tutorial"; });
  elements.aboutButton.mousePressed(() => {
    gameState = "about";
    elements.scoreInput.value(score);
    elements.formConfirmation.hide();
  });
  elements.submitButton.mousePressed(() => checkCodeHandler());
  elements.nextButton.mousePressed(() => nextLevel());
  elements.menuButton.mousePressed(() => { gameState = "menu"; });
  elements.hintButton.mousePressed(() => showHint());
  elements.aboutMenuButton.mousePressed(() => { gameState = "menu"; });

  // Configure target JS button
  select("#target-js-button").mousePressed(() => alert("Ship Repaired!"));

  // Handle form submission
  select("#feedback-form").elt.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    }).then(() => {
      elements.formConfirmation.show();
      event.target.reset();
      setTimeout(() => elements.formConfirmation.hide(), 3000);
    }).catch((error) => console.log("Form Submission Error:", error));
  });
}

// Render game visuals
function draw() {
  background(0);

  // Draw stars
  for (let star of stars) {
    fill(255);
    noStroke();
    circle(star.x, star.y, star.size);
  }

  // Handle game states
  if (gameState === "menu") {
    renderMenu();
  } else if (gameState === "play") {
    renderChallenge();
  } else if (gameState === "about") {
    renderAbout();
  } else if (gameState === "tutorial") {
    renderTutorial();
  }
}

// Render menu screen
function renderMenu() {
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text("CodeQuest: Space Coder", width / 2, 150);
  textSize(20);
  text("Learn HTML, CSS, and JavaScript!", width / 2, 200);

  elements.playButton.show();
  elements.tutorialButton.show();
  elements.aboutButton.show();
  elements.challengeScreen.hide();
  elements.aboutScreen.hide();
}

// Render challenge screen
function renderChallenge() {
  elements.playButton.hide();
  elements.tutorialButton.hide();
  elements.aboutButton.hide();
  elements.challengeScreen.show();
  elements.aboutScreen.hide();

  elements.scoreDisplay.html(`Score: ${score}`);

  fill(255);
  textAlign(LEFT);
  textSize(20);
  const levelMessages = {
    1: "Level 1: Style the button to match the target!",
    2: "Level 2: Create a layout with a header and content!",
    3: "Level 3: Make the button show an alert when clicked!",
    4: "Level 4: Write a function to update the text to \"Mission Ready!\""
  };
  text(levelMessages[currentLevel], 50, 50);

  // Show/hide elements based on level
  elements.playerButton.show(currentLevel === 1);
  elements.playerLayout.show(currentLevel === 2);
  elements.playerJsButton.show(currentLevel === 3);
  elements.playerText.show(currentLevel === 4);

  // Apply code in real-time
  applyCode(currentLevel, elements.codeEditor.value(), elements);
}

// Render about screen
function renderAbout() {
  elements.playButton.hide();
  elements.tutorialButton.hide();
  elements.aboutButton.hide();
  elements.challengeScreen.hide();
  elements.aboutScreen.show();

  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("Share Your Feedback!", width / 2, 50);
}

// Render tutorial screen
function renderTutorial() {
  elements.playButton.hide();
  elements.tutorialButton.hide();
  elements.aboutButton.hide();
  elements.challengeScreen.hide();
  elements.aboutScreen.hide();

  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("Tutorial Screen (Placeholder)", width / 2, height / 2);
}

// Handle code submission
function checkCodeHandler() {
  const result = checkCode(currentLevel, elements.codeEditor.value(), elements);
  if (result) {
    alert(`Success! Level ${currentLevel} completed!`);
    score += 100;
    if (currentLevel === 4) {
      alert(`Congratulations! You completed all levels with a score of ${score}!`);
      gameState = "menu";
      currentLevel = 1;
      score = 0;
      resetChallenge();
    } else {
      elements.nextButton.show();
    }
  } else {
    alert(`Not quite! Check the requirements for Level ${currentLevel}.`);
  }
}

// Show hint for current level
function showHint() {
  const hint = getHint(currentLevel, hintCount);
  if (hint) {
    elements.hintDisplay.html(hint);
    elements.hintDisplay.show();
    hintCount++;
  } else {
    alert("No more hints available!");
  }
}

// Proceed to next level
function nextLevel() {
  currentLevel++;
  hintCount = 0;
  elements.hintDisplay.hide();
  if (currentLevel > 4) {
    alert(`Congratulations! You completed all levels with a score of ${score}!`);
    gameState = "menu";
    currentLevel = 1;
    score = 0;
  }
  resetChallenge();
}

// Reset challenge state
function resetChallenge() {
  elements.codeEditor.value("");
  elements.playerButton.attribute("style", "");
  elements.playerLayout.html("");
  elements.playerJsButton.elt.onclick = null;
  elements.playerText.html("Waiting...");
  elements.nextButton.hide();
  hintCount = 0;
  elements.hintDisplay.hide();
}