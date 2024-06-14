Project Overview:
This fullstack application is designed to fetch and present demographic data from Statistics Norway (SSB). It demonstrates how to effectively utilize a public API to extract information and perform statistical calculations. The application focuses on the variable "Population per km² of land area" for Molde, Lillestrøm, and Oslo from the years 2020 to 2023.

Technologies Used:
Backend: Node.js with Express.js framework
Frontend: HTML, CSS, and JavaScript
APIs: Data fetched from SSB's public API
Other Tools: Axios for HTTP requests, Visual Studio Code as the IDE

Setup & Prerequisites:
Node.js installed on your machine
NPM (Node Package Manager) or Yarn
Access to the internet to fetch data from the SSB API

Installing:
To get the application running locally, follow these steps:

Clone the repository: git clone https://github.com/your-github-username/your-repository-name.git
cd your-repository-name

npm install

or if you use Yarn:
yarn install

Start the server:
npm start

or with Yarn:

yarn start
This will start the server on http://localhost:3000.

Open your browser and navigate to http://localhost:3000 to view the application.

Features
Fetching demographic data from the SSB API.
Backend server acting as a proxy to handle requests and responses.
Statistical calculations performed on the server-side including average, median, maximum, and minimum.
Displaying data and calculations in a tabular format on the frontend.
Problem Solving and Debugging
Throughout the development process, challenges such as handling 400 and 500 series errors were encountered. These were addressed by:

Enhancing error handling mechanisms to prevent server crashes and provide meaningful error messages to the client.
Modifying iteration methods from forEach to Object.keys() to handle non-array JSON responses correctly.

This project is licensed under the MIT License.