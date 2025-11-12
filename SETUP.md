            # Setup Guide

## Prerequisites

- Node.js 18+ and npm
- A Supabase account
- An EmailJS account (optional, for contact form)

## Step 1: Clone and Install

```bash
npm install
```

## Step 2: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=https://kzkqlylibmkcwkkmpugt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6a3FseWxpYm1rY3dra21wdWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzQ3MjksImV4cCI6MjA3ODM1MDcyOX0.t2xgqqrQgcLV72E5zXpxWLyZEvSKUsPAQ1syaWGadpM
VITE_EMAILJS_SERVICE_ID=service_48ams9f
VITE_EMAILJS_TEMPLATE_ID=template_pgyr115
VITE_EMAILJS_PUBLIC_KEY=4dZJCDcp6anscSSmL
```

## Step 3: Supabase Setup

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Settings > API to get your project URL and anon key

### 3.2 Create Database Tables

1. Go to the SQL Editor in your Supabase dashboard
2. Run the SQL script from `supabase/schema.sql`
3. This will create all necessary tables and set up Row Level Security (RLS)

### 3.3 Set Up Authentication

1. Go to Authentication > Settings
2. Enable Email/Password authentication
3. Create an admin user:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter an email and password
   - This will be your admin login credentials

### 3.4 Configure RLS Policies

The SQL script already sets up RLS policies, but verify they are working:
- Public users can read all data (projects, skills, social links, contact info, settings)
- Only authenticated users can create, update, or delete data

## Step 4: EmailJS Setup (Optional)

If you want to enable the contact form:

1. Go to [emailjs.com](https://www.emailjs.com/) and create an account
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Email subject
   - `{{message}}` - Email message
4. Get your Service ID, Template ID, and Public Key
5. Add them to your `.env` file

Alternatively, you can configure EmailJS later in the admin dashboard under Settings.

## Step 5: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Step 6: Access Admin Dashboard

1. Navigate to `http://localhost:5173/admin/login`
2. Log in with your Supabase admin credentials
3. Start adding your projects, skills, and other content

## Step 7: Initial Data Setup

### Add Contact Info

1. Go to Admin Dashboard > Contact Info
2. Add your contact information (Email, Phone, Location, Availability)
3. You can customize colors and icons for each contact card

### Add Social Links

1. Go to Admin Dashboard > Social Links
2. Add your social media profiles (GitHub, LinkedIn, Twitter, etc.)
3. Use emojis or icons for the icon field

### Add Skills

1. Go to Admin Dashboard > Skills
2. Add your skills with categories (Frontend, Backend, Tools, Other)
3. Set proficiency levels (0-100)
4. Add icons (emojis work great)

### Add Projects

1. Go to Admin Dashboard > Projects
2. Add your projects with:
   - Title and description
   - Image URL (or upload to Supabase Storage)
   - Technologies used
   - GitHub and demo links
   - Featured flag

### Configure Settings

1. Go to Admin Dashboard > Settings
2. Set your theme preference
3. Configure EmailJS settings if you haven't added them to `.env`

## Step 8: Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Step 9: Deploy

### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`
4. Add environment variables in Netlify dashboard

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

## Troubleshooting

### Supabase Connection Issues

- Verify your Supabase URL and anon key are correct
- Check that RLS policies are set up correctly
- Ensure your tables exist and have the correct structure

### EmailJS Not Working

- Verify your EmailJS credentials are correct
- Check that your email template has the correct variable names
- Ensure EmailJS service is activated

### 3D Components Not Loading

- Check browser console for errors
- Ensure you have a modern browser with WebGL support
- 3D components are lazy-loaded, so they may take a moment to appear

### Authentication Issues

- Verify your admin user exists in Supabase
- Check that email/password authentication is enabled
- Ensure RLS policies allow authenticated users to write data

## Next Steps

- Customize the theme colors in `src/config/theme.ts`
- Add your own 3D models or modify existing ones
- Customize animations in `src/utils/motion.ts`
- Add more sections or components as needed
- Set up CI/CD with GitHub Actions
- Add analytics and monitoring

## Support

For issues or questions, please check the README.md or create an issue in the repository.

