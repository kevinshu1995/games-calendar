# Sports Calendar Creator

This service automatically fetches sports tournament data from various APIs and creates Google Calendar events for different types of tournaments. Each sport/tournament type gets its own separate Google Calendar.

## Features

- Fetches tournament data from multiple API sources
- Creates and updates Google Calendars for different sports/tournaments
- Abstracts different API formats through an adapter layer
- Can be triggered via GitHub Actions from external repositories
- Supports BWF (Badminton World Federation) tournaments out of the box
- Extensible design to add support for more sports/APIs

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
   ```
   npm install
   ```
3. Set up Google API credentials:
   - Create a project in Google Cloud Console
   - Enable the Google Calendar API
   - Create OAuth credentials and download the JSON file
   - Save as `credentials.json` in the project root (this file is gitignored)

4. Configure environment variables (create a `.env` file):
   ```
   GOOGLE_CALENDAR_CREDENTIALS=credentials.json
   GOOGLE_CALENDAR_TOKEN=token.json
   API_BASE_URL=https://the-static-api.vercel.app
   ```

## Usage

### Local Development

Run the service locally to test:

```
npm run start
```

### GitHub Action Integration

To use this service with another GitHub repository:

1. Add the GitHub Action workflow file to your repository:

```yaml
# .github/workflows/update-calendars.yml
name: Update Sports Calendars

on:
  schedule:
    - cron: '0 0 * * 0'  # Run weekly on Sunday at midnight
  workflow_dispatch:     # Allow manual triggering

jobs:
  update-calendars:
    runs-on: ubuntu-latest
    steps:
      - uses: username/games-calendar@main
        with:
          google-credentials: ${{ secrets.GOOGLE_CALENDAR_CREDENTIALS }}
          sports: "bwf"  # Comma-separated list of sports to update
```

2. Add your Google Calendar credentials as a repository secret in GitHub

## Extending for New Sports/APIs

To add support for a new sport or API:

1. Create a new adapter in `src/adapters/`
2. Implement the standardized interface
3. Register the new adapter in the adapter factory
4. Update tests and documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
