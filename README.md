# Sports Calendar

## Service Overview

Sports Calendar Creator is an automated sports event calendar management service that helps users easily track various sports events. We integrate multiple sports event APIs, automatically fetch event information, and create Google Calendar events, allowing users to view and manage event schedules anytime.

### Main Services

- **Automatic Event Synchronization**: Automatically fetch the latest event information from various sports event sources
- **Multi-platform Synchronization**: Achieve cross-platform calendar synchronization through Google Calendar
- **Public Calendar Sharing**: Provide public calendar subscription links for easy sharing with others
- **Real-time Updates**: Regularly update event information to ensure the calendar stays up-to-date

### Technical Stack

- **Frontend Technology**: Vue.js, TypeScript, Vite
- **Backend Technology**: Node.js, TypeScript
- **API Integration**: Google Calendar API, Multiple Sports Event APIs
- **Deployment Platform**: Vercel
- **CI/CD**: GitHub Actions

## Architecture Explanation

The system consists of the following components:

1. **API Client**: Retrieves data from source APIs
2. **Data Adapter Layer**: Converts different API formats to a standard format
3. **Calendar Service**: Creates and updates Google Calendar events
4. **GitHub Action**: Allows triggering the service from an external GitHub repository

### Data Flow

```
External GitHub Workflow → GitHub Action Trigger → API Client → Data Adapter Layer → Calendar Service → Google Calendar
```

### API Integration

The service uses a central API index `https://the-static-api.vercel.app/api/index.json` to discover available sports event APIs. Currently supported APIs include:

- BWF Tournament API (`/api/bwf/tournaments.json`) - Badminton World Federation tournaments

## Installation and Setup

### Prerequisites

- Node.js (v22 or higher)
- Google Cloud Platform account with Calendar API enabled
- GitHub account

### Installation Steps

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Google API credentials:

   - Create a project in the Google Cloud Console
   - Enable the Google Calendar API
   - Create a service account and download the JSON key
   - Save the service account key as `credentials.json` (this file is set to be ignored by git)
   - Share your Google calendar with the service account email (found in `credentials.json`)
   - Ensure the calendar is set to public access while maintaining developer-only edit permissions

4. Configure environment variables (create a `.env` file):
   ```
   GOOGLE_CALENDAR_CREDENTIALS=credentials.json
   GOOGLE_CALENDAR_TOKEN=token.json
   API_BASE_URL=https://the-static-api.vercel.app
   ```

### Calendar Access Setup

By default, the service will:

- Create a publicly viewable calendar
- Restrict edit permissions to the service account only
- Generate a public subscription link (iCal and web) for calendar sharing

### Event Handling

The service automatically:

- Checks for existing events before creating new ones
- Uses event names and date ranges to identify duplicate events
- Prevents duplicate event creation while maintaining event history
- Provides detailed logging for event creation and error handling

## Usage

### Local Development

1. Run the service:

   ```bash
   npm run cal:start
   ```

2. Development mode (hot reload):

   ```bash
   npm run cal:dev
   ```

3. Code linting:

   ```bash
   npm run cal:lint
   ```

4. Preview the public calendar interface:

   ```bash
   npm run preview
   ```

5. Remove duplicate events from the calendar:
   ```bash
   npm run cal:remove-duplicates
   ```

### Frontend Development

1. Start the development server:

   ```bash
   npm run front:dev
   ```

2. Production build:

   ```bash
   npm run front:build
   ```

3. Preview the production build:
   ```bash
   npm run front:preview
   ```

## Project Structure

```
├── frontend/            # Frontend application code
│   ├── src/            # Source code directory
│   │   ├── App.vue     # Main application component
│   │   ├── assets/     # Static resources
│   │   ├── components/  # Vue components
│   │   ├── lib/        # Third-party libraries
│   │   ├── main.ts     # Entry point
│   │   ├── view/       # Page components
│   │   └── vite-env.d.ts  # TypeScript environment configuration
│   └── index.html      # HTML entry file
├── public/             # Static resources
│   └── data/          # Pre-generated calendar data
├── vite.config.ts     # Vite configuration
└── calendar-scripts/   # Backend service code
    ├── src/           # Source code directory
    │   ├── adapters/   # API data adapters
    │   ├── services/   # Core services
    │   ├── utils/      # Utility functions
    │   └── index.js    # Main entry point
    └── scripts/        # Standalone scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
