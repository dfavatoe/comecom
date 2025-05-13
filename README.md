# 🛒 Com&Com - E-commerce Platform with AI Assistant 🤖

**Com&Com** is a full-stack e-commerce web application built with modern technologies like **Next.js App Router**, **TypeScript**, **MongoDB**, and **OpenAI**.  
It provides a full online marketplace experience, combining traditional product management with a built-in **AI-powered assistant** that can answer product-specific questions using live database data.

---

## 🚀 Features

- ✅ User authentication with **NextAuth**
- ✅ Role system: **buyer** and **seller**
- ✅ Sellers can create, update, and delete products
- ✅ Buyers can browse products, add reviews, and make reservations
- ✅ **AI Assistant chatbot** integrated in the UI
- ✅ AI only answers based on real data from MongoDB
- ✅ Product image uploads using **Cloudinary**
- ✅ Interactive product forms with validation
- ✅ Address/location system with full structure
- ✅ Mobile-friendly UI using **MUI (Material UI)**

---

## 🧠 AI Assistant

The chatbot is powered by **OpenAI GPT-3.5**, and is fully integrated using your own product database.

- AI reads only product data + seller data + address
- It answers questions like:
  - “What is the price of this item?”
  - “Who is the seller?”
  - “What’s the market address?”
- It does **not** answer anything outside your real data
- No chat history is saved — it’s a live response

---

## 🧩 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, MUI
- **Backend**: Node.js, MongoDB, Mongoose, REST API routes
- **Auth**: NextAuth (with credentials provider)
- **AI**: OpenAI GPT-3.5 (custom prompt from DB)
- **File Uploads**: Cloudinary
- **Maps & Addressing**: Manual + Leaflet
- **Validation**: Zod

---

## 📁 Pages & Structure

- `/` – Home page with user avatar + AI chat bubble
- `/login` – Login form with credentials
- `/register` – Registration form (with role selector)
- `/dashboard` – Role-based dashboard
- `/products` – Product listing for all users
- `/ai-chat` – Internal API route for AI responses
- `/api/...` – RESTful API for posts, comments, auth, products

---

## 📦 Forms

- Add product form (with image + description + stock + dimensions)
- Review form for buyers
- Chat input for AI
- File/image upload form
- User login/register

---

## 🛠️ How to Run Locally

1. **Clone the repo**

```bash
git clone https://github.com/your-username/comcom
cd comcom
```
