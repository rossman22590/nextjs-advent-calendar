# Google OAuth Setup Instructions

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if you haven't already:
   - Choose "External" user type
   - Fill in the required app information
   - Add your email to test users
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

## Step 2: Update Environment Variables

Add these variables to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

To generate a NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

Or on Windows PowerShell:
```powershell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Step 3: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

### Login Flow (Existing Users)
- **Login Page**: Google sign-in button is available
- **Existing Users**: Can login with Google OAuth directly (no invite code required)
- **New Users**: If trying to login with Google without existing account:
  - Redirected back to login page with error message
  - Error modal shows "You don't have an account yet. Please register with an invite code first."
  - Modal has "Go to Register" button to direct them to registration flow

### Registration Flow (New Users)
- **Register Page**: Google sign-up button only appears after entering a valid invite code
- **Invite Code Validation**: Code is validated in real-time as user types
- **Invite Code Cookie**: When clicking "Sign up with Google", the invite code is stored in a secure HTTP-only cookie for 5 minutes
- **OAuth Registration**: During Google OAuth callback, the system checks:
  - If user exists → Allow login and create session
  - If user is new AND has valid invite code cookie → Create account and login
  - If user is new WITHOUT valid invite code cookie → Redirect to login with "not registered" error
- **Session**: After successful Google registration/login, a session is created using the existing session system

### Security Features
1. **No Account Bypass**: New users CANNOT create accounts via Google OAuth without a valid invite code
2. **Login Protection**: Unregistered users trying to login with Google are blocked and directed to register
3. **Short-lived Cookie**: The invite code cookie expires in 5 minutes
4. **HTTP-only Cookie**: Cannot be accessed via JavaScript (XSS protection)
5. **One-time Use**: Cookie is deleted after successful account creation
6. **Existing User Login**: Users who already have accounts can login with Google without invite code
7. **Clear Error Messages**: Users get helpful error messages directing them to the correct flow
