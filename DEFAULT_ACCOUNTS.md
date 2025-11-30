# Default User Accounts

The database has been seeded with the following default accounts for testing and development:

## Admin Account
- **Email:** admin@eyeclinic.com
- **Password:** password
- **Role:** Administrator
- **Access:** Full system access including user management, products, orders, appointments, and reports

## Doctor Accounts

### Doctor 1
- **Email:** doctor@eyeclinic.com
- **Password:** password
- **Role:** Doctor
- **Schedule:** Monday-Friday, 9:00 AM - 5:00 PM
- **Access:** Appointments, patients, prescriptions, and schedule management

### Doctor 2
- **Email:** doctor2@eyeclinic.com
- **Password:** password
- **Role:** Doctor
- **Schedule:** Monday-Friday, 10:00 AM - 6:00 PM
- **Access:** Appointments, patients, prescriptions, and schedule management

## Client Accounts

### Client 1
- **Email:** client@eyeclinic.com
- **Password:** password
- **Role:** Client
- **Access:** Book appointments, shop products, view prescriptions, manage orders

### Client 2
- **Email:** client2@eyeclinic.com
- **Password:** password
- **Role:** Client
- **Access:** Book appointments, shop products, view prescriptions, manage orders

### Client 3
- **Email:** client3@eyeclinic.com
- **Password:** password
- **Role:** Client
- **Access:** Book appointments, shop products, view prescriptions, manage orders

## Default Products

The system also includes 8 pre-configured products:
1. Classic Aviator Sunglasses - ₱2,500
2. Modern Rectangle Frames - ₱3,500
3. Round Vintage Frames - ₱2,800
4. Sports Performance Sunglasses - ₱4,200
5. Daily Contact Lenses (30 pack) - ₱1,500
6. Blue Light Blocking Glasses - ₱1,800
7. Eyeglass Cleaning Kit - ₱450
8. Hard Shell Eyeglass Case - ₱350

## Archive Feature

The system now supports soft deletion (archiving) of users:

### Active Users View
- Default view showing all active users
- Edit and Archive buttons available
- Archiving moves users to archive without permanent deletion

### Archive View
- Toggle to view archived users
- Restore button to reactivate archived users
- Permanent Delete button for complete removal
- Users can be restored at any time unless permanently deleted

### Important Notes
- Admin users cannot delete/archive their own account (safety feature)
- Archived users can be restored with all their data intact
- Permanent deletion cannot be undone
- All passwords are hashed using Laravel's secure hashing

## To Reseed Database

If you need to reset the database and reseed all default data:

```bash
cd backend
php artisan migrate:fresh --seed
```

This will drop all tables, run migrations, and seed with default data.
