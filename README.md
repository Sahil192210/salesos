# E-Commerce D2C Sales OS (PRODUCT 01)

Enterprise Multi-Tenant D2C Sales Operating System with automated RTO fraud detection, WhatsApp abandoned cart recovery, Tally ERP stock synchronization, and Shiprocket fulfillment.

## Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer, ExcelJS, node-cron
- **Deployment**: Ready for Vercel, Railway, or Render

---

## Deploying on Vercel

### Option 1: Deploy Frontend on Vercel (Recommended)
1. Import this repository in [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g. `https://your-backend.railway.app/api`)
4. Click **Deploy**.

### Option 2: Deploy Both Monorepo Roots
A root `vercel.json` is already configured for monorepo routing.

---

## Local Development
1. **Backend**:
   ```bash
   cd backend
   npm install
   node app.js
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

Default Demo Store:
- **Subdomain**: `acme`
- **Email**: `owner@acme.com`
- **Password**: `password123`
