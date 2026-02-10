# 🚀 YashoTech Fest 2K26 — Oracle Cloud Free Deployment Guide

> **Goal**: Deploy your website on Oracle Cloud **forever free** — no sleeping, no charges.

---

## 📋 What You'll Get

| Component | Where | Cost |
|-----------|-------|------|
| Frontend (React) | Oracle Cloud VM | ₹0 |
| Backend (Node.js) | Oracle Cloud VM | ₹0 |
| Database (MySQL) | Oracle Cloud VM | ₹0 |

---

## STEP 1: Create Oracle Cloud Account

1. Go to **[cloud.oracle.com/free](https://www.oracle.com/cloud/free/)**
2. Click **"Start for Free"**
3. Fill your details:
   - Name, Email
   - Country: **India**
   - Home Region: Choose **AP Mumbai 1 (ap-mumbai-1)** — closest to you
4. **Credit/Debit card required** for verification only — **you will NOT be charged**
5. Complete sign-up and verify your email

> ⚠️ **IMPORTANT**: Choose `Always Free` resources only. Never upgrade to paid.

---

## STEP 2: Create a Free VM Instance

1. Log in to Oracle Cloud Console: **[cloud.oracle.com](https://cloud.oracle.com)**
2. Click **☰ Menu → Compute → Instances**
3. Click **"Create Instance"**
4. Configure:
   - **Name**: `yashotech-server`
   - **Image**: Change to **Ubuntu 22.04** (click "Change Image" → Ubuntu)
   - **Shape**: Choose **VM.Standard.E2.1.Micro** (Always Free) — 1 CPU, 1 GB RAM
   - **Networking**: Use defaults (public subnet, assign public IP)
   - **SSH Key**: Click **"Generate a key pair"** → **Download both keys** (save them safely!)
5. Click **"Create"**
6. Wait 2-3 minutes for the VM to be **RUNNING**
7. Note down the **Public IP Address** (e.g., `129.154.xxx.xxx`)

---

## STEP 3: Open Firewall Ports

Your website needs ports **80** (HTTP), **443** (HTTPS), and **5001** (backend API).

### A. Oracle Cloud Security List

1. Go to **☰ Menu → Networking → Virtual Cloud Networks**
2. Click your VCN → Click your **Public Subnet** → Click the **Security List**
3. Click **"Add Ingress Rules"** and add these rules:

| Source CIDR | Protocol | Destination Port | Description |
|-------------|----------|-----------------|-------------|
| `0.0.0.0/0` | TCP | `80` | HTTP |
| `0.0.0.0/0` | TCP | `443` | HTTPS |
| `0.0.0.0/0` | TCP | `5001` | Backend API |

### B. Ubuntu Firewall (after you SSH in — do this in Step 4)

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5001 -j ACCEPT
sudo netfilter-persistent save
```

---

## STEP 4: Connect to Your VM via SSH

### From Windows (PowerShell):

```powershell
# Navigate to the folder where you saved the SSH key
ssh -i <your-private-key.key> ubuntu@<YOUR_PUBLIC_IP>
```

Example:
```powershell
ssh -i C:\Users\vkgam\Downloads\ssh-key-2026.key ubuntu@129.154.55.100
```

> Type `yes` when asked about fingerprint.

---

## STEP 5: Install Node.js, MySQL & Nginx on the VM

Run these commands **one by one** after SSH-ing in:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js
node --version   # Should show v20.x.x
npm --version

# Install MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL
sudo mysql_secure_installation
# Answer: y, set root password, y, y, y, y

# Install Nginx (web server for frontend)
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 (keeps your Node.js app running forever)
sudo npm install -g pm2

# Install netfilter-persistent for firewall rules
sudo apt install -y iptables-persistent netfilter-persistent
```

---

## STEP 6: Set Up MySQL Database

```bash
# Login to MySQL
sudo mysql -u root -p
# Enter the password you set during secure installation
```

Inside MySQL, run:

```sql
-- Create database
CREATE DATABASE yashotech_fest;

-- Create a user for your app
CREATE USER 'yashotech'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- Grant permissions
GRANT ALL PRIVILEGES ON yashotech_fest.* TO 'yashotech'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

> 📝 **Remember** the username (`yashotech`) and password (`YourStrongPassword123!`) — you'll need them in Step 8.

---

## STEP 7: Upload Your Project to the VM

### Option A: Using Git (Recommended)

If your code is on GitHub:

```bash
# On the VM
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/Yashotechfest2k26.git
cd Yashotechfest2k26
```

### Option B: Using SCP (Upload from your PC)

From your **Windows PowerShell** (NOT on the VM):

```powershell
# Upload backend folder
scp -i <your-key.key> -r C:\tmp\Yashotechfest2k26-source\Yashotechfest2k26-source\backend ubuntu@<YOUR_IP>:/home/ubuntu/yashotech/backend

# Build frontend first (on your PC)
cd C:\tmp\Yashotechfest2k26-source\Yashotechfest2k26-source
npm run build

# Upload the built frontend (dist folder)
scp -i <your-key.key> -r C:\tmp\Yashotechfest2k26-source\Yashotechfest2k26-source\dist ubuntu@<YOUR_IP>:/home/ubuntu/yashotech/dist
```

---

## STEP 8: Configure Backend on the VM

```bash
# On the VM
cd /home/ubuntu/yashotech/backend

# Install dependencies
npm install

# Create production .env file
nano .env
```

Paste this into the `.env` file (edit the values):

```env
PORT=5001
NODE_ENV=production

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=yashotech
DB_PASS=YourStrongPassword123!
DB_NAME=yashotech_fest

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_RYS2wuO74mycmf
RAZORPAY_KEY_SECRET=BK5sUw8xJebBWJ1g2GFu1y30

# Admin Password
ADMIN_PASSWORD=YourAdminPassword123!

# JWT Secret
JWT_SECRET=your_random_secret_string_here_make_it_long

# Frontend URL (your server IP or domain)
FRONTEND_URL=http://<YOUR_PUBLIC_IP>
```

Save: Press `Ctrl+X`, then `Y`, then `Enter`

---

## STEP 9: Start Backend with PM2 (Runs Forever)

```bash
cd /home/ubuntu/yashotech/backend

# Start the backend
pm2 start server.js --name "yashotech-backend"

# Make PM2 start on system reboot
pm2 startup
pm2 save

# Check if it's running
pm2 status
pm2 logs yashotech-backend
```

> ✅ Your backend is now running 24/7 on port 5001!

---

## STEP 10: Configure Nginx (Serve Frontend + Proxy Backend)

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/yashotech
```

Paste this config:

```nginx
server {
    listen 80;
    server_name <YOUR_PUBLIC_IP>;

    # Serve React Frontend
    root /home/ubuntu/yashotech/dist;
    index index.html;

    # React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and enable:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/yashotech /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## STEP 11: Build Frontend for Production

Before uploading, you need to build the frontend with the correct API URL.

**On your Windows PC:**

1. Edit `C:\tmp\Yashotechfest2k26-source\Yashotechfest2k26-source\.env`:

```env
VITE_API_URL=http://<YOUR_PUBLIC_IP>/api
VITE_RAZORPAY_KEY_ID=rzp_test_RYS2wuO74mycmf
```

2. Build:

```powershell
cd C:\tmp\Yashotechfest2k26-source\Yashotechfest2k26-source
npm run build
```

3. Upload the `dist` folder to the VM:

```powershell
scp -i <your-key.key> -r .\dist\* ubuntu@<YOUR_IP>:/home/ubuntu/yashotech/dist/
```

4. On the VM, restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## STEP 12: Test Your Website! 🎉

Open your browser and go to:

```
http://<YOUR_PUBLIC_IP>
```

Test these:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Registration form opens
- ✅ API health check: `http://<YOUR_PUBLIC_IP>/api/health`

---

## 🔧 Useful Commands (Save These!)

```bash
# Check backend status
pm2 status
pm2 logs yashotech-backend

# Restart backend
pm2 restart yashotech-backend

# Restart Nginx (frontend)
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check MySQL status
sudo systemctl status mysql

# SSH into your server
ssh -i <your-key.key> ubuntu@<YOUR_IP>
```

---

## 🌐 Optional: Add Free Domain Name

If you want a custom domain like `yashotechfest.com` instead of the IP:

1. Buy a domain (₹99-800/year on GoDaddy, Namecheap)
2. Or get a **free subdomain** from [FreeDNS](https://freedns.afraid.org/)
3. Point the domain's **A Record** to your Oracle Cloud Public IP
4. Update Nginx `server_name` to your domain

---

## ⚠️ Important Notes

- **Never upgrade** to Oracle paid tier — stay on "Always Free"
- Your VM has **1 GB RAM** — enough for this project
- **PM2** will auto-restart your backend if it crashes
- **Nginx** serves your frontend files directly (very fast)
- The server runs **24/7 for free** — no sleeping!
