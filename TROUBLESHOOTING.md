# Troubleshooting Guide

## React Three Fiber / ConcurrentRoot Error

If you're seeing this error:
```
Uncaught SyntaxError: The requested module '/node_modules/react-reconciler/constants.js' does not provide an export named 'ConcurrentRoot'
```

### Solution 1: Clean Install Dependencies

1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   # On Windows:
   # rmdir /s node_modules
   # del package-lock.json
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

4. Restart the dev server:
   ```bash
   npm run dev
   ```

### Solution 2: Update Node.js

Make sure you're using Node.js 18+:
```bash
node --version
```

If not, update Node.js from [nodejs.org](https://nodejs.org/)

### Solution 3: Check Vite Cache

1. Delete Vite cache:
   ```bash
   rm -rf node_modules/.vite
   # On Windows:
   # rmdir /s node_modules\.vite
   ```

2. Restart the dev server

### Solution 4: Use Yarn or pnpm

If npm is causing issues, try using yarn or pnpm:

**With Yarn:**
```bash
yarn install
yarn dev
```

**With pnpm:**
```bash
pnpm install
pnpm dev
```

### Solution 5: Temporarily Disable 3D Components

If the issue persists, the 3D components have error boundaries and will show fallback UI. The portfolio will still work without 3D effects.

To completely disable 3D components, you can comment them out in:
- `src/components/Hero.tsx`
- `src/components/About.tsx`
- `src/components/Skills.tsx`

## Other Common Issues

### Port Already in Use

If you get a "port already in use" error:
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Supabase Connection Issues

1. Check your `.env` file has the correct Supabase URL and anon key
2. Verify your Supabase project is active
3. Check browser console for CORS errors
4. Verify RLS policies are set correctly

### EmailJS Not Working

1. Verify EmailJS credentials in `.env` or admin settings
2. Check that your email template has the correct variable names:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
3. Test your EmailJS service directly on emailjs.com

### Build Errors

If you get build errors:
1. Check TypeScript errors: `npm run build`
2. Check linting errors: `npm run lint`
3. Make sure all environment variables are set
4. Verify all dependencies are installed

## Getting Help

If none of these solutions work:
1. Check the browser console for detailed error messages
2. Check the terminal for build errors
3. Verify all dependencies are compatible
4. Try creating a fresh clone and starting over

