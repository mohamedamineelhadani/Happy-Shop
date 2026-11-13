<?php

require_once __DIR__ . '/../core/Model.php';

class Review extends Model
{
    protected string $table = 'reviews';

    protected array $fillable = ['product_id', 'author', 'rating', 'comment'];

    public function forProduct(int $productId): array
    {
        $rows = $this->db->all(
            "SELECT id, author, rating, comment, created_at
             FROM reviews
             WHERE product_id = ?
             ORDER BY created_at DESC, id DESC",
            [$productId]
        );

        return array_map([$this, 'present'], $rows);
    }

    public function present(array $row): array
    {
        return [
            'id'         => (int) $row['id'],
            'author'     => $row['author'],
            'rating'     => (int) $row['rating'],
            'comment'    => $row['comment'],
            'created_at' => $row['created_at'] ?? null,
        ];
    }
}
