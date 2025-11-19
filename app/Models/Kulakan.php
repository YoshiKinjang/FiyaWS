<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kulakan extends Model
{
    protected $table = 'pengeluaran_kulakan';
    protected $primaryKey = 'pengeluaran_kulakan_id';

    public $timestamps = false;
    protected $fillable = [
        
    ];
}
