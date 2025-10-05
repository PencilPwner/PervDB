
```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

## Database Access

The application uses SQLite for data storage. You can access the data in several ways:

- **API Endpoint**: `GET /api/people` - Returns all records as JSON
- **API Export**: `GET /api/people/export` - Returns formatted export with metadata
- **Database File**: `./db/dev.db` - SQLite database file
- **Prisma Studio**: Run `npx prisma studio` for visual database browser

## Export/Import

### Export Options
- **PNG**: Export current form as image
- **JSON**: Export current form data
- **Export All**: Export all database records

### Import
- **JSON**: Import person records from JSON files

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   │   └── people/     # People database API
│   └── page.tsx        # Main application page
├── components/         # React components
│   └── ui/            # shadcn/ui components
├── lib/               # Utility functions
└── hooks/             # Custom React hooks
```

## Data Format

Person records include:
- Photo (base64 encoded)
- Name (Last,First format)
- Address
- Phone number
- Married to
- Status (contacted/uncontacted)