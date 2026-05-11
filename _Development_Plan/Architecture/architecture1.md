# Zaptian ID Designer - Architectural Analysis

The project follows a **Decoupled Desktop-Web Architecture** powered by **Electron** and **React**. It is designed to handle high-performance ID card design and data management on Windows.

## 1. Core Architectural Pattern: Main-Renderer Separation

The application is split into two distinct processes as per standard Electron best practices:

- **Main Process (`electron/`)**: Acts as the "Backend". It has full access to Node.js APIs and the operating system. It handles:
    - Window lifecycle and system events.
    - Database management (SQLite via `better-sqlite3`).
    - File system operations (Excel processing, workspace management).
    - Auto-updates via `electron-updater`.
- **Renderer Process (`src/`)**: Acts as the "Frontend". It is a React application that runs in a Chromium window. It is restricted from direct OS access for security, communicating with the Main process via IPC.

## 2. Key Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frameworks** | Electron 37, React 19, Vite |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **Database** | SQLite (`better-sqlite3`), `electron-store` (Config) |
| **Data Processing** | `exceljs` (Import/Export), `react-virtualized` (Performance) |
| **Routing** | `react-router-dom` v7 |

## 3. Component Architecture (Frontend)

The React application follows a modular structure:

- **Pages Layer (`src/Pages/`)**: Each major feature (ID Design, Data Management, Photo Editing) is a standalone page component.
- **Navigation Layer (`src/Navigations/`)**: Centralized routing and sidebar/titlebar management.
- **Utility Layer (`src/Utils/`)**: Specialized logic for rendering complex elements like ID card labels and image processing.
- **Component Layer (`src/Components/`)**: Atomic and molecular UI components.

## 4. Communication & Integration (IPC)

The bridge between the UI and the system is handled through:

- **Preload Scripts**: `electron/preload/preload.js` exposes specific backend functions to the frontend securely.
- **IPC Handlers**: `electron/ipc-handler/DataDashBoard.handler.js` centralizes the business logic for data processing, database queries, and file management, responding to requests from the React frontend.

## 5. Data Flow

1.  **Input**: User imports data via Excel or manual entry.
2.  **Processing**: Renderer sends data via IPC to the Main process.
3.  **Storage**: Main process saves data into `excel-storage.db` using SQLite.
4.  **Retrieval**: Renderer requests data for display; Main process queries SQLite and returns JSON.
5.  **Output**: ID cards are rendered/printed based on the stored data and design templates.

## 6. Development Workflow

The architecture supports modern DX:

- **Concurrent Execution**: Runs Vite (Frontend) and Electron (Backend) simultaneously.
- **Hot Reloading**: Vite provides instant UI updates; `electronmon` restarts the app for Main process changes.
