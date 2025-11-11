# Fix Dependencies - Quick Guide

## Step 1: Delete node_modules and package-lock.json

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

**Windows (Command Prompt):**
```cmd
rmdir /s /q node_modules
del package-lock.json
```

**Mac/Linux:**
```bash
rm -rf node_modules package-lock.json
```

## Step 2: Clear npm cache

```bash
npm cache clean --force
```

## Step 3: Install dependencies

```bash
npm install
```

## Step 4: Clear Vite cache

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules\.vite
```

**Mac/Linux:**
```bash
rm -rf node_modules/.vite
```

## Step 5: Restart dev server

```bash
npm run dev
```

## Alternative: Use Yarn

If npm continues to have issues:

```bash
# Install yarn globally
npm install -g yarn

# Install dependencies
yarn install

# Run dev server
yarn dev
```

## If Problem Persists

The 3D components have error boundaries and will show fallback UI (emojis/icons) if they fail to load. The portfolio will still function normally without 3D effects.

You can also temporarily disable 3D by commenting out the 3D component imports in:
- `src/components/Hero.tsx`
- `src/components/About.tsx`  
- `src/components/Skills.tsx`

