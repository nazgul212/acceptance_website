# How to Host Your Website

Since your website is built with **HTML, CSS, and JavaScript** (Static Site), you have two excellent options.

---

## Option 1: GitHub Pages (Recommended - Easiest & Free)
**Why?** Your code is *already* on GitHub. This method is free, includes a secure lock (HTTPS) automatically, and updates automatically whenever you save code.

### Steps:
1.  Go to your GitHub Repository: [https://github.com/nazgul212/acceptance_website](https://github.com/nazgul212/acceptance_website)
2.  Click on the **Settings** tab (gear icon at the top right).
3.  On the left sidebar, under "Code and automation", click **Pages**.
4.  Under **"Build and deployment"**:
    *   **Source**: Select `Deploy from a branch`.
    *   **Branch**: Select `main` folder `/ (root)`.
5.  Click **Save**.

**That's it!** In about 1-2 minutes, you will see a link at the top of that page (e.g., `https://nazgul212.github.io/acceptance_website/`). You can share this link with anyone.

---

## Option 2: GoDaddy (If you already paid for hosting)
**Why?** Use this if you already have a "Web Hosting" plan with GoDaddy and want to use your domain name immediately without configuring DNS records.

### Steps:
1.  **Prepare your files**:
    *   On your computer, select ALL files in your project folder (`index.html`, `assets`, `contact-apply.html`, etc.).
    *   Right-click -> **Compress to ZIP file** (or Send to > Compressed (zipped) folder). Name it `website.zip`.
2.  **Log in to GoDaddy**:
    *   Go to your Product Page.
    *   Find **Web Hosting** and click **Manage**.
    *   Open **cPanel Admin**.
3.  **Upload**:
    *   Click on **File Manager**.
    *   Open the `public_html` folder (this is your main website folder).
    *   *Optional: If there are existing files you don't need, delete them or move them to a backup folder.*
    *   Click **Upload** in the top toolbar.
    *   Select your `website.zip` file.
4.  **Extract**:
    *   Go back to the File Manager window.
    *   Right-click on `website.zip` and select **Extract**.
    *   Make sure the files are extracted directly into `public_html` (not a subfolder).
    *   *Important: Ensure your main file is named `index.html`.*

**Done!** Your website should now be live at your domain name.

---

## Which one should I choose?
*   **Use GitHub Pages** if you want a live link *right now* for free to test/share.
*   **Use GoDaddy** if you want the site to be officially live on your `www.your-business-name.com` immediately and you are comfortable using cPanel.
