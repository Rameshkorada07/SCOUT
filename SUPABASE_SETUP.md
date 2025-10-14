# Supabase Waitlist Integration

## Overview
The waitlist form on `/join-waitlist` is now connected to Supabase database.

## Database Setup

### Table: `waitlist`
- **id**: UUID (auto-generated primary key)
- **name**: Text (required)
- **email**: Text (required, unique)
- **created_at**: Timestamp (auto-generated)
- **updated_at**: Timestamp (auto-updated)

### Security
- Row Level Security (RLS) is enabled
- Public can insert new entries (join waitlist)
- Public can read entries (for future admin dashboard)

## Environment Variables

The `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

⚠️ **Note**: The `.env` file is in `.gitignore` to protect credentials.

## Features Implemented

1. ✅ Form submission saves to Supabase
2. ✅ Duplicate email detection (shows error toast)
3. ✅ Loading state during submission
4. ✅ Success/error notifications using Sonner toast
5. ✅ Email normalization (trimmed, lowercase)
6. ✅ Name trimming

## Testing

1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:8080/join-waitlist
3. Fill in name and email
4. Submit the form
5. Check for success message or error

## View Waitlist Entries

You can view entries in the Supabase dashboard or query directly:

```sql
SELECT * FROM public.waitlist ORDER BY created_at DESC;
```

## Future Enhancements

- [ ] Admin dashboard to view all waitlist entries
- [ ] Export waitlist to CSV
- [ ] Email confirmation/verification
- [ ] Dynamic waitlist counter (currently hardcoded at 765/1000)
- [ ] Analytics tracking

