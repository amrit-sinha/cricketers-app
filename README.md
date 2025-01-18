# Cricket Players Dashboard

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- TanStack Table
- Lucide Icons

## Features

- **Dynamic Data Table**

  - Sortable columns (Name, Age, Rank)
  - Type-based filtering
  - Name search functionality
  - Pagination

- **Player Details**

  - Detailed player information in a slide-up drawer
  - Shows similar players based on player type
  - Displays age, rank, points, and other key statistics

## Project Structure

```
src/
├── components/
│   ├── cricketers/
│   │   ├── page.tsx         # Main page component
│   │   ├── columns.tsx      # Table column definitions
│   │   ├── data-table.tsx   # Reusable table component
│   │   └── PlayerDrawer.tsx # Player details drawer
│   └── ui/                  # UI components from shadcn/ui
├── apis/
│   ├── types.ts             # TypeScript definitions
│   └── get-players.ts       # API integration
├── lib/
│   └── utils.ts             # Utility functions
└── App.tsx                  # Root component
```

## Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

## Time Taken For Completion - 4 Days
