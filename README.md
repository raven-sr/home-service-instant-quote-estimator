# 🏠 Home Service Instant Quote Estimator

An AI-powered home service estimation platform designed to simplify the initial property assessment process. Homeowners can upload property images, describe their renovation requirements, and receive AI-assisted property analysis through an interactive application.

Built using the **MERN Stack and OpenAI API**, this project explores how AI can enhance traditional home service estimation workflows.

## 🚀 Key Features

### 🤖 AI-Powered Property Analysis
- Upload property images for AI-assisted analysis.
- Analyze visible property conditions.
- Ask questions about roofing and painting requirements.
- Receive structured property analysis and recommendations.
- Interactive AI assistant for property-related queries.

### 🏡 Homeowner Experience
- User-friendly interface for property assessment.
- Upload and manage property images.
- Describe home improvement requirements.
- Interact with the AI assistant.
- Explore renovation-related insights.

### ☁️ Image Management
- Cloudinary integration for image uploads.
- Secure image storage and management.
- Image-based property analysis workflow.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Data modeling |
| OpenAI API | AI-powered analysis |
| Cloudinary | Image storage |
| JWT | Authentication |
| Vite | Frontend development environment |

## 🏗️ Architecture

```text
                 Homeowner
                     |
                     v
              React Frontend
                     |
                     v
              Express Backend
                     |
          +----------+----------+
          |          |          |
          v          v          v
       MongoDB   Cloudinary   OpenAI API
          |          |          |
          v          v          v
       User Data   Images    AI Analysis
                     |
                     v
              Results to User
```

## 📂 Project Structure

```text
Home-Service-Estimator/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

*Adjust this structure to match your actual implementation.*

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/raven-sr/home-service-instant-quote-estimator.git
cd home-service-instant-quote-estimator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local development URL displayed in your terminal.

## 🔐 Environment Variables

Configure the required environment variables before starting the application.

- `PORT` – Backend server port.
- `MONGO_URL` – MongoDB connection string.
- `OPENAI_API_KEY` – OpenAI API key.
- `CLOUDINARY_CLOUD_NAME` – Cloudinary cloud name.
- `CLOUDINARY_API_KEY` – Cloudinary API key.
- `CLOUDINARY_API_SECRET` – Cloudinary API secret.
- `JWT_SECRET` – JWT authentication secret, if authentication is enabled.

**Security:** Never expose API keys, database credentials, or `.env` files in a public repository.

## 📸 Screenshots

Add screenshots of your actual application here.

| Application | Screenshot |
|---|---|
| Home Page | Add screenshot |
| Property Image Upload | Add screenshot |
| AI Property Analysis | Add screenshot |
| AI Assistant | Add screenshot |

## 🔮 Future Enhancements

- Automated material quantity calculations.
- Contractor pricing and quotation generation.
- Detailed project cost estimation.
- PDF quotation generation.
- Order and project tracking.
- Contractor and homeowner dashboards.
- Notifications and administrative management.

## 👨‍💻 Developer

**Siva Sundaram**

Full-Stack Developer | MERN Stack | AI Integration

- GitHub: [@raven-sr](https://github.com/raven-sr)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/sivasundaram-m-7b5b76372/)

---

⭐ If you find this project interesting, consider giving it a star!

**Built with ❤️ using MERN Stack and AI.**
