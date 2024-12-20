### **1. Connect to EC2 Instance**
1. Open your terminal.
2. Use SSH to connect:
   ```bash
   ssh -i "your-key.pem" ec2-user@your-ec2-public-ip
   ```

---

### **2. Navigate to the Project Directory**
1. Change to the directory containing your project:
   ```bash
   cd ~/VTCourseCopilot
   ```

---

### **3. Update the Code**
1. Pull the latest changes from the Git repository:
   ```bash
   git pull
   ```
   If there are conflicts:
   - Commit or stash your changes:
     ```bash
     git add .
     git commit -m "Save local changes"
     ```
     Or stash them:
     ```bash
     git stash
     ```

---

### **4. Rebuild the Frontend**
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the production version:
   ```bash
   npm run build
   ```

---

### **5. Rebuild the Backend**
1. Install Python dependencies (if using FastAPI):
   ```bash
   pip install -r requirements.txt
   ```

---

### **6. Restart Applications with PM2**
1. Restart the **Next.js** (frontend):
   ```bash
   pm2 restart nextjs
   ```
2. Restart the **FastAPI** (backend):
   ```bash
   pm2 restart fastapi
   ```

---

### **7. Restart NGINX (Optional)**
1. Reload the NGINX configuration:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### **8. Test the Deployment**
1. Verify the frontend:
   ```bash
   curl http://127.0.0.1:3000
   ```
2. Verify the backend:
   ```bash
   curl http://127.0.0.1:8000
   ```
3. Test your domain in a browser:
   - Frontend: `http://your-domain.com`
   - Backend API: `http://your-domain.com/api`
