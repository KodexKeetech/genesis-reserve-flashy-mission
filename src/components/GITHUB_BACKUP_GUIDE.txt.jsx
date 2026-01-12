================================================================================
PORTAL TO NODEHAVEN - GITHUB BACKUP GUIDE
================================================================================

Base44 doesn't have direct GitHub integration, but here's how to backup manually:

STEP 1: CREATE GITHUB REPOSITORY
---------------------------------
1. Go to https://github.com/new
2. Repository name: "portal-to-nodehaven"
3. Description: "Space platformer game with robot wizard Jeff"
4. Choose Public or Private
5. Click "Create repository"


STEP 2: SETUP LOCAL REPO
-------------------------
In your terminal:

git clone https://github.com/YOUR_USERNAME/portal-to-nodehaven.git
cd portal-to-nodehaven


STEP 3: CREATE PROJECT STRUCTURE
---------------------------------
mkdir -p entities pages components/game components/game/levels components/ui


STEP 4: COPY FILES FROM BASE44
-------------------------------
Open each file in Base44 dashboard and copy to your local folder:

ENTITIES (1 file):
  entities/GameProgress.json

PAGES (5 files):
  pages/Home.jsx
  pages/Game.jsx
  pages/UpgradeShop.jsx
  pages/AbilityShop.jsx
  pages/LevelSelect.jsx

ROOT:
  Layout.js

GAME COMPONENTS (17 files):
  components/game/GameEngine.jsx
  components/game/CloudSaveManager.jsx
  components/game/BiomeConfig.jsx
  components/game/BackgroundRenderer.jsx
  components/game/EnemyRenderer.jsx
  components/game/ParticleEffects.jsx
  components/game/GameUI.jsx
  components/game/GameOverlay.jsx
  components/game/AbilitySystem.jsx
  components/game/SoundManager.jsx
  components/game/BackgroundCanvas.jsx
  components/game/TouchControls.jsx
  components/game/useGamepad.jsx
  components/game/SettingsMenu.jsx
  components/game/ControlsConfig.jsx
  components/game/ComicAdOverlay.jsx

LEVEL COMPONENTS (30+ files in components/game/levels/):
  All Level backgrounds and configs


STEP 5: CREATE README
----------------------
Create README.md:

# Portal to Nodehaven

Space platformer game featuring Jeff the Robot Wizard.

## Features
- 30 levels across 10 biomes
- Cloud save system
- Upgrade & ability shops
- Boss fights
- Mobile & gamepad support

## Tech Stack
- React
- Base44 (Backend & Database)
- Canvas API
- Tailwind CSS

## Play
Visit: [Your Base44 app URL]


STEP 6: COMMIT AND PUSH
-----------------------
git add .
git commit -m "Initial commit - Portal to Nodehaven game"
git push origin main


STEP 7: FUTURE UPDATES
----------------------
Whenever you make changes in Base44:
1. Copy updated files to local repo
2. git add .
3. git commit -m "Update: description of changes"
4. git push

================================================================================
YOUR GITHUB REPO WILL BE: https://github.com/YOUR_USERNAME/portal-to-nodehaven
================================================================================