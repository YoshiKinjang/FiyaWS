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
        Schema::create('pengeluaran_lainnya', function (Blueprint $table) {
            $table->increments('pengeluaran_lainnya_id');

            $table->unsignedBigInteger('user_id');
            $table->unsignedInteger('jenis_pengeluaran_id')->nullable();

            $table->integer('subtotal');
            $table->text('note')->nullable();
            $table->timestamp('tgl_pengeluaran')->useCurrent();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('restrict');

            $table->foreign('jenis_pengeluaran_id')
                ->references('jenis_pengeluaran_id')->on('jenis_pengeluaran')
                ->onUpdate('cascade')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluaran_lainnya');
    }
};
