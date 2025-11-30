<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'client_id',
        'doctor_id',
        'right_sphere',
        'right_cylinder',
        'right_axis',
        'right_add',
        'left_sphere',
        'left_cylinder',
        'left_axis',
        'left_add',
        'pd',
        'notes',
        'prescription_date',
        'expiry_date',
    ];

    protected $casts = [
        'prescription_date' => 'date',
        'expiry_date' => 'date',
        'right_sphere' => 'decimal:2',
        'right_cylinder' => 'decimal:2',
        'right_axis' => 'integer',
        'right_add' => 'decimal:2',
        'left_sphere' => 'decimal:2',
        'left_cylinder' => 'decimal:2',
        'left_axis' => 'integer',
        'left_add' => 'decimal:2',
        'pd' => 'decimal:2',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }
}
