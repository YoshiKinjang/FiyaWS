<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisPengeluaran extends Model
{
    use HasFactory;

    protected $table = 'jenis_pengeluaran';
    protected $primaryKey = 'jenis_pengeluaran_id';

    public $timestamps = false;

    protected $fillable = [
        'jenis',
    ];
}
