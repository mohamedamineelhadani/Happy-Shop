<?php

require_once __DIR__ . '/../core/Model.php';

class Subscriber extends Model
{
    protected string $table = 'subscribers';

    protected array $fillable = ['email', 'is_active'];

    public function adminListing(): array
    {
        $rows = $this->db->all('SELECT * FROM subscribers ORDER BY created_at DESC, id DESC');
        return array_map([$this, 'present'], $rows);
    }

    public function activeCount(): int
    {
        return (int) $this->db->value('SELECT COUNT(*) FROM subscribers WHERE is_active = 1');
    }

    public function findByEmail(string $email): ?array
    {
        return $this->findBy('email', $email);
    }

    public function present(array $row): array
    {
        return [
            'id'         => (int) $row['id'],
            'email'      => $row['email'],
            'is_active'  => (bool) $row['is_active'],
            'created_at' => $row['created_at'] ?? null,
        ];
    }
}
