# Kairo — The Intelligent Planner for Students

Kairo is a personalized AI-powered calendar application built specifically for middle school, high school, and early college students. It helps students manage their academic workload by intelligently distributing assignments and responsibilities across their available time.

## Features

- Smart Assignment Weighting
- Personalized Daily Task Plans
- Class & Teacher Profiles
- Intelligent Rescheduling
- Task Insights
- Integrated Personal Schedule
- Simple, Distraction-Free Design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kairo.git
cd kairo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your database credentials and other configuration.

5. Set up the database:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Database Migrations

To create a new migration after modifying the schema:

```bash
npx prisma migrate dev --name your_migration_name
```

### Type Generation

After modifying the Prisma schema:

```bash
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ for students everywhere
- Inspired by the need for better academic planning tools
- Thanks to all contributors and supporters 