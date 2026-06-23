# Deployment Guide

## Day 2 Implementation

### What's New

This update includes:
- **JWT Authentication**: Secure signup and login system
- **Polls CRUD**: Full Create, Read, Update, Delete functionality
- **MongoDB Integration**: Cloud database for persistence
- **Protected Routes**: Authenticated endpoints for polls
- **Deploy Config**: Docker and Vercel configurations

### Prerequisites

1. **MongoDB Atlas Account**
   - Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user with a strong password
   - Get your connection string

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your MongoDB URI and JWT secret

### Local Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# Run development server
npm run dev
```

Visit `http://localhost:3000` and sign up for an account.

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Day 2: Add authentication and polls CRUD"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate a strong random string

3. **Deploy**
   - Click "Deploy" and wait for the build to complete

### Deploy with Docker

```bash
# Build image
docker build -t poll-pulse .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret" \
  poll-pulse
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account
- `POST /api/auth/logout` - Logout

#### Polls
- `GET /api/polls` - List all polls
- `POST /api/polls` - Create new poll (requires auth)
- `GET /api/polls/[id]` - Get specific poll
- `PUT /api/polls/[id]` - Update poll (owner only)
- `DELETE /api/polls/[id]` - Delete poll (owner only)
- `POST /api/polls/[id]/vote` - Vote on poll option

### Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── polls/
│   │       ├── route.ts
│   │       └── [id]/
│   │           ├── route.ts
│   │           └── vote/route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   ├── CreatePollForm.tsx
│   └── PollCard.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── models/
│       ├── User.ts
│       └── Poll.ts
├── Dockerfile
├── vercel.json
└── .env.example
```

### Testing

1. **Sign up** for a new account
2. **Create a poll** with multiple options
3. **Vote** on the poll options
4. **View results** with percentages
5. **Close the poll** (update status)
6. **Delete the poll** (owner only)

### Next Steps (Day 3)

- Add AI-powered poll suggestions with Groq
- Real-time polling with WebSockets
- Advanced filtering and search
- User profiles and poll history
