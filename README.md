# Poll Pulse

Poll Pulse is an AI-assisted polling web application that helps users create polls, collect responses, and view voting results from one clean dashboard. **Now with full authentication and database-backed polls!**

## What the App Does

Poll Pulse allows users to:

* **Create an account** with secure signup/login
* **Create polls** with multiple options
* **Vote on polls** with real-time result updates
* **View poll statistics** (votes, percentages, status)
* **Manage polls** (update or delete your own polls)
* **Track results** with live vote counts and percentages
* **Secure sessions** with JWT authentication

## Who It Is For

Poll Pulse is designed for:

* **Students** who want to collect quick opinions from classmates
* **Teams** who need fast decision-making polls
* **Communities** that want simple voting and feedback
* **Event organizers** who want to understand audience preferences
* **Educators** who want interactive engagement tools

## Core Screens

### 1. Authentication Screen

Users sign up or log in with email and password. Passwords are securely hashed with bcryptjs.

### 2. Poll Dashboard

The main authenticated screen shows:
- Active polls count
- Total votes across all polls
- List of all current polls
- Quick access to create new polls
- Real-time vote updates

### 3. Create Poll Screen

Users can:
- Enter a poll question
- Add multiple answer options (minimum 2)
- Submit to create poll in database
- See it appear instantly on dashboard

### 4. Poll Results Screen

Each poll displays:
- Question and current status
- Options with vote counts
- Percentage bar for each option
- Total votes collected
- Vote button to participate

## Current Features ✅

### Authentication
- [x] User signup with email validation
- [x] Secure password hashing (bcryptjs)
- [x] User login with credentials
- [x] JWT token generation (7-day expiry)
- [x] HTTP-only cookie storage
- [x] Logout functionality

### Polls CRUD
- [x] Create polls (authenticated users)
- [x] Read all polls (public)
- [x] Read specific poll (public)
- [x] Update poll (owner only)
- [x] Delete poll (owner only)
- [x] Vote on polls (anonymous)

### Dashboard Features
- [x] User greeting with name
- [x] Real-time poll statistics
- [x] Create new poll form
- [x] Live vote counting
- [x] Percentage calculations
- [x] Poll status display
- [x] Logout button

### Database
- [x] MongoDB Atlas integration
- [x] User model with validation
- [x] Poll model with options
- [x] Automatic timestamps
- [x] Owner relationship tracking

## Data Shape

```typescript
type User = {
  _id: string;
  email: string;
  name: string;
  password: string; // hashed
  createdAt: Date;
};

type PollOption = {
  _id: string;
  text: string;
  votes: number;
};

type Poll = {
  _id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: "active" | "closed";
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
};
```

## Tech Stack

* **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
* **Backend**: Next.js API Routes
* **Database**: MongoDB Atlas (cloud)
* **Authentication**: JWT + bcryptjs
* **Deployment**: Vercel or Docker
* **Development**: Node.js, npm

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Polls
- `GET /api/polls` - List all polls
- `POST /api/polls` - Create new poll (auth required)
- `GET /api/polls/[id]` - Get specific poll
- `PUT /api/polls/[id]` - Update poll (owner only)
- `DELETE /api/polls/[id]` - Delete poll (owner only)
- `POST /api/polls/[id]/vote` - Vote on poll option

## Project Structure

```
Poll-Pulse/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── polls/              # Polls endpoints
│   │       ├── route.ts        # GET all, POST create
│   │       └── [id]/           # Individual poll routes
│   │           ├── route.ts    # GET, PUT, DELETE
│   │           └── vote/route.ts
│   ├── page.tsx                # Main dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── LoginForm.tsx           # Login form
│   ├── SignupForm.tsx          # Signup form
│   ├── CreatePollForm.tsx      # Poll creation
│   └── PollCard.tsx            # Poll display + voting
├── hooks/
│   └── useAuth.ts              # Auth state management
├── lib/
│   ├── db.ts                   # MongoDB connection
│   ├── auth.ts                 # JWT utilities
│   └── models/
│       ├── User.ts             # User schema
│       └── Poll.ts             # Poll schema
├── Dockerfile                  # Docker build config
├── vercel.json                 # Vercel deployment config
├── .env.example                # Environment template
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Poll-Pulse.git
cd Poll-Pulse

# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local

# Edit .env.local with your:
# MONGODB_URI=your-mongodb-connection-string
# JWT_SECRET=your-secret-key
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and:
1. Sign up for a new account
2. Create a poll
3. Vote on polls
4. See real-time results

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Go to vercel.com
# Import your repository
# Add environment variables:
#   MONGODB_URI
#   JWT_SECRET
# Click Deploy
```

### Deploy with Docker

```bash
docker build -t poll-pulse .
docker run -p 3000:3000 \
  -e MONGODB_URI="..." \
  -e JWT_SECRET="..." \
  poll-pulse
```

## Testing

### API Testing
See `API_TESTING_GUIDE.md` for:
- cURL examples for all endpoints
- Browser console testing
- Workflow examples

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Try duplicate email (should fail)
- [ ] Login with correct password
- [ ] Login with wrong password (should fail)
- [ ] Create a poll
- [ ] Vote on poll (multiple times to verify count)
- [ ] See results update in real-time
- [ ] Update poll (change question, close it)
- [ ] Delete poll
- [ ] Logout and verify session cleared

## Documentation

- **`DEPLOYMENT.md`** - Detailed deployment instructions
- **`API_TESTING_GUIDE.md`** - API examples and testing
- **`DEPLOYMENT_CHECKLIST.md`** - Pre/post deployment checklist
- **`DAY2_SUMMARY.md`** - Implementation overview

## Development Rule

The app remains runnable after every change. Features are added screen by screen with clear data shapes and tested UI before adding complex logic.

## Current Status

✅ **Day 2 Complete**: Full authentication and CRUD implementation
- User authentication with JWT
- Database-backed polls with CRUD operations
- Real-time voting and result updates
- Production-ready deployment configs

✅ **Day 3 Complete**: AI-powered features
- LLM provider: Groq
- SDK: groq-sdk
- Secret handling: GROQ_API_KEY in env
- API route: `/api/ai`
- Feature: AI chatbox sends text and receives real AI response

## Future Features (Day 3+)

* Add AI-generated poll suggestions using Groq
* Implement real-time updates with WebSockets
* Add poll templates and categories
* Create user profiles with poll history
* Add poll analytics and insights
* Implement poll sharing and embeds
* Add commenting on polls
* Support for image/media polls

## Security

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies for CSRF protection
- ✅ Email validation on signup
- ✅ Owner-only poll updates and deletes
- ✅ Input validation on all endpoints
- ✅ Type-safe TypeScript throughout

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - Feel free to use this project for learning or as a starter template.

## Support

For questions or issues:
- Check `DEPLOYMENT_CHECKLIST.md` for common problems
- Review `API_TESTING_GUIDE.md` for endpoint examples
- See `NEW_REPO_SETUP.md` for setup instructions

---

**Built with ❤️ for quick, easy polling**

Poll Pulse helps you gather feedback instantly. No accounts. No fees. Just pure polling power.
