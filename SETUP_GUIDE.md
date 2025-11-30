# Eye Clinic Management System - Setup Guide

## 🎯 System Overview

A comprehensive role-based web platform for eye clinics and optical shops featuring:
- **Appointment Management** - Calendar-based booking system
- **Patient Records** - Prescriptions and medical history
- **E-commerce Shop** - Eyeglasses and accessories
- **Reports & Analytics** - Business insights and trends

## 👥 User Roles

1. **Admin** - Full system control, user management, inventory, orders, reports
2. **Doctor/Optometrist** - Appointments, patient records, prescriptions, schedules
3. **Client/Patient** - Book appointments, shop products, view prescriptions

## 📋 Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL/MariaDB
- Git

## 🚀 Installation Steps

### 1. Database Setup

Open your MySQL client (phpMyAdmin, MySQL Workbench, or command line) and create the database:

```sql
CREATE DATABASE final_sys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Install Dependencies

```powershell
# Backend dependencies
cd backend
composer install

# Frontend dependencies (if separate frontend)
cd ../frontend
npm install
```

### 3. Configure Environment

The `.env` file is already configured. Verify these settings:

```
DB_DATABASE=final_sys
DB_USERNAME=root
DB_PASSWORD=
```

If your MySQL has a password, update `DB_PASSWORD` accordingly.

### 4. Generate Application Key (if not already done)

```powershell
cd backend
php artisan key:generate
```

### 5. Run Migrations and Seed Data

```powershell
php artisan migrate:fresh --seed
```

This will create all tables and populate sample data.

### 6. Create Storage Link

```powershell
php artisan storage:link
```

### 7. Install Frontend Dependencies

```powershell
npm install
```

## 🔐 Default Login Credentials

After seeding, use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@eyeclinic.com | password |
| **Doctor** | dr.smith@eyeclinic.com | password |
| **Doctor 2** | dr.johnson@eyeclinic.com | password |
| **Client** | john@example.com | password |
| **Client 2** | jane@example.com | password |
| **Client 3** | robert@example.com | password |

## 🎨 Color Palette

The system uses the following color scheme:

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary | Deep Blue | `#1E3A8A` |
| Accent | Aqua | `#06B6D4` |
| Light | Ice Gray | `#F1F5F9` |
| Dark | Gunmetal | `#0F172A` |
| Success | Emerald | `#10B981` |
| Danger | Red | `#EF4444` |

## 🏃‍♂️ Running the Application

### Development Mode

Run both the backend server and frontend dev server:

```powershell
cd backend
composer dev
```

This will start:
- Laravel server on http://localhost:8000
- Vite dev server for hot module replacement
- Queue worker for background jobs

Or run them separately:

```powershell
# Terminal 1 - Laravel server
cd backend
php artisan serve

# Terminal 2 - Vite frontend
cd backend
npm run dev

# Terminal 3 - Queue worker (optional)
php artisan queue:work
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## 📦 Database Schema

### Core Tables

1. **users** - All users (admin, doctor, client)
2. **appointments** - Appointment bookings
3. **doctor_schedules** - Doctor availability
4. **prescriptions** - Patient prescriptions
5. **products** - Eyeglasses and accessories
6. **orders** - Client orders
7. **order_items** - Products in orders
8. **cart** - Shopping cart items
9. **notifications** - System notifications

## 🎯 Key Features by Role

### Admin Dashboard
- User management (CRUD for all users)
- Inventory management (products)
- Order management
- Appointment overview
- Reports & analytics
- System settings

### Doctor Dashboard
- Daily appointments overview
- Patient records management
- Prescription creation/management
- Schedule management
- Appointment approval/decline

### Client Dashboard
- Book appointments with calendar
- Browse and purchase eyeglasses
- Shopping cart & checkout
- Order tracking
- View prescriptions
- Profile management

## 🔧 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `final_sys` exists

### Migration Errors
- Drop and recreate database: `php artisan migrate:fresh --seed`
- Clear cache: `php artisan config:clear`

### Frontend Issues
- Clear node modules: `rm -r node_modules && npm install`
- Clear Vite cache: `npm run build`

## 📚 Tech Stack

**Backend:**
- Laravel 12
- Inertia.js
- Fortify (Authentication)
- Sanctum (API tokens)

**Frontend:**
- React
- TailwindCSS
- React Hot Toast (notifications)
- FullCalendar (appointment scheduling)

## 🎨 UI Components

The system uses:
- **Modals** - For all CRUD operations
- **Toast Notifications** - Success/error messages
- **Calendar** - Appointment booking interface
- **Dashboard Cards** - Statistics display
- **Tables** - Data listing with pagination
- **Forms** - User inputs with validation

## 📝 Development Notes

### Adding New Features
1. Create migration: `php artisan make:migration create_table_name`
2. Create model: `php artisan make:model ModelName`
3. Create controller: `php artisan make:controller ControllerName`
4. Add routes in `routes/web.php`
5. Create React components in `resources/js/pages/`

### Testing
```powershell
php artisan test
```

## 🔐 Security

- All routes protected by authentication middleware
- Role-based access control (admin, doctor, client)
- CSRF protection enabled
- Password hashing with bcrypt
- SQL injection prevention (Eloquent ORM)

## 📧 Support

For issues or questions, refer to Laravel documentation:
- https://laravel.com/docs
- https://inertiajs.com/

## 🎉 Next Steps

After setup:
1. Log in as admin to explore user management
2. Log in as doctor to see appointment management
3. Log in as client to test booking and shopping
4. Customize branding and colors
5. Add your clinic's information
6. Configure email settings for notifications

---

**Made with ❤️ for Eye Clinics and Optical Shops**
