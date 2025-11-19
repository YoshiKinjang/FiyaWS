<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengeluaranLainnya extends Model
{
    use HasFactory;

    protected $table = 'pengeluaran_lainnya';
    protected $primaryKey = 'pengeluaran_lainnya_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'jenis_pengeluaran_id',
        'subtotal',
        'note',
        'tgl_pengeluaran',
    ];

    public function jenisPengeluaran()
    {
        return $this->belongsTo(JenisPengeluaran::class, 'jenis_pengeluaran_id', 'jenis_pengeluaran_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
