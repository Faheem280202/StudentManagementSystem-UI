# Student Management System — UI

React frontend for the SMS platform. Built with Vite + React 18.

## Quick Start

```bash
cd sms-ui
npm install
cp .env.example .env.local   # then edit VITE_API_BASE_URL
npm run dev
```

Opens at http://localhost:5173

## Theme & Branding

To change the school identity (name, colors, fonts) — **edit one file**:

```
src/theme/index.js
```

Every page, component, and color in the entire app derives from that single file.

## Project Structure

```
src/
├── theme/
│   └── index.js          ← ✦ CHANGE SCHOOL IDENTITY HERE
├── context/
│   └── AuthContext.jsx   ← JWT auth state
├── services/
│   └── api.js            ← all API calls
├── hooks/
│   └── index.js          ← useAsync, useDisclosure, useToast
├── components/
│   ├── common/
│   │   └── index.jsx     ← Button, Input, Table, Modal, Badge, Avatar...
│   └── layout/
│       ├── AppShell.jsx  ← top header
│       └── Sidebar.jsx   ← navigation sidebar
├── pages/
│   ├── Auth/
│   │   └── LoginPage.jsx
│   ├── Dashboard/
│   │   └── DashboardPage.jsx
│   └── Users/
│       └── UsersPage.jsx
└── styles/
    └── global.css        ← all styles, driven by CSS variables
```

## Adding a New Menu Item

In `src/components/layout/Sidebar.jsx`, add to `NAV_ITEMS`:

```js
{
  key:   "classes",
  label: "Classes",
  path:  "/classes",
  icon:  <YourIcon />,
  roles: ["Admin", "Teacher"],
},
```

Then add a case in `src/App.jsx` switch and create the page component.

## Role-based Access

| Role    | Can Create Users  | Sees in Users table        |
|---------|-------------------|----------------------------|
| Admin   | All roles         | All users                  |
| Teacher | Student + Parent  | Their students & parents   |
| Student | —                 | Their own parents          |
| Parent  | —                 | Their children             |
