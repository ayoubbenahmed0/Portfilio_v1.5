# Modern Portfolio Website

A modern, animated, database-powered portfolio website with an integrated admin dashboard, 3D effects, and smooth UI/UX.

## Features

- 🎨 Modern, animated UI with Framer Motion
- 🌐 3D graphics with React Three Fiber
- 🔐 Admin dashboard with Supabase authentication
- 📊 Real-time database with Supabase
- 📧 Contact form with EmailJS integration
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- ⚡ Optimized performance with React Query
- 🎯 Type-safe with TypeScript

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Drei
- **Icons**: Lucide React
- **State Management**: React Query + Context API
- **Database**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Email**: EmailJS
- **Routing**: React Router

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create the database tables:

```sql
-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  technologies TEXT[] DEFAULT '{}',
  github TEXT,
  demo TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER CHECK (level BETWEEN 0 AND 100) NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Social Links table
CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Contact Info table
CREATE TABLE contact_info (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  bgColor TEXT,
  borderColor TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  emailjs_service_id TEXT,
  emailjs_template_id TEXT,
  emailjs_public_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default settings
INSERT INTO settings (id, theme) VALUES (1, 'dark');

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated write)
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated write access" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Authenticated write access" ON skills FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON social_links FOR SELECT USING (true);
CREATE POLICY "Authenticated write access" ON social_links FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Authenticated write access" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON settings FOR SELECT USING (true);
CREATE POLICY "Authenticated write access" ON settings FOR ALL USING (auth.role() = 'authenticated');
```

3. Set up authentication in Supabase:
   - Go to Authentication > Settings
   - Enable Email/Password authentication
   - Create an admin user

### 4. EmailJS Setup

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Get your service ID, template ID, and public key
5. Add them to your `.env` file

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard
4. The `_redirects` file will handle SPA routing

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

## Admin Dashboard

Access the admin dashboard at `/admin/login`. Use your Supabase authentication credentials to log in.

The admin dashboard allows you to:
- View statistics
- Manage projects (CRUD)
- Manage skills (CRUD)
- Manage social links (CRUD)
- Edit contact information
- Configure settings

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── admin/          # Admin dashboard components
  │   └── 3D/            # 3D components
  ├── context/            # React context providers
  ├── hooks/              # Custom React hooks
  ├── utils/              # Utility functions
  ├── config/             # Configuration files
  ├── types/              # TypeScript types
  ├── App.tsx             # Main app component
  └── main.tsx            # Entry point
```

## License

MIT

