// Game logic utilities for CodeQuest: Space Coder

// Hint data for each level
const hints = {
  1: [
    "Use CSS to change the button's appearance.",
    "Try setting `background-color: #4682b4;`.",
    "Add `border-radius: 10px;` and `color: #fff;` to match the target."
  ],
  2: [
    "Use HTML `<div>` tags with specific classes.",
    "Create a `<div class=\"header\">Header</div>`.",
    "Add a `<div class=\"content\">Content</div>` below the header."
  ],
  3: [
    "Add an `onclick` event to the button.",
    "Use `document.getElementById(\"player-js-button\")` to select the button.",
    "Set `.onclick = () => alert(\"Ship Repaired!\");` to show the alert."
  ],
  4: [
    "Write a function to update the text.",
    "Use `document.getElementById(\"player-text\")` to select the text element.",
    "Set `.innerText = \"Mission Ready!\";` inside your function."
  ]
};

// Safely evaluate JavaScript code
function safeEval(code, context) {
  try {
    const func = new Function(`with (this) { ${code} }`);
    func.call(context);
    return true;
  } catch (error) {
    console.log("SafeEval Error:", error);
    return false;
  }
}

// Check code for each level
function checkCode(level, code, elements) {
  const normalizedCode = code.replace(/\s/g, "");
  if (level === 1) {
    const requiredStyles = [
      "background-color:#4682b4",
      "border-radius:10px",
      "color:#fff"
    ];
    return requiredStyles.every((style) =>
      normalizedCode.includes(style.replace(/\s/g, ""))
    );
  } else if (level === 2) {
    const requiredHTML = '<divclass="header">Header</div><divclass="content">Content</div>';
    return normalizedCode.includes(requiredHTML.replace(/\s/g, ""));
  } else if (level === 3) {
    let passed = false;
    try {
      elements.playerJsButton.elt.onclick = () => {
        alert("Ship Repaired!");
        passed = true;
      };
      elements.playerJsButton.elt.click();
    } catch (error) {
      console.log("JS Error:", error);
    }
    return passed;
  } else if (level === 4) {
    elements.playerText.html("Waiting...");
    const context = { updateStatus: null };
    safeEval(code, context);
    if (typeof context.updateStatus === "function") {
      context.updateStatus();
      return elements.playerText.html() === "Mission Ready!";
    }
    return false;
  }
  return false;
}

// Apply code in real-time
function applyCode(level, code, elements) {
  if (level === 1) {
    elements.playerButton.attribute("style", code);
  } else if (level === 2) {
    elements.playerLayout.html(code);
  } else if (level === 3) {
    safeEval(code, { document: { getElementById: () => elements.playerJsButton.elt } });
  } else if (level === 4) {
    elements.playerText.html("Waiting...");
    safeEval(code, {
      document: {
        getElementById: () => ({ innerText: elements.playerText.html(), set innerText(value) { elements.playerText.html(value); } })
      }
    });
  }
}

// Get hint for current level
function getHint(level, hintCount) {
  return hintCount < 3 ? hints[level][hintCount] : null;
}