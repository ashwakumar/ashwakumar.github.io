# Backend Setup Instructions

## Email Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
3. **Create .env file** (copy from .env.example)
4. **Configure environment variables**:
   ```
   EMAIL_USER=ashwanikjangir@gmail.com
   EMAIL_APP_PASSWORD=your-16-character-app-password
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080
   SESSION_SECRET=random-string-here
   ```

## Installation & Running

```bash
cd backend
npm install
npm start
```

## Frontend Integration

Update your contact form in `contact.html` to submit to `http://localhost:3000/api/contact`

## Security Features

- Rate limiting (5 requests per 15 minutes per IP)
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- XSS protection

## Email Features

- Professional HTML email formatting
- Automatic reply to form submitter
- Detailed notification to your email
- Form data validation
