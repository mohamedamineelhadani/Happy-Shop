<?php

require_once __DIR__ . '/../core/Model.php';

class Admin extends Model
{
    protected string $table = 'admins';

    protected array $fillable = ['name', 'email', 'password_hash', 'role'];

    public function findByEmail(string $email): ?array
    {
        return $this->db->one('SELECT * FROM admins WHERE email = ? LIMIT 1', [$email]);
    }
}
