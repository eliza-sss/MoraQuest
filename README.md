# MoraQuest 🌸

**MoraQuest** is a cute, gamified learning app built with React and
Supabase. It turns learning into a little adventure where users can
complete quests, take quizzes, earn rewards, and customize their cat
companion.

> Personal portfolio project focused on building an interactive web app
> with authentication, database-backed features, and a responsive
> pink-themed interface.

## Features

-   **User authentication** with Supabase
-   **Quests and quizzes** --- complete learning tests before finishing
    supported quests
-   **Coins and XP** --- earn rewards and progress through levels
-   **Daily activities** --- daily quests and a daily reward
-   **Cat wardrobe and shop** --- purchase and equip cosmetic items
    using coins
-   **Achievements** --- unlock milestones as you progress
-   **Responsive interface** --- layouts adapted for desktop and mobile
    screens
-   **Persistent user progress** --- account-related features use
    Supabase

## Tech Stack

-   **React** --- user interface
-   **JavaScript** --- application logic
-   **CSS** --- responsive styling and pink-themed design
-   **Supabase** --- authentication, database, and server-side
    operations
-   **Vite** --- development server and build tooling *(if this project
    was created with Vite)*

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) and npm
-   A [Supabase](https://supabase.com/) project
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR-USERNAME/MoraQuest.git
cd MoraQuest
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add your Supabase
project URL and publishable/anon key using the variable names expected
by your app.

For example, if your code uses these names:

``` env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

**Important:** Check the Supabase client setup in your project and use
the exact environment variable names it expects. Never commit
`.env.local`, secret API keys, or a Supabase `service_role` key to
GitHub.

### 4. Run the development server

``` bash
npm run dev
```

Open the local URL printed in the terminal.

### 5. Build for production

``` bash
npm run build
```

If your project uses Vite, this creates a production build in the `dist`
directory.

## Supabase Setup Notes

MoraQuest uses Supabase for authentication and database-backed
operations, including quest completion, quiz submissions, and shop
purchases. These features depend on the database schema, Row Level
Security (RLS) policies, and SQL functions/RPCs configured for the
project.

A fresh Supabase project will not automatically contain the required
tables, policies, or functions. Before running the app against a new
database, configure the SQL objects used by the application and verify
the access policies.

## Project Structure

The exact structure may vary, but the main files typically include:

``` text
MoraQuest/
├── src/                 # React source files, if using a src directory
├── public/              # Static assets, if present
├── App.jsx              # Main app component, depending on project structure
├── App.css              # Main styles, depending on project structure
├── package.json         # Dependencies and scripts
├── .env.local           # Local environment variables (do not commit)
└── .gitignore           # Files excluded from Git
```

## Security

-   Keep `.env.local` out of version control.
-   Never expose a Supabase `service_role` key or other secret
    credentials in frontend code.
-   Enable and verify appropriate Row Level Security (RLS) policies for
    user data.
-   Treat client-side checks as user-interface safeguards; enforce
    important permissions and reward logic on the server.

## Roadmap

Potential improvements for future versions:

-   Add a richer activity history and progress analytics
-   Deploy a public demo
-   Improve automated testing and error handling
-   Add project screenshots and a short demo GIF
-   Expand learning content and quiz management

## Screenshots

Screenshots will be added here once the project has been captured in its
final portfolio presentation.

## Author

Created as a personal learning and portfolio project.

------------------------------------------------------------------------

*Built with React and Supabase, with a little pink magic. 💗*
