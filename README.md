CodeQuest: Space Coder
A web-based educational game to teach HTML, CSS, and JavaScript through interactive coding challenges. Built with HTML, CSS, and p5.js, deployed on Netlify.
Features

Four levels teaching CSS styling, HTML structure, JS events, and JS functions.
Hints system to guide learners.
Feedback form using Netlify Forms.
Accessible design with ARIA attributes and keyboard navigation.
Professional UI/UX inspired by Google's Material Design.

Setup

Clone the repository:git clone <your-repo-url>
cd CodeQuestGame


Install dependencies (if using build tools):npm install


Run locally with VSCode Live Server or a local server:npx http-server


Open http://localhost:8080 in your browser.

Deployment

Deployed on Netlify with continuous deployment from the main branch.
Configure in Netlify:
Branch: main
Publish directory: .
Environment variables: GAME_VERSION=1.0.0, API_BASE_URL=https://api.example.com


View forms in Netlify dashboard (Forms > Submissions).

Development

Code style follows Google HTML/CSS/JS Style Guides.
Use 2-space indentation, camelCase for JS, kebab-case for CSS.
Run npm run build to minify assets (if configured).

License
MIT License
