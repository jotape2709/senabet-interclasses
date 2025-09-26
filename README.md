# Senabet Interclasses
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/jotape2709/senabet-interclasses.git)

Senabet is a school sports betting platform developed for interclass game competitions. The project simulates betting for recreational and educational purposes, encouraging engagement and interaction among students using a virtual currency called "SENACOINS".

## ✨ Features

*   **User Authentication**: Secure sign-up and login for students and teachers, with role-based access control.
*   **Sports Betting**: View a list of games, check odds, and place bets on various school sports like Futsal, Handball, and Volleyball.
*   **Live Game Status**: Real-time indicators for games that are currently in progress.
*   **Game Schedule**: A comprehensive schedule page to filter games by date and sport.
*   **Casino Games**: Play casino-style games like Roulette and Crash to earn more SENACOINS.
*   **Daily Rewards & Challenges**: Users can claim daily bonuses by completing educational challenges (e.g., math, history questions) to earn SENACOINS.
*   **Admin Panel**: A dedicated dashboard for teachers/admins to manage the educational challenge bank by adding questions individually or uploading a JSON file.
*   **Personal Dashboard**: Users can track their betting history, total wagered, and profit/loss on the "My Bets" page.
*   **Responsive Design**: A clean, modern, and fully responsive interface built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Routing**: React Router
*   **Animations**: Framer Motion
*   **Backend & Database**: Firebase (Authentication, Firestore, Analytics)
*   **Linting**: ESLint

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v20 or later)
*   npm
*   A Firebase project

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/jotape2709/senabet-interclasses.git
    cd senabet-interclasses
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Firebase project configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📄 Pages & Functionality

*   **/ (HomePage)**: The main landing page displaying featured games and promotional cards for bonuses and the game schedule.
*   **/login (LoginPage)**: Handles user authentication (login and registration).
*   **/minhas-apostas (MyBetsPage)**: Displays the user's betting history, statistics, and current balance.
*   **/torneios (TournamentsPage)**: Shows a list of ongoing, upcoming, and finished tournaments.
*   **/agenda (SchedulePage)**: Allows users to view all scheduled games, filterable by date and sport.
*   **/cassino (CasinoPage)**: Features virtual currency-based games like Roulette and Crash.
*   **/bonus (BonusPage)**: A page where users can claim daily rewards.
*   **/admin (AdminPage)**: A protected route for users with the 'teacher' role to manage the educational challenges that power the bonus system.

## ⚖️ License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
