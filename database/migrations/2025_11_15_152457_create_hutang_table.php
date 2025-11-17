<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hutang', function (Blueprint $table) {
            $table->increments('hutang_id');

            $table->unsignedInteger('transaksi_id');
            $table->integer('hutang_total');
            $table->boolean('is_dibayar')->default(false);
            $table->timestamp('tgl_hutang')->useCurrent();

            $table->foreign('transaksi_id')
                ->references('transaksi_id')->on('transaksi')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hutang');
    }
};
