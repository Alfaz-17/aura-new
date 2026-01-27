# Branch Documentation

This document describes the branching strategy and features in each branch.

---

## `main` — Production-Ready

The stable, production branch containing verified features.

### Recent Features:
- **Global Cloudinary Image Optimization** — All images are automatically resized and compressed using Cloudinary transformations for faster loading and reduced bandwidth.
  - Utility: `lib/cloudinary.ts`
  - Applied in: Product cards, galleries, navigation, mini-cart, archive, signature, heritage, and hero sections.

---

## `feature/gemini-ai-analysis` — AI Product Analysis (Experimental)

Contains the Gemini AI integration for automatic product detail generation.

### Features:
- **AI-Powered Product Analysis** — Upload an image and click the ✨ Sparkles button to auto-fill:
  - Title
  - Description
  - Category
  - Material
  - Dimensions
- **API Endpoint:** `app/api/ai/analyze-product/route.ts`
- **Model:** `gemini-2.0-flash`
- **Token Optimization:** Images are resized before being sent to AI to minimize costs.

### Setup:
1. Add `GEMINI_API_KEY` to your `.env` file.
2. Get your key from [Google AI Studio](https://aistudio.google.com/apikey).

### How to Merge:
```bash
git checkout main
git merge feature/gemini-ai-analysis
git push origin main
```

---

## Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | AI Feature |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Image Uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Image Uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Image Uploads |
| `MONGODB_URI` | MongoDB connection string | Database |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Authentication |
