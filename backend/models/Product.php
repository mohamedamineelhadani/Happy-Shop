<?php

require_once __DIR__ . '/../core/Model.php';

class Product extends Model
{
    protected string $table = 'products';

    protected array $fillable = [
        'category_id',
        'title',
        'slug',
        'price',
        'old_price',
        'description',
        'image',
        'stock',
        'featured',
        'status',
    ];

    /** Filtered, sorted and paginated catalogue. */
    public function listing(array $filters = []): array
    {
        $where = ["p.status = 'active'"];
        $params = [];

        if (!empty($filters['category'])) {
            $where[] = 'c.slug = ?';
            $params[] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $where[] = '(p.title LIKE ? OR p.description LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['featured'])) {
            $where[] = 'p.featured = 1';
        }

        if (isset($filters['min']) && is_numeric($filters['min'])) {
            $where[] = 'p.price >= ?';
            $params[] = (float) $filters['min'];
        }

        if (isset($filters['max']) && is_numeric($filters['max'])) {
            $where[] = 'p.price <= ?';
            $params[] = (float) $filters['max'];
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $orderBy = match ($filters['sort'] ?? 'newest') {
            'price_asc'  => 'p.price ASC',
            'price_desc' => 'p.price DESC',
            'rating'     => 'rating DESC, p.id DESC',
            'title'      => 'p.title ASC',
            default      => 'p.created_at DESC, p.id DESC',
        };

        $total = (int) $this->db->value(
            "SELECT COUNT(*) FROM products p LEFT JOIN categories c ON c.id = p.category_id {$whereSql}",
            $params
        );

        $perPage = max(1, min(48, (int) ($filters['per_page'] ?? 12)));
        $page = max(1, (int) ($filters['page'] ?? 1));
        $offset = ($page - 1) * $perPage;

        $sql = $this->baseSelect() . " {$whereSql} ORDER BY {$orderBy} LIMIT {$perPage} OFFSET {$offset}";
        $items = array_map([$this, 'present'], $this->db->all($sql, $params));

        return [
            'items' => $items,
            'meta'  => [
                'total'    => $total,
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => (int) ceil($total / $perPage),
            ],
        ];
    }

    /** Fetch a single product by slug, or by numeric id as a fallback. */
    public function details(string $key): ?array
    {
        $row = null;

        if (ctype_digit($key)) {
            $row = $this->db->one($this->baseSelect() . ' WHERE p.id = ? LIMIT 1', [(int) $key]);
        }

        if ($row === null) {
            $row = $this->db->one($this->baseSelect() . ' WHERE p.slug = ? LIMIT 1', [$key]);
        }

        return $row === null ? null : $this->present($row);
    }

    /** Products sharing a category, used for "you may also like". */
    public function related(int $productId, ?int $categoryId, int $limit = 4): array
    {
        if ($categoryId === null) {
            return [];
        }

        $rows = $this->db->all(
            $this->baseSelect() . " WHERE p.status = 'active' AND p.category_id = ? AND p.id <> ? ORDER BY RAND() LIMIT " . max(1, $limit),
            [$categoryId, $productId]
        );

        return array_map([$this, 'present'], $rows);
    }

    /** All products for the admin table, including drafts/archived. */
    public function adminListing(array $filters = []): array
    {
        $where = ['1 = 1'];
        $params = [];

        if (!empty($filters['search'])) {
            $where[] = '(p.title LIKE ? OR p.slug LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['category_id']) && is_numeric($filters['category_id'])) {
            $where[] = 'p.category_id = ?';
            $params[] = (int) $filters['category_id'];
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $rows = $this->db->all(
            $this->baseSelect() . " {$whereSql} ORDER BY p.created_at DESC, p.id DESC",
            $params
        );

        return array_map([$this, 'present'], $rows);
    }

    public function lowStock(int $threshold = 5): array
    {
        $rows = $this->db->all(
            $this->baseSelect() . " WHERE p.status = 'active' AND p.stock <= ? ORDER BY p.stock ASC LIMIT 5",
            [$threshold]
        );

        return array_map([$this, 'present'], $rows);
    }

    private function baseSelect(): string
    {
        return "SELECT p.*, c.name AS category_name, c.slug AS category_slug,
                       COALESCE(r.avg_rating, 0) AS rating,
                       COALESCE(r.review_count, 0) AS review_count
                FROM products p
                LEFT JOIN categories c ON c.id = p.category_id
                LEFT JOIN (
                    SELECT product_id,
                           ROUND(AVG(rating), 1) AS avg_rating,
                           COUNT(*) AS review_count
                    FROM reviews
                    GROUP BY product_id
                ) r ON r.product_id = p.id";
    }

    public function present(array $row): array
    {
        return [
            'id'           => (int) $row['id'],
            'title'        => $row['title'],
            'slug'         => $row['slug'],
            'price'        => (float) $row['price'],
            'old_price'    => $row['old_price'] !== null ? (float) $row['old_price'] : null,
            'description'  => $row['description'],
            'image'        => $row['image'],
            'stock'        => (int) $row['stock'],
            'featured'     => (bool) $row['featured'],
            'status'       => $row['status'],
            'category'     => $row['category_id'] !== null ? [
                'id'   => (int) $row['category_id'],
                'name' => $row['category_name'],
                'slug' => $row['category_slug'],
            ] : null,
            'rating'       => (float) ($row['rating'] ?? 0),
            'review_count' => (int) ($row['review_count'] ?? 0),
            'created_at'   => $row['created_at'] ?? null,
        ];
    }
}
