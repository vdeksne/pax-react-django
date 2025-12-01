CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://*.netlify.app",  # Allow all Netlify subdomains
]

# specific Netlify domain
CORS_ALLOWED_ORIGINS += [
    "pax-connect.netlify.app",  
] 