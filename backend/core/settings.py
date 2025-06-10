CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://*.netlify.app",  # Allow all Netlify subdomains
]

# If you have a specific Netlify domain, add it here
CORS_ALLOWED_ORIGINS += [
    "https://your-app-name.netlify.app",  # Replace with your actual Netlify domain
] 