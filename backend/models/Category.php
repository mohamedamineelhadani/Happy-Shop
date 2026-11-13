<?php

require_once __DIR__ . '/../core/Model.php';

class Category extends Model
{
    protected string $table = 'categories';

    protected array $fillable = ['name', 'slug', 'description', 'icon'];

    /** Every category with the number of active products it holds. */
    public function withCounts(): array
    {
        $rows = $this->db->all(
            "SELECT c.*, (
                SELECT COUNT(*) FROM products p
                WHERE p.category_id = c.id AND p.status = 'active'
             ) AS product_count
             FROM categories c
             ORDER BY c.name ASC"
        );

        return array_map([$this, 'present'], $rows);
    }

    public function findBySlug(string $slug): ?array
    {
        $row = $this->db->one(
            "SELECT c.*, (
                SELECT COUNT(*) FROM products p
                WHERE p.category_id = c.id AND p.status = 'active'
             ) AS product_count
             FROM categories c
             WHERE c.slug = ? LIMIT 1",
            [$slug]
        );

        return $row === null ? null : $this->present($row);
    }

    public function present(array $row): array
    {
        return [
            'id'            => (int) $row['id'],
            'name'          => $row['name'],
            'slug'          => $row['slug'],
            'description'   => $row['description'],
            'icon'          => $row['icon'],
            'product_count' => (int) ($row['product_count'] ?? 0),
        ];
    }
}
