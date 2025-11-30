# 👁️ Eye Clinic Management System

A modern, full-stack web application for managing eye clinics and optical shops with role-based access control, appointment scheduling, e-commerce functionality, and comprehensive reporting.

![Laravel](https://img.shields.io/badge/Laravel-12-red)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)
![PHP](https://img.shields.io/badge/PHP-8.2-purple)

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin**: Full system control, user management, inventory, reports
- **Doctor/Optometrist**: Patient management, prescriptions, appointments
- **Client/Patient**: Appointment booking, shopping, prescription viewing

### 📅 Appointment Management
- Calendar-based booking interface
- Doctor schedule management
- Real-time availability checking
- Appointment status tracking (pending, approved, declined, completed)
- Email/toast notifications

### 👨‍⚕️ Patient Records
- Comprehensive prescription management
- Visual acuity records
- Sphere, Cylinder, Axis, PD measurements
- Prescription history tracking
- Doctor notes and recommendations

### 🛒 E-Commerce Shop
- Product catalog (eyeglasses, sunglasses, contacts, accessories)
- Shopping cart functionality
- Order management and tracking
- Inventory control
- Multiple product categories and filters

### 📊 Reports & Analytics
- Revenue tracking (daily, monthly, yearly)
- Top-selling products
- Appointment trends
- Patient statistics
- Low stock alerts

### 🔔 Notifications
- Real-time toast notifications
- Appointment confirmations
- Order status updates
- Prescription availability alerts

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **Inertia.js** - Modern monolith architecture
- **Laravel Fortify** - Authentication
- **Laravel Sanctum** - API token authentication
- **MySQL** - Database

### Frontend
- **React 18** - UI library
- **TailwindCSS 3** - Utility-first CSS
- **React Hot Toast** - Toast notifications
- **FullCalendar** - Calendar interface
- **Vite** - Build tool

## 📋 Prerequisites

Before installation, ensure you have:

- **PHP >= 8.2** with extensions: OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON
- **Composer** - PHP dependency manager
- **Node.js >= 18** and npm
- **MySQL/MariaDB** - Database server
- **Git** - Version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finals_sys
```

### 2. Create Database

Open MySQL and create the database:

```sql
CREATE DATABASE final_sys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run Setup Script (Windows)

```cmd
setup.bat
```

Or follow manual installation steps below.

## 📦 Manual Installation

### Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file (already exists)
# Update .env if needed (DB credentials)

# Generate application key (if not done)
php artisan key:generate

# Run migrations and seed data
php artisan migrate:fresh --seed

# Create storage link
php artisan storage:link
```

### Frontend Setup

```bash
cd backend

# Install JavaScript dependencies
npm install

# Build assets (for production)
npm run build

# Or run dev server (for development)
npm run dev
```

## 🎮 Running the Application

### Development Mode

**Option 1: All-in-one command**
```bash
cd backend
composer dev
```

This starts:
- Laravel server (http://localhost:8000)
- Vite dev server (hot reload)
- Queue worker

**Option 2: Separate terminals**

Terminal 1 - Backend:
```bash
cd backend
php artisan serve
```

Terminal 2 - Frontend:
```bash
cd backend
npm run dev
```

Terminal 3 - Queue (optional):
```bash
cd backend
php artisan queue:work
```

### Access the Application

Open your browser and go to:
```
http://localhost:8000
```

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@eyeclinic.com | password |
| **Doctor** | dr.smith@eyeclinic.com | password |
| **Doctor 2** | dr.johnson@eyeclinic.com | password |
| **Client** | john@example.com | password |
| **Client 2** | jane@example.com | password |

## 📁 Project Structure

```
finals_sys/
├── backend/              # Laravel application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Admin/      # Admin controllers
│   │   │   │   ├── Doctor/     # Doctor controllers
│   │   │   │   └── Client/     # Client controllers
│   │   │   └── Middleware/     # Role-based middleware
│   │   ├── Models/             # Eloquent models
│   │   └── ...
│   ├── database/
│   │   ├── migrations/         # Database schema
│   │   └── seeders/           # Sample data
│   ├── resources/
│   │   └── js/
│   │       └── pages/         # React components
│   ├── routes/
│   │   └── web.php           # Application routes
│   └── ...
├── frontend/            # Separate frontend (optional)
├── SETUP_GUIDE.md      # Detailed setup instructions
└── README.md           # This file
```

## 🎨 UI Components

### Color Palette

| Purpose | Color Name | Hex Code |
|---------|-----------|----------|
| Primary | Deep Blue | `#1E3A8A` |
| Accent | Aqua | `#06B6D4` |
| Light | Ice Gray | `#F1F5F9` |
| Dark | Gunmetal | `#0F172A` |
| Success | Emerald | `#10B981` |
| Danger | Red | `#EF4444` |

### Key Components
- **Modals** - All CRUD operations
- **Toast Notifications** - User feedback
- **Calendar Interface** - Appointment scheduling
- **Dashboard Cards** - Statistics display
- **Data Tables** - Paginated listings
- **Forms** - Validated user inputs

## 📊 Database Schema

### Core Tables

1. **users** - All system users with roles
2. **appointments** - Appointment bookings
3. **doctor_schedules** - Doctor availability
4. **prescriptions** - Patient prescriptions
5. **products** - Shop inventory
6. **orders** - Customer orders
7. **order_items** - Order details
8. **cart** - Shopping cart items
9. **notifications** - System notifications

## 🔒 Security Features

- ✅ Role-based access control
- ✅ CSRF protection
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection
- ✅ Authentication middleware
- ✅ Route protection

## 🧪 Testing

```bash
cd backend

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check `.env` database credentials
- Ensure database `final_sys` exists

### Migration Failed
```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate:fresh --seed
```

### Frontend Not Loading
```bash
npm run build
php artisan inertia:start-ssr
```

### Permission Errors
```bash
chmod -R 775 storage bootstrap/cache
```

## 📚 API Endpoints

### Admin Routes
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - User management
- `GET /admin/products` - Product management
- `GET /admin/orders` - Order management
- `GET /admin/reports` - Reports & analytics

### Doctor Routes
- `GET /doctor/dashboard` - Doctor dashboard
- `GET /doctor/appointments` - Appointment management
- `GET /doctor/patients` - Patient records
- `GET /doctor/prescriptions` - Prescription management
- `GET /doctor/schedule` - Schedule management

### Client Routes
- `GET /client/dashboard` - Client dashboard
- `GET /client/appointments` - Book appointments
- `GET /client/shop` - Browse products
- `GET /client/cart` - Shopping cart
- `GET /client/orders` - Order history
- `GET /client/prescriptions` - View prescriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Laravel Community
- React Community
- TailwindCSS Team
- Inertia.js Team

## 📞 Support

For support, email support@eyeclinic.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] SMS notifications
- [ ] Email appointment reminders
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Telemedicine integration
- [ ] Insurance claim processing
- [ ] Advanced reporting with charts
- [ ] Export reports to PDF/Excel

---

**Made with ❤️ for Eye Clinics and Optical Shops**
