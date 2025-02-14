# Currency Exchange Monitor

A real-time currency exchange rate monitoring application that provides live updates of currency rate changes with a modern, interactive interface.

## Features

- Real-time currency exchange rate monitoring
- Visual history of recent price changes in a horizontal slider
- Automatic WebSocket reconnection on connection loss
- Visual connection status indicator

## Prerequisites

- Node.js (v14 or higher)
- npm
- Backend server running (see backend setup instructions)

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```env
VITE_WS_URL=ws://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_WS_URL | WebSocket server URL | ws://localhost:3000 |

## Application Structure

- `src/App.jsx` - Main application component with WebSocket connection logic
- `src/components/`
  - `CurrencyTable.jsx` - Displays current exchange rates
  - `PriceChangeHistory.jsx` - Shows recent price changes in a slider

## Features in Detail

### Real-time Updates
The application connects to a WebSocket server to receive live currency exchange rate updates. When a rate changes significantly, it's displayed in the price history slider.

### Price History Slider
- Shows the last 10 price changes
- Color-coded cards (green for increases, red for decreases)
- Displays old price, new price, and percentage change
- Timestamp for each change

### Current Rates Table
Displays all current exchange rates in an easy-to-read table format.

### Connection Status
Visual indicator showing the current WebSocket connection status:
- Connected (green)
- Connecting (yellow)
- Disconnected (red)

## Development

Built with:
- React
- Vite
- WebSocket for real-time communication
- CSS3

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Troubleshooting

1. If you can't connect to the WebSocket server:
   - Ensure the backend server is running
   - Check that the VITE_WS_URL in .env matches your backend server address
   - Check browser console for connection errors

2. If you're not seeing updates:
   - Verify the backend is successfully fetching new rates
   - Check the browser console for any error messages
   - Ensure your network connection is stable

