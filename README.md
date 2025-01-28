# Medi-Link Patient Dashboard

A comprehensive medical dashboard built with Next.js, featuring pharmacy management, appointment scheduling, and patient monitoring capabilities.

### **Table of Contents**

1. [Features](#features)
2. [Backend API Requirements](#backend-api-requirements)
3. [Setup Instructions](#setup-instructions)
4. [Deployment](#deployment)
5. [UI/UX Guidelines](#uiux-guidelines)
6. [Technical Specifications](#technical-specifications)
7. [Out-of-Scope Items](#out-of-scope-items)

---

### **Setup Instructions**

#### **Prerequisites**
- Node.js (v18 or higher)
- npm (Node Package Manager)

#### **Installation Steps**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/R0Y15/Medi-Link
   cd Medi-Link
   ```

2. **Install Dependencies**
   ```bash
   # Install project dependencies
   npm install

   # Install JSON Server globally
   npm install -g json-server
   ```

3. **Set Up Environment Variables**
   ```bash
   # Create a .env.local file in the root directory
   touch .env.local

   # Add the following environment variables
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url # Required for Convex backend
   ```

4. **Start the Development Servers**

   a. **Start the JSON Server (Mock Backend)**
   ```bash
   # In one terminal window
   json-server --watch db.json --port 3001
   ```

   b. **Start the Next.js Development Server**
   ```bash
   # In another terminal window
   npm run dev
   ```

5. **Access the Application**
   - Frontend: Open [http://localhost:3000](http://localhost:3000) in your browser
   - Backend API: Available at [http://localhost:3001](http://localhost:3001)

#### **Available Scripts**

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

### **Deployment**

#### **Environment Variables**
When deploying to production, ensure these environment variables are set in your deployment platform:

```bash
NEXT_PUBLIC_API_URL=your_production_api_url
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

#### **Deployment Steps**
1. Set up your Convex backend:
   ```bash
   npx convex dev    # For local development
   npx convex deploy # For production deployment
   ```

2. Configure your deployment platform (e.g., Vercel):
   - Connect your GitHub repository
   - Set the required environment variables
   - Deploy the application

#### **Common Deployment Issues**

1. **Missing Convex URL**
   - Error: "No address provided to ConvexReactClient"
   - Solution: Ensure `NEXT_PUBLIC_CONVEX_URL` is set in your deployment environment

2. **API Connection Issues**
   - Error: "Failed to fetch data"
   - Solution: Verify `NEXT_PUBLIC_API_URL` points to your production API

#### **Testing the Setup**

1. The frontend should show the Medi-Link dashboard
2. The pharmacy page should display medicine data from the JSON Server
3. You should be able to perform CRUD operations on medicines

#### **Troubleshooting**

- If you see a "Failed to fetch data" error, ensure the JSON Server is running
- If environment variables aren't working, restart the Next.js development server
- Clear your browser cache if you see stale data
- For deployment issues, verify all environment variables are correctly set in your deployment platform
