# Sports Calendar Creator

This service automatically fetches sports tournament data from various APIs and creates Google Calendar events for different types of tournaments. Each sport/tournament type gets its own separate Google Calendar.

## Features

- Fetches tournament data from multiple API sources
- Creates and updates Google Calendars for different sports/tournaments
- Abstracts different API formats through an adapter layer
- Can be triggered via GitHub Actions from external repositories
- Supports BWF (Badminton World Federation) tournaments out of the box
- Extensible design to add support for more sports/APIs
- Prevents duplicate event creation through event checking
- Public calendar access with developer-only edit permissions

## Architecture

The system is built with the following components:

1. **API Client**: Fetches data from the source APIs
2. **Data Adapter Layer**: Converts various API formats into a standardized format
3. **Calendar Service**: Creates and updates Google Calendar events
4. **GitHub Action**: Allows the service to be triggered by other GitHub repositories

### Data Flow

```
External GitHub Workflow → GitHub Action Trigger → API Client → Data Adapter → Calendar Service → Google Calendar
```

### API Integration

The service uses a central API index at `https://the-static-api.vercel.app/api/index.json` to discover available sports data APIs. Currently supported APIs include:

- BWF Tournament API (`/api/bwf/tournaments.json`) - Badminton World Federation tournaments

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Google Cloud Platform account with Calendar API enabled
- GitHub account

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Google API credentials using a Service Account:
   - Create a project in Google Cloud Console
   - Enable the Google Calendar API
   - Create a Service Account and download the JSON key
   - Save the Service Account key as `credentials.json` in the project root (this file is gitignored)
   - Share your Google Calendar with the Service Account email (look in the credentials.json file for `client_email`)
   - Ensure the calendar is set to public access while maintaining developer-only edit permissions

4. Configure environment variables (create a `.env` file):
   ```
   GOOGLE_CALENDAR_CREDENTIALS=credentials.json
   GOOGLE_CALENDAR_TOKEN=token.json
   API_BASE_URL=https://the-static-api.vercel.app
   ```

### Calendar Access Settings

By default, the service will:
- Create public calendars that anyone can view
- Restrict editing permissions to the service account only
- Generate public subscription links (iCal and web) for calendar sharing
- Maintain calendar color coding for different sports types

### Event Handling

The service automatically:
- Checks for existing events before creating new ones
- Uses tournament name and date range to identify duplicates
- Prevents duplicate event creation while maintaining event history
- Provides detailed logging for event creation and error handling

## Usage

### Local Development

1. Run the service locally:
   ```bash
   npm run cal:start
   ```

2. For development with hot-reload:
   ```bash
   npm run cal:dev
   ```

3. To lint the code:
   ```bash
   npm run cal:lint
   ```

4. To preview the public calendar interface:
   ```bash
   npm run preview
   ```

5. To remove duplicate events from a calendar:
   ```bash
   npm run cal:remove-duplicates
   ```

## Frontend Development

1. Start the development server:
   ```bash
   npm run front:dev
   ```

2. Build for production:
   ```bash
   npm run front:build
   ```

3. Preview the production build:
   ```bash
   npm run front:preview
   ```

## Project Structure

```
calendar-scripts/
├── src/
│   ├── adapters/      # API data adapters
│   ├── services/      # Core services
│   ├── utils/         # Utility functions
│   └── index.js       # Main entry point
└── scripts/           # Standalone scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
