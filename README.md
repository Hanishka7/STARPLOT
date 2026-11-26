# ⭐ StarPlot – Job Application Automation Platform

## 📌 About the Project

StarPlot is a web-based job application automation platform that I worked on during my internship at Kakatiya Solutions.

The main idea behind this project is to make the job application process easier for students and job seekers. While applying for different jobs, we often have to enter the same personal details, educational information, and upload our resumes repeatedly. Managing multiple applications and keeping track of their status can also become difficult.

To solve this problem, we developed StarPlot, which brings profile management, job application tracking, and browser automation together in one platform.

It also includes **StarBot**, an automation feature that uses Playwright to interact with supported job application websites and automatically fill forms using the information saved in a user's profile.

## ✨ Features

- **User Authentication:** Users can register, log in, and securely access their accounts.
- **Profile Management:** Add and update personal details, educational qualifications, and other professional information.
- **Resume Management:** Upload and manage resumes for job applications.
- **Job Application Tracking:** Maintain application records and check their current status.
- **StarBot Automation:** Automatically fills supported job application forms using saved user information.
- **Dashboard:** Provides a centralized place to manage job applications.
- **Notifications:** Helps users stay updated about application activities.
- **Application Status:** Keeps track of pending, submitted, failed, and applications requiring manual intervention.

## 🛠️ Technologies Used

During the development of StarPlot, we worked with the following technologies:

| Technology | Purpose |
|---|---|
| React.js | Building the user interface |
| Vite | Frontend development environment |
| HTML & CSS | Structuring and styling web pages |
| JavaScript | Application functionality |
| Node.js | Backend runtime environment |
| Express.js | Creating backend APIs |
| MongoDB | Storing application data |
| Mongoose | Database interaction |
| Playwright | Browser automation |
| JWT | User authentication |
| bcryptjs | Password hashing |
| Axios | API communication |
| Multer | File uploads |

## 📂 Project Structure

The project is divided into two main parts: client and server.

```text
STARPLOT/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: The folder structure above is illustrative. Update it if your actual folders are different.*

## ⚙️ How StarPlot Works

The basic working process of the platform is:

1. A user registers and logs into the StarPlot platform.
2. The user adds personal, educational, and professional details to their profile.
3. The user provides a job application URL.
4. StarBot starts browser automation using Playwright.
5. It identifies supported form fields using keyword-based matching.
6. The required information is taken from the saved user profile.
7. The automation fills the available application fields.
8. The application result and status are updated in the platform.

Some websites may have CAPTCHA, OTP verification, or other requirements that need manual interaction from the user.

## 🚀 Getting Started

If you want to run this project on your local machine, follow these steps.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Hanishka7/STARPLOT.git
```

### Step 2: Open the Project

```bash
cd STARPLOT
```

### Step 3: Install Dependencies

Navigate to the client and server folders separately and install the required dependencies.

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

### Step 4: Configure Environment Variables

Create the required `.env` files and add the configuration values needed by the application, such as:

- MongoDB connection URL
- JWT secret
- Server port
- Encryption key
- Frontend API URL

Use the environment variable names defined in the source code.

### Step 5: Start the Application

Run the frontend and backend using the development scripts configured in their respective `package.json` files.

For example:

```bash
npm run dev
```

Install the required Playwright browser if it is not already available:

```bash
npx playwright install chromium
```

## 📚 What I Learned

Working on StarPlot gave me an opportunity to understand how a full-stack web application is developed and how its different components work together.

Some of the things I learned during this project include:

- Developing frontend components using React.js.
- Connecting frontend and backend using REST APIs.
- Working with Node.js and Express.js.
- Storing and retrieving data using MongoDB.
- Implementing authentication and basic security mechanisms.
- Understanding browser automation using Playwright.
- Debugging errors and testing application functionality.
- Working with different modules of a real-world project.

## 🔮 Future Improvements

There are several features that can be added to StarPlot in the future:

- AI-based resume analysis and job recommendations.
- Better support for different job application websites.
- Improved automation for complex application forms.
- Email notifications for application updates.
- Analytics to track application progress.
- AI assistance for preparing job application responses.

## 👩‍💻 Project Details

**Project Name:** StarPlot

**Domain:** Full Stack Web Development and Browser Automation

**Organization:** Kakatiya Solutions

**Internship Role:** Generative AI Intern

**Project Type:** Web-Based Application

## 🙌 Conclusion

StarPlot was a valuable learning experience for me because it gave me the opportunity to work on a practical problem and understand how different technologies are used together to build a complete application.

Through this project, I gained hands-on experience in frontend development, backend development, database integration, and browser automation. It also helped me improve my problem-solving and debugging skills.

My goal with StarPlot is to make the job application process simpler and more organized for students and job seekers.

---

**⭐ StarPlot – Making Job Applications Easier!**
