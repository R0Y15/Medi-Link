# Medi-Link Patient Dashboard

A comprehensive medical dashboard built with Next.js, featuring pharmacy management, appointment scheduling, and patient monitoring capabilities.

### **Table of Contents**

1. [Features](#features)
2. [Backend API Requirements](#backend-api-requirements)
3. [Setup Instructions](#setup-instructions)
4. [UI/UX Guidelines](#uiux-guidelines)
5. [Technical Specifications](#technical-specifications)
6. [Out-of-Scope Items](#out-of-scope-items)

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

#### **Testing the Setup**

1. The frontend should show the Medi-Link dashboard
2. The pharmacy page should display medicine data from the JSON Server
3. You should be able to perform CRUD operations on medicines

#### **Troubleshooting**

- If you see a "Failed to fetch data" error, ensure the JSON Server is running
- If environment variables aren't working, restart the Next.js development server
- Clear your browser cache if you see stale data
