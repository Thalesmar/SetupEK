# SetupEK

A gaming peripherals e-commerce platform.

## Structure
- \rontend\: React + Vite + TypeScript (Deployed on Vercel)
- \ackend\: Express + TypeScript (Deployed on Railway)

## Deployment

### Frontend (Vercel)
1. Set the Root Directory to \rontend\.
2. Add environment variable \VITE_API_URL\ pointing to your backend URL (e.g., \https://your-backend.railway.app/api\).

### Backend (Railway)
1. Set the Root Directory to \ackend\.
2. Ensure environment variables are set (e.g., \JWT_SECRET\).
3. Railway will use the \uild\ and \start\ scripts in \ackend/package.json\.
