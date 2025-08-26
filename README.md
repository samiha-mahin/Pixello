

# 📸 Pixello — Real-Time AI-Powered Photo Sharing App

**Pixello** is a full-stack **Instagram-inspired** web app with real-time capabilities and built-in **AI-powered caption generation**. Users can upload photos, interact with others, and explore a beautiful, responsive feed — all while enjoying features like **instant notifications**, **smart captions**, and **personalized content** powered by **Gemini AI**.

---

## 🚀 Key Features

* 🔐 User Authentication (Sign up / Login / Logout)
* 🖼️ Upload & Share Images
* ❤️ Like & 💬 Comment on Posts
* 🔍 Explore Feed & Search Users
* 👤 View and Edit Profiles
* 🔔 **Real-Time Notifications** (Socket.IO)
* 🧠 **AI-Generated Captions & Hashtags** (Gemini API)
* 🌐 Fully Responsive (Mobile & Desktop)

---

## 🧠 Built-in AI Features (Gemini API)

Pixello uses **Gemini AI** to enhance user experience:

* ✨ **Smart Caption Generation:** AI analyzes uploaded images and provides short, context-aware captions (max 30 words).
* 🏷️ **Auto Hashtag Suggestions:** Based on image content and mood.
* 🔎 **Improved Search & Discoverability:** Tags help users explore content faster.

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Frontend      | React.js, Tailwind CSS, ShadCN UI |
| Backend       | Node.js, Express.js               |
| Database      | MongoDB (Mongoose)                |
| Auth          | JWT, bcrypt                       |
| Real-Time     | **Socket.IO**                     |
| AI            | **Gemini Vision API**             |
| Media Hosting | Cloudinary                        |

---


## ⚙️ Setup & Installation

### 1. Clone the Repo

```bash
https://github.com/samiha-mahin/Pixello.git
cd pixello
```

### 2. Add Environment Variables

#### `client/.env`

```env
GEMINI_API_KEY=your_gemini_api_key
```

#### `server/.env`

```env
MONGO_URI=your_mongo_uri
PORT=http: 5000
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 4. Run the App

```bash
# Start backend
cd server
npm run dev

# Start frontend (in a new terminal)
cd ../client
npm run dev
```

---

## 📡 Real-Time Features (Socket.IO)

* 🔔 Real-time notifications on likes, comments, follows
* 🟢 Live online user presence (future feature)
* 💬 Instant chat system (coming soon...)

---

## 🧑‍💻 Developer

**Samiha Muntaha Mahin**
💼 Full-Stack Developer | 🧠 AI Engineer | 🎨 Artist
[Portfolio](#) • [LinkedIn](#) • [GitHub](#)

---

## 📄 License

Licensed under the MIT License.

---

## 🗓️ Roadmap

* 🗨️ Real-time Direct Messaging
* 📁 Saved Posts / Collections
* 📬 In-app Notification Panel
* 🧠 AI-powered Personalized Feed

---



