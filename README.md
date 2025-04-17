# Netease BUFF Trade Bot

<div align="center">
   <img src="assets/images/thumbnail.png" alt="logo">
</div>

## Features
- **Automated Trading Flow**: Automatically completes market scanning, placing offers, and confirming transactions based on preset conditions.
- **Support for Various Trading Parameters**: Users can set parameters (such as price, wear level, rarity) to automate skin purchases and sales.
- **Efficient Competitive Pricing**: Quickly adjusts offers to compete with other buyers and sellers in a competitive market.
- **Chrome Extension Implementation**: The project is implemented as a Chrome extension for convenient operation directly in the user’s browser.

## Project Architecture
The project is divided into two main parts:
1. **Frontend Scripts**: Injected into the web page to handle automated trading logic.
    - `toolBarInject.js`: Injects the toolbar into the webpage.
    - `trade.js`: Manages the trading logic.
    - `monitor.js`: Monitors changes in the trading pages.
2. **Background Services**: Handles tasks running in the background via the Chrome extension.
    - `taskSchedule.js`: Schedules tasks for automated operations.
    - `waitingSupply.js`: Handles logic for waiting on supply.

## Installation and Usage
### 1. Install the Chrome Extension
1. Clone or download the project files to your local machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Click on “Load unpacked” and select the project’s root directory.
4. Once loaded, you will see the extension icon in the browser’s toolbar.

### 2. Configure Automated Trading Parameters
1. Go to the Netease BUFF website and click on the extension icon in the toolbar.
2. Set the desired trading parameters (such as target skins, price ranges) via the plugin’s interface.
3. Click the “Start” button to initiate the automated trading process.

## Usage Example
1. Select the skin you wish to purchase from the Netease BUFF marketplace.
2. Configure your trading parameters, and after clicking “Start,” the bot will automatically scan and perform trades.

## Getting Started to Contribute

1. Clone the repository:
   ```sh
   git clone https://github.com/SolitudeRA/Netease-Buff-Trade-Bot
   
## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](./LICENSE) file for details.
