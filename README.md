# ChimpTracker - A Manifest Application

This is a full-stack React application built with Manifest for tracking chimpanzee observations. It allows researchers to log in, submit observations including text and images, and view a feed of all recent observations.

## Features

- **User Authentication**: Secure signup and login for researchers.
- **Observation Logging**: Create new observations with chimp name, location, behavior details, and a photo.
- **Real-time Feed**: View a list of all observations submitted by researchers.
- **File Uploads**: Manifest handles image uploads, resizing (thumbnails), and storage.
- **Ownership Policies**: Researchers can only edit or delete their own submissions.
- **Automatic Admin Panel**: A complete admin interface is available at `/admin` for managing users and observations.

## Getting Started

### Prerequisites

- Node.js and npm
- A Manifest account and a deployed backend from the provided `manifest.yml`.

### Frontend Setup

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Manifest App ID and Backend URL:
    ```
    VITE_MANIFEST_APP_ID=your-app-id
    VITE_MANIFEST_BACKEND_URL=your-backend-url
    ```
4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Default Credentials

- **Researcher (Demo):** `researcher@manifest.build` / `password`
- **Admin:** `admin@manifest.build` / `admin` (Access via the Admin Panel)
