<?php

require_once __DIR__ . '/../core/Model.php';

class Contact extends Model
{
    protected string $table = 'contacts';

    protected array $fillable = ['full_name', 'email', 'phone', 'subject', 'message', 'is_read'];

    public function adminListing(): array
    {
        $rows = $this->db->all('SELECT * FROM contacts ORDER BY created_at DESC, id DESC');
        return array_map([$this, 'present'], $rows);
    }

    public function unreadCount(): int
    {
        return (int) $this->db->value('SELECT COUNT(*) FROM contacts WHERE is_read = 0');
    }

    public function present(array $row): array
    {
        return [
            'id'         => (int) $row['id'],
            'full_name'  => $row['full_name'],
            'email'      => $row['email'],
            'phone'      => $row['phone'],
            'subject'    => $row['subject'],
            'message'    => $row['message'],
            'is_read'    => (bool) $row['is_read'],
            'created_at' => $row['created_at'] ?? null,
        ];
    }
}
