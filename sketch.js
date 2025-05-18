let gameState = 'menu';
let stars = [];
let playButton, tutorialButton, aboutButton, challengeScreen, codeEditor, playerButton, submitButton;

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
  submitButton = select('#submit-button');
  
  // Add click events
  playButton.mousePressed(() => { gameState = 'play'; });
  tutorialButton.mousePressed(() => { gameState = 'tutorial'; });
  aboutButton.mousePressed(() => { gameState = 'about'; });
  submitButton.mousePressed(checkCode);
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
    text('Master Coding Skills!', width / 2, 200);
    
    playButton.show();
    tutorialButton.show();
    aboutButton.show();
    challengeScreen.hide();
  } else if (gameState === 'play') {
    playButton.hide();
    tutorialButton.hide();
    aboutButton.hide();
    challengeScreen.show();
    
    fill(255);
    textAlign(LEFT);
    textSize(20);
    text('Challenge: Style the button to match the target!', 50, 50);
    
    // Apply player's CSS in real-time
    let css = codeEditor.value();
    playerButton.attribute('style', css);
  } else {
    playButton.hide();
    tutorialButton.hide();
    aboutButton.hide();
    challengeScreen.hide();
    
    fill(255);
    textAlign(CENTER);
    textSize(30);
    if (gameState === 'tutorial') {
      text('Tutorial Screen (Placeholder)', width / 2, height / 2);
    } else if (gameState === 'about') {
      text('About Screen (Placeholder)', width / 2, height / 2);
    }
  }
}

function checkCode() {
  let css = codeEditor.value();
  let requiredStyles = [
    'background-color: #4682b4',
    'border-radius: 10px',
    'color: #fff'
  ];
  
  let passed = requiredStyles.every(style => css.includes(style.replace(/\s/g, '')));
  
  if (passed) {
    alert('Success! You styled the button correctly!');
  } else {
    alert('Not quite! Make sure your button has the correct background color, border radius, and text color.');
  }
}