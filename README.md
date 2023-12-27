
# Tic Tac Toe Online

## Introduction

Welcome to our Tic Tac Toe Online game! This engaging multiplayer game, which you can play completely free of charge, is engineered using React, Next.js, Socket.io, and Mantine UI. Designed as a sleek one-page application, it offers both single-player and multiplayer modes. The multiplayer experience is seamlessly facilitated by Socket.io, ensuring real-time gameplay.

## Getting Started

### Prerequisites

Before diving into the game setup, ensure you have `pnpm` as your package manager. If not, you can install it globally using this command:

```bash
npm install -g pnpm
```

### Setting Up the Project

1. **Clone the Repository**:

   Begin by cloning the repository to your local machine. Replace `{repo-link}` with the actual link to the repository.

   ```bash
   git clone {repo-link}
   ```

2. **Navigate to the Project Directory**:

   Enter the project's root directory using:

   ```bash
   cd {project-directory}
   ```

3. **Install Dependencies**:

   Execute the following command to install all necessary dependencies:

   ```bash
   pnpm install
   pnpm run all:init
   ```

   *Note: If you can't use pnpm, use `npm i && npm run init` in each folder.*

4. **Set Up the Backend Environment**:

   Navigate to the backend folder and create a `.env` file from the template:

   ```bash
   cd backend
   cp env.template .env
   ```

5. **Set Up the Frontend Environment**:

   Navigate to the frontend folder and create a `.env` file from the template:

   ```bash
   cd frontend
   cp env.template .env
   ```

6. **Start the Project**:

   Return to the project root and start the project using:

   ```bash
   cd ..
   pnpm run all:start:dev
   ```

   *Note: If you can't use pnpm, use `npm run dev` in each folder.*

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please follow the standard pull request procedure to propose any changes or enhancements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Special thanks to all contributors and supporters of this project. For more information, acknowledgments, and contact details, please refer to our credits section.
