# CompetiLens Desktop App

This desktop shell wraps the existing web frontend and connects to:
- Backend at http://localhost:5000
- AI engine at http://localhost:8000

## Run

```bash
cd DesktopApp
npm install
npm start
```

## Notes

- The app loads the existing frontend at http://localhost:5173.
- Authentication is handled by the existing backend auth endpoints.
- The desktop shell exposes basic runtime config through the preload bridge.
