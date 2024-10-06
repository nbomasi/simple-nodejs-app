
# Deploying a Simple Node.js Application with Nginx on Ubuntu EC2

## 1. Install Node.js and npm on Your EC2 Instance

First, connect to your Ubuntu EC2 instance and update the package list. Then install Node.js and npm:

```bash
sudo apt update
sudo apt install nodejs npm -y
```

Verify the installation with:

```bash
node -v  # Checks Node.js version
npm -v   # Checks npm version
```

## 2. Set Up Your Node.js Application

1. **Create a project directory** and navigate into it:

    ```bash
    mkdir js-fullstack-app
    cd js-fullstack-app
    ```

2. **Initialize a Node.js project** with the following command:

    ```bash
    npm init -y
    ```

3. **Install Express.js** to handle backend logic:

    ```bash
    npm install express
    ```

4. **Create a `server.js` file** to handle your backend logic:

    ```bash
    touch server.js
    ```

5. **Add the following code to `server.js`:**

    ```js
    const express = require('express');
    const app = express();
    const path = require('path');

    // Serve static frontend files
    app.use(express.static('public'));

    // API endpoint
    app.get('/api/message', (req, res) => {
        res.json({ message: "I am new to JavaScript - from the backend!" });
    });

    // Start the server
    const port = 3000;
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    ```

## 3. Set Up the Frontend (HTML and JavaScript)

1. **Create a `public` directory** for the frontend static files:

    ```bash
    mkdir public
    ```

2. **Create an `index.html` file** inside the `public` folder:

    ```bash
    touch public/index.html
    ```

3. **Add the following content to `index.html`:**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>JavaScript App</title>
    </head>
    <body>
        <h1>Frontend: I am new to JavaScript</h1>
        <p id="backend-message"></p>

        <script>
            // Fetch data from the backend
            fetch('/api/message')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('backend-message').textContent = data.message;
                })
                .catch(err => console.error('Error:', err));
        </script>
    </body>
    </html>
    ```

## 4. Run Your Node.js Application Locally

Run the application with:

```bash
node server.js
```

Your application should now be running at `http://localhost:3000` on your EC2 instance.

## 5. Install and Configure Nginx as a Reverse Proxy

1. **Install Nginx**:

    ```bash
    sudo apt install nginx -y
    ```

2. **Edit the Nginx configuration file** to set up a reverse proxy:

    Open the configuration file:

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Update the file with the following content (this sets Nginx to forward requests to your Node.js app running on port 3000):

    ```nginx
    server {
        listen 80;

        server_name _;  # You can also use your public IP or domain name here

        location / {
            proxy_pass http://localhost:3000;  # Or use private IP: http://<private-ip>:3000
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3. **Restart Nginx** to apply the changes:

    ```bash
    sudo systemctl restart nginx
    ```

## 6. Configure EC2 Security Group for Inbound Traffic

1. **Go to the AWS Console** and select your EC2 instance.
2. **Find the Security Group** associated with your instance.
3. In the **Inbound Rules**, add a rule to allow HTTP traffic:
    - **Type**: HTTP
    - **Port**: 80
    - **Source**: 0.0.0.0/0 (for public access)

## 7. Access the Application

Use your EC2 instance’s **public IP** to access the app in your browser. For example:

```
http://<public-ip>
```

This will direct you to the Nginx server, which will forward requests to your Node.js app.

## 8. Optional: Running Node.js in the Background

To keep your Node.js server running after you close the terminal, you can use **PM2** to manage the process.

1. **Install PM2**:

    ```bash
    npm install pm2 -g
    ```

2. **Start your Node.js app with PM2**:

    ```bash
    pm2 start server.js
    ```

PM2 will keep your application running in the background.

---

### Summary:
- **Node.js** is used for backend logic, and **Express** serves both static files and API responses.
- **Nginx** is configured as a reverse proxy to forward traffic from port 80 to the Node.js server on port 3000.
- The **public IP** of your EC2 instance is used to access the deployed app from the browser.
