# 🏺 Mitti Ka Swad — मिट्टी का स्वाद

<div align="center">

![Mitti Ka Swad Banner](https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&h=300&fit=crop&q=80)

**"जहाँ मिट्टी की खुशबू हो, वहीं असली स्वाद मिलता है।"**
*Where the fragrance of earth lives, there you find real flavour.*

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 About the Project

**Mitti Ka Swad** is not just a food ordering platform — it is a **cultural preservation initiative** built as a full-stack web application. It connects customers to authentic, traditional, and heritage Indian foods prepared by **local vendors, home chefs, and rural kitchens**.

Every dish on this platform carries:
- 📖 Its **cultural story** and heritage
- 👵 **Grandma's secret tip**
- 💡 A **"Did You Know?"** fact
- 🗺️ Its **regional origin** (28 states covered)
- 🪔 **Festival association** (Diwali, Holi, Pongal, Eid and more)

> **Mission:** *"To preserve India's culinary heritage and connect people to authentic traditional food and its stories."*

---

## ✨ Key Features

### 🛒 For Customers
- Browse **500+ heritage dishes** from 28 Indian states
- **Region-based discovery** (Madhya Pradesh, Rajasthan, Punjab, Bihar, Kerala, etc.)
- **Festival food highlights** (Diwali sweets, Holi treats, Pongal feast, Eid specials)
- **Cultural storytelling** on every dish detail page
- **Voice Search** in Hindi & English (Web Speech API)
- Cart management with **family order** option
- **Razorpay payment** — UPI, Cards, Net Banking, Wallets
- **Order tracking** with real-time status updates
- **Reviews & Ratings** with verified purchase badge
- **Food Stories** section — Grandma Recipes, Village Specials, Festival Stories

### 🍳 For Vendors (Home Chefs)
- Full **vendor dashboard** with revenue, order, and rating stats
- **Add dishes** with cultural story, cooking method, ingredients, "Did You Know", grandma tip
- **Edit & Delete** food listings
- **Toggle availability** and **featured** status per dish
- **Order management** with status updates (Pending → Preparing → Delivered)
- **Top performing dishes** analytics

### 🔐 Authentication & Roles
- JWT-based auth (access + refresh token auto-rotation)
- Three roles: **Customer**, **Vendor**, **Admin**
- Protected routes per role
- Profile with image upload and address book

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Framer Motion, Tailwind CSS |
| **Backend** | Django 4.2, Django REST Framework, SimpleJWT |
| **Database** | PostgreSQL 15 |
| **Payment** | Razorpay (UPI, Cards, Net Banking) |
| **Auth** | JWT (access 12h, refresh 7d, auto-rotation) |
| **Media** | Django media serving (Pillow) |
| **API Docs** | drf-spectacular (Swagger UI) |
| **Cache** | Redis (optional) |
| **Fonts** | Playfair Display, DM Sans, Tiro Devanagari Hindi |

---

## 🗂️ Project Structure

```
mitti-ka-swad/
│
├── 📁 backend/                        # Django Backend
│   ├── 📁 apps/
│   │   ├── 📁 users/                  # Custom user model, JWT auth, addresses
│   │   │   ├── models.py              # User (email-based), Address
│   │   │   ├── serializers.py         # Register, Login, Profile serializers
│   │   │   ├── views.py               # Auth views (register, login, profile)
│   │   │   └── urls.py
│   │   │
│   │   ├── 📁 foods/                  # Food items with cultural storytelling
│   │   │   ├── models.py              # FoodItem, FoodImage, Category
│   │   │   ├── serializers.py         # List, Detail, Create serializers
│   │   │   ├── views.py               # List, Detail, Featured, Region, Festival
│   │   │   └── urls.py
│   │   │
│   │   ├── 📁 orders/                 # Cart & Order management
│   │   │   ├── models.py              # Cart, CartItem, Order, OrderItem
│   │   │   ├── serializers.py
│   │   │   ├── views.py               # Cart CRUD, Checkout
│   │   │   └── urls.py
│   │   │
│   │   ├── 📁 payments/               # Razorpay integration
│   │   │   ├── models.py              # Payment (razorpay_order_id, signature)
│   │   │   ├── views.py               # Create order, Verify signature
│   │   │   └── urls.py
│   │   │
│   │   ├── 📁 reviews/                # Ratings & reviews
│   │   │   ├── models.py              # Review (rating, verified_purchase)
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   ├── 📁 stories/                # Cultural food storytelling blog
│   │   │   ├── models.py              # Story (grandma_recipe, village_special)
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   └── 📁 vendors/                # Vendor dashboard & management
│   │       ├── models.py              # VendorProfile
│   │       ├── views.py               # Dashboard, Food CRUD, Order status
│   │       └── urls.py
│   │
│   ├── 📁 config/
│   │   ├── settings.py                # Django settings
│   │   ├── urls.py                    # Root URL configuration
│   │   └── wsgi.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── 📁 frontend/                       # React Frontend
    ├── 📁 src/
    │   ├── 📁 api/
    │   │   └── index.js               # Axios client + all API calls
    │   │
    │   ├── 📁 context/
    │   │   ├── AuthContext.jsx        # JWT auth state
    │   │   └── CartContext.jsx        # Cart state
    │   │
    │   ├── 📁 components/
    │   │   ├── 📁 common/
    │   │   │   ├── Navbar.jsx         # Nav + voice search + cart badge
    │   │   │   ├── Footer.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── VendorRoute.jsx
    │   │   │   ├── StarRating.jsx
    │   │   │   ├── Skeletons.jsx
    │   │   │   └── Spinner.jsx
    │   │   └── 📁 food/
    │   │       ├── FoodCard.jsx       # Dish card with cart add
    │   │       └── FoodFilters.jsx    # Sidebar filters
    │   │
    │   ├── 📁 pages/
    │   │   ├── HomePage.jsx           # Hero + festivals + regions + stories
    │   │   ├── FoodListingPage.jsx    # Grid with filters + search + sort
    │   │   ├── FoodDetailPage.jsx     # Cultural story tabs + reviews
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx       # Address + Razorpay
    │   │   ├── OrderSuccessPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── StoriesPage.jsx
    │   │   ├── StoryDetailPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── FestivalPage.jsx
    │   │   ├── RegionPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   └── 📁 vendor/
    │   │       ├── VendorDashboard.jsx  # Stats + top dishes
    │   │       ├── VendorFoods.jsx      # Edit/Delete/Toggle foods
    │   │       ├── VendorAddFood.jsx    # 3-step add food form
    │   │       └── VendorOrders.jsx     # Order status management
    │   │
    │   ├── App.jsx                    # Routes
    │   ├── index.js
    │   └── index.css                  # Tailwind + Google Fonts + global styles
    │
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Python** 3.10+
- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **Redis** (optional, for caching)
- **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/mitti-ka-swad.git
cd mitti-ka-swad
```

---

### 2️⃣ Backend Setup (Django)

#### Create and activate virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL
DB_NAME=mitti_ka_swad
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Redis (optional)
REDIS_URL=redis://localhost:6379/0
```

#### Create PostgreSQL database

```bash
# Login to PostgreSQL
psql -U postgres

# Inside psql shell
CREATE DATABASE mitti_ka_swad;
\q
```

#### Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create a superuser

```bash
python manage.py createsuperuser
```

#### (Optional) Load sample data

```bash
python manage.py loaddata fixtures/sample_foods.json
```

#### Start the Django development server

```bash
python manage.py runserver
```

Backend will be running at: **http://localhost:8000**

API docs available at: **http://localhost:8000/api/docs/**

---

### 3️⃣ Frontend Setup (React)

```bash
cd ../frontend
# or if using the separate frontend folder:
cd mitti-ka-swad-frontend
```

#### Install dependencies

```bash
npm install
```

#### Configure environment variables

```bash
cp .env.example .env
```

Open `.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
REACT_APP_NAME=Mitti Ka Swad
```

#### Start the React development server

```bash
npm start
```

Frontend will be running at: **http://localhost:3000**

---

### 4️⃣ Running Both Together

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
python manage.py runserver

# Terminal 2 — Frontend
cd frontend
npm start
```

---

## 🔑 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register new user (customer or vendor) |
| `POST` | `/api/auth/login/` | Login — returns JWT access + refresh tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh access token |
| `GET`  | `/api/auth/profile/` | Get logged-in user profile |
| `PATCH`| `/api/auth/profile/` | Update profile |
| `GET`  | `/api/auth/addresses/` | List user addresses |
| `POST` | `/api/auth/addresses/` | Add new address |

### Foods
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/foods/` | List all foods (filters: region, food_type, festival_tag, price) |
| `GET` | `/api/foods/featured/` | Get featured dishes |
| `GET` | `/api/foods/<slug>/` | Get food detail with cultural story |
| `GET` | `/api/foods/region/<region>/` | Foods by region |
| `GET` | `/api/foods/festival/<festival>/` | Foods by festival |
| `GET` | `/api/foods/categories/` | All categories |

### Cart & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/orders/cart/` | Get current cart |
| `POST` | `/api/orders/cart/items/` | Add item to cart |
| `PATCH`| `/api/orders/cart/items/<id>/` | Update quantity |
| `DELETE`| `/api/orders/cart/items/<id>/` | Remove from cart |
| `POST` | `/api/orders/checkout/` | Place order |
| `GET`  | `/api/orders/` | Order history |
| `GET`  | `/api/orders/<id>/` | Order detail |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/create/` | Create Razorpay order |
| `POST` | `/api/payments/verify/` | Verify payment signature |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/reviews/<food_slug>/` | Get reviews for a dish |
| `POST` | `/api/reviews/<food_slug>/` | Submit review (auth required) |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/stories/` | List stories (filter: type) |
| `GET`  | `/api/stories/<slug>/` | Story detail |
| `POST` | `/api/stories/create/` | Create story (vendor/auth required) |

### Vendor
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/vendors/dashboard/` | Dashboard stats |
| `GET`  | `/api/vendors/foods/` | Vendor's food listings |
| `POST` | `/api/vendors/foods/add/` | Add new food |
| `PATCH`| `/api/vendors/foods/<id>/` | Edit food |
| `DELETE`| `/api/vendors/foods/<id>/` | Delete food |
| `PATCH`| `/api/vendors/foods/<id>/toggle/` | Toggle available/featured |
| `GET`  | `/api/vendors/orders/` | Vendor orders |
| `PATCH`| `/api/vendors/orders/<id>/status/` | Update order status |

---

## 🌐 Frontend Pages & Routes

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Home (Hero + Festivals + Regions + Stories) | No |
| `/foods` | Food Listing with filters | No |
| `/foods/:slug` | Food Detail (cultural story, reviews) | No |
| `/stories` | Food Stories listing | No |
| `/stories/:slug` | Story detail | No |
| `/festival/:fest` | Festival food page | No |
| `/region/:region` | Region food page | No |
| `/login` | Login | No |
| `/register` | Register (Customer or Vendor) | No |
| `/cart` | Cart | ✅ Customer |
| `/checkout` | Checkout + Razorpay | ✅ Customer |
| `/order-success/:id` | Order confirmation | ✅ Customer |
| `/orders` | Order history | ✅ Customer |
| `/profile` | User profile | ✅ Customer |
| `/vendor/dashboard` | Vendor stats dashboard | ✅ Vendor |
| `/vendor/foods` | Manage food listings | ✅ Vendor |
| `/vendor/foods/add` | Add new dish (3-step) | ✅ Vendor |
| `/vendor/orders` | Vendor orders | ✅ Vendor |

---

## 💳 Razorpay Payment Flow

```
Customer clicks "Pay"
        ↓
Frontend: POST /api/payments/create/ → gets razorpay_order_id
        ↓
Razorpay Checkout popup opens (UPI / Card / Net Banking)
        ↓
Customer completes payment
        ↓
Frontend: POST /api/payments/verify/ with signature
        ↓
Backend: HMAC SHA256 signature verification
        ↓
Order status → "confirmed", payment_status → "paid"
        ↓
Redirect to /order-success/:id
```

---

## 🎨 Design System

The UI uses a custom earthy Indian color palette defined in `tailwind.config.js`:

| Color | Value | Usage |
|-------|-------|-------|
| `cream` | `#fdf6e8` | Page background |
| `parch` | `#f5e8c8` | Section backgrounds |
| `earth-*` | Brown scale | Text, borders |
| `spice-*` | Red-orange scale | Primary actions, CTAs |
| `turmeric-*` | Golden yellow | Accents, festivals |
| `forest-*` | Green scale | Veg badges, success |
| `sand` | `#e8d5a0` | Borders |

**Fonts:**
- `Playfair Display` — headings (serif, editorial)
- `DM Sans` — body text (clean, readable)
- `Tiro Devanagari Hindi` — Hindi text

---

## 🔧 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | ✅ | Django secret key |
| `DEBUG` | ✅ | `True` for dev, `False` for production |
| `ALLOWED_HOSTS` | ✅ | Comma-separated allowed hosts |
| `DB_NAME` | ✅ | PostgreSQL database name |
| `DB_USER` | ✅ | PostgreSQL username |
| `DB_PASSWORD` | ✅ | PostgreSQL password |
| `DB_HOST` | ✅ | Database host (default: localhost) |
| `DB_PORT` | ✅ | Database port (default: 5432) |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID (starts with `rzp_`) |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay secret key |
| `REDIS_URL` | ❌ | Redis URL for caching (optional) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | ✅ | Django backend API URL |
| `REACT_APP_RAZORPAY_KEY` | ✅ | Razorpay public key (same as `RAZORPAY_KEY_ID`) |
| `REACT_APP_NAME` | ❌ | App name (default: Mitti Ka Swad) |

---

## 🐛 Known Bugs Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Checkout 500 error | `Decimal + int` type mismatch in `Cart.total_price` | Changed `total = 0` → `total = Decimal('0.00')` |
| Vendor dashboard 500 | `models.F()` used without importing `models` | Changed to `from django.db.models import F, Sum, Avg` |
| Vendor edit silent fail | `FoodItemCreateSerializer` had `slug` required + sent `FormData` for text-only edit | Made `slug` optional, added `update()` method, frontend sends JSON |
| Address pagination warning | `Address` queryset unordered | Added `ordering = ["-is_default", "id"]` to `Address.Meta` |

---

## 📱 Features Roadmap

- [ ] AI-based dish recommendations (taste + region + history)
- [ ] Location-based suggestions (GPS)
- [ ] Real-time order tracking (WebSockets / Django Channels)
- [ ] Push notifications (FCM)
- [ ] Vendor earnings analytics (charts)
- [ ] Food video/reels upload
- [ ] Multi-language support (Hindi, Tamil, Bengali)
- [ ] Mobile app (React Native)
- [ ] Admin panel customization (Django Admin)
- [ ] Email notifications (order confirmation, OTP)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add: my feature description'`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a **Pull Request**

### Commit Convention

```
Add: new feature
Fix: bug fix
Update: changes to existing feature
Remove: deleted feature or file
Docs: documentation changes
Style: formatting, no logic change
Refactor: code restructure
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mitti Ka Swad** — Built with ❤️ for Bharat's culinary heritage.
"Manish Dange"

> *"I am not just ordering food, I am experiencing Indian culture."*
> *— मैं सिर्फ खाना नहीं, संस्कृति का अनुभव कर रहा हूँ।*

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub!**

Made with 🧡 for India's 5000+ year old food culture

</div>
