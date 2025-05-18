let gameState = 'menu';
let stars = [];
let currentLevel = 1;
let score = 0;
let hintCount = 0;
let playButton, tutorialButton, aboutButton, challengeScreen, codeEditor, playerButton, playerLayout, playerJsButton, playerText, submitButton, nextButton, menuButton, hintButton, scoreDisplay, hintDisplay, aboutScreen, scoreInput, formConfirmation, aboutMenuButton;

const hints = {
  1: [
    'Use CSS to change the button’s appearance.',
    'Try setting `background-color: #4682b4;`.',
    'Add `border-radius: 10px;` and `color: #fff;` to match the target.'
  ],
  2: [
    'Use HTML `<div>` tags with specific classes.',
    'Create a `<div class="header">Header</div>`.',
    'Add a `<div class="content">Content</div>` below the header.'
  ],
  3: [
    'Add an `onclick` event to the button.',
    'Use `document.getElementById("player-js-button")` to select the button.',
    'Set `.onclick = () => alert("Ship Repaired!");` to show the alert.'
  ],
  4: [
    'Write a function to update the text.',
    'Use `document.getElementById("player-text")` to select the text element.',
    'Set `.innerText = "Mission Ready!";` inside your function.'
  ]
};

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  
  // Create stars for background
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(0, width),
      y: random(0, height),
      size: random(1, 3)
    });
  }
  
  // Select DOM elements
  playButton = select('#play-button');
  tutorialButton = select('#tutorial-button');
  aboutButton = select('#about-button');
  challengeScreen = select('#challenge-screen');
  codeEditor = select('#code-editor');
  playerButton = select('#player-button');
  playerLayout = select('#player-layout');
  playerJsButton = select('#player-js-button');
  playerText = select('#player-text');
  submitButton = select('#submit-button');
  nextButton = select('#next-button');
  menuButton = select('#menu-button');
  hintButton = select('#hint-button');
  scoreDisplay = select('#score-display');
  hintDisplay = select('#hint-display');
  aboutScreen = select('#about-screen');
  scoreInput = select('#score');
  formConfirmation = select('#form-confirmation');
  aboutMenuButton = select('#about-menu-button');
  
  // Add click events
  playButton.mousePressed(() => { gameState = 'play'; currentLevel = 1; score = 0; hintCount = 0; resetChallenge(); });
  tutorialButton.mousePressed(() => { gameState = 'tutorial'; });
  aboutButton.mousePressed(() => { gameState = 'about'; scoreInput.value(score); formConfirmation.hide(); });
  submitButton.mousePressed(checkCode);
  nextButton.mousePressed(nextLevel);
  menuButton.mousePressed(() => { gameState = 'menu'; });
  hintButton.mousePressed(showHint);
  aboutMenuButton.mousePressed(() => { gameState = 'menu'; });
  
  // Set up target JS button behavior
  select('#target-js-button').mousePressed(() => alert('Ship Repaired!'));
  
  // Handle form submission
  select('#feedback-form').elt.addEventListener('submit', () => {
    formConfirmation.show();
    setTimeout(() => formConfirmation.hide(), 3000);
  });
}

function draw() {
  background(0); // Black space background
  
  // Draw stars
  for (let star of stars) {
    fill(255);
    noStroke();
    circle(star.x, star.y, star.size);
  }
  
  // Menu screen
  if (gameState === 'menu') {
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text('CodeQuest: Space Coder', width / 2, 150);
    textSize(20);
    text('Learn HTML, CSS, and JavaScript!', width / 2, 200);
    
    playButton.show();
    tutorialButton.show();
    aboutButton.show();
    challengeScreen.hide();
    aboutScreen.hide();
  } else if (gameState === 'play') {
    playButton.hide();
    tutorialButton.hide();
    aboutButton.hide();
    challengeScreen.show();
    aboutScreen.hide();
    
    // Update score display
    scoreDisplay.html(`Score: ${score}`);
    
    fill(255);
    textAlign(LEFT);
    textSize(20);
    if (currentLevel === 1) {
      text('Level 1: Style the button to match the target!', 50, 50);
      playerButton.show();
      playerLayout.hide();
      playerJsButton.hide();
      playerText.hide();
    } else if (currentLevel === 2) {
      text('Level 2: Create a layout with a header and content!', 50, 50);
      playerButton.hide();
      playerLayout.show();
      playerJsButton.hide();
      playerText.hide();
    } else if (currentLevel === 3) {
      text('Level 3: Make the button show an alert when clicked!', 50, 50);
      playerButton.hide();
      playerLayout.hide();
      playerJsButton.show();
      playerText.hide();
    } else if (currentLevel === 4) {
      text('Level 4: Write a function to update the text to "Mission Ready!"', 50, 50);
      playerButton.hide();
      playerLayout.hide();
      playerJsButton.hide();
      playerText.show();
    }
    
    // Apply player's code in real-time
    let code = codeEditor.value();
    if (currentLevel === 1) {
      playerButton.attribute('style', code);
    } else if (currentLevel === 2) {
      playerLayout.html(code);
    } else if (currentLevel === 3) {
      try {
        playerJsButton.elt.onclick = null;
        eval(code);
      } catch (e) {
        console.log('JS Error:', e);
      }
    } else if (currentLevel === 4) {
      try {
        playerText.html('Waiting...');
        eval(code);
        if (typeof updateStatus === 'function') {
          updateStatus();
        }
      } catch (e) {
        console.log('JS Error:', e);
      }
    }
  } else if (gameState === 'about') {
    playButton.hide();
    tutorialButton.hide();
    aboutButton.hide();
    challengeScreen.hide();
    aboutScreen.show();
    
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text('Share Your Feedback!', width / 2, 50);
  } else if (gameState === 'tutorial') {
    playButton.hide();
    tutorialButton.hide();
    aboutButton.hide();
    challengeScreen.hide();
    aboutScreen.hide();
    
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text('Tutorial Screen (Placeholder)', width / 2, height / 2);
  }
}

function checkCode() {
  let code = codeEditor.value().replace(/\s/g, '');
  if (currentLevel === 1) {
    let requiredStyles = [
      'background-color:#4682b4',
      'border-radius:10px',
      'color:#fff'
    ];
    let passed = requiredStyles.every(style => code.includes(style.replace(/\s/g, '')));
    if (passed) {
      alert('Success! You styled the button correctly!');
      score += 100;
      nextButton.show();
    } else {
      alert('Not quite! Make sure your button has the correct background color, border radius, and text color.');
    }
  } else if (currentLevel === 2) {
    let requiredHTML = '<divclass="header">Header</div><divclass="content">Content</div>';
    if (code.includes(requiredHTML.replace(/\s/g, ''))) {
      alert('Success! You created the correct layout!');
      score += 100;
      nextButton.show();
    } else {
      alert('Not quite! Make sure your HTML has a <div> with class="header" and a <div> with class="content".');
    }
  } else if (currentLevel === 3) {
    let passed = false;
    try {
      playerJsButton.elt.onclick = () => {
        alert('Ship Repaired!');
        passed = true;
      };
      playerJsButton.elt.click();
    } catch (e) {
      console.log('JS Error:', e);
    }
    if (passed) {
      alert('Success! The button triggers the correct alert!');
      score += 100;
      nextButton.show();
    } else {
      alert('Not quite! Make sure your code adds an onclick event that shows "Ship Repaired!"');
    }
  } else if (currentLevel === 4) {
    let passed = false;
    try {
      playerText.html('Waiting...');
      eval(codeEditor.value());
      if (typeof updateStatus === 'function') {
        updateStatus();
        if (playerText.html() === 'Mission Ready!') {
          passed = true;
        }
      }
    } catch (e) {
      console.log('JS Error:', e);
    }
    if (passed) {
      alert('Success! The text updated correctly!');
      score += 100;
      if (currentLevel === 4) {
        alert(`Congratulations! You completed all levels with a score of ${score}!`);
        gameState = 'menu';
      } else {
        nextButton.show();
      }
    } else {
      alert('Not quite! Make sure your function updates the text to "Mission Ready!"');
    }
  }
}

function showHint() {
  if (hintCount < 3) {
    hintDisplay.html(hints[currentLevel][hintCount]);
    hintDisplay.show();
    hintCount++;
  } else {
    alert('No more hints available!');
  }
}

function nextLevel() {
  currentLevel++;
  hintCount = 0;
  hintDisplay.hide();
  if (currentLevel > 4) {
    alert(`Congratulations! You completed all levels with a score of ${score}!`);
    gameState = 'menu';
    currentLevel = 1;
    score = 0;
  }
  resetChallenge();
}

function resetChallenge() {
  codeEditor.value('');
  playerButton.attribute('style', '');
  playerLayout.html('');
  playerJsButton.elt.onclick = null;
  playerText.html('Waiting...');
  nextButton.hide();
  hintCount = 0;
  hintDisplay.hide();
}