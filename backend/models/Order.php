<?php

require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php';

class Order extends Model
{
    protected string $table = 'orders';

    protected array $fillable = [
        'reference',
        'customer_name',
        'email',
        'phone',
        'address',
        'city',
        'note',
        'subtotal',
        'shipping',
        'total',
        'status',
    ];

    /**
     * Persist an order and its items atomically, decrementing stock.
     *
     * @return array{id:int, reference:string}
     */
    public function createWithItems(array $order, array $items): array
    {
        return $this->db->transaction(function (Database $db) use ($order, $items): array {
            $temporaryReference = 'TMP-' . bin2hex(random_bytes(8));

            $orderId = $db->insert(
                "INSERT INTO orders
                    (reference, customer_name, email, phone, address, city, note, subtotal, shipping, total, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
                [
                    $temporaryReference,
                    $order['customer_name'],
                    $order['email'],
                    $order['phone'],
                    $order['address'],
                    $order['city'],
                    $order['note'],
                    $order['subtotal'],
                    $order['shipping'],
                    $order['total'],
                ]
            );

            $reference = 'HS-' . date('Y') . '-' . str_pad((string) $orderId, 4, '0', STR_PAD_LEFT);

            $db->execute('UPDATE orders SET reference = ? WHERE id = ?', [$reference, $orderId]);

            foreach ($items as $item) {
                $db->execute(
                    "INSERT INTO order_items (order_id, product_id, title, price, quantity, image)
                     VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        $orderId,
                        $item['product_id'],
                        $item['title'],
                        $item['price'],
                        $item['quantity'],
                        $item['image'],
                    ]
                );

                if (!empty($item['product_id'])) {
                    $db->execute(
                        'UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
                        [$item['quantity'], $item['product_id']]
                    );
                }
            }

            return ['id' => $orderId, 'reference' => $reference];
        });
    }

    public function findByReference(string $reference): ?array
    {
        $row = $this->db->one('SELECT * FROM orders WHERE reference = ? LIMIT 1', [$reference]);

        if ($row === null) {
            return null;
        }

        $order = $this->present($row);
        $order['items'] = $this->items($order['id']);

        return $order;
    }

    public function findWithItems(int $id): ?array
    {
        $row = $this->find($id);

        if ($row === null) {
            return null;
        }

        $order = $this->present($row);
        $order['items'] = $this->items($id);

        return $order;
    }

    public function items(int $orderId): array
    {
        $rows = $this->db->all(
            'SELECT product_id, title, price, quantity, image FROM order_items WHERE order_id = ? ORDER BY id ASC',
            [$orderId]
        );

        return array_map(static fn (array $row): array => [
            'product_id' => $row['product_id'] !== null ? (int) $row['product_id'] : null,
            'title'      => $row['title'],
            'price'      => (float) $row['price'],
            'quantity'   => (int) $row['quantity'],
            'image'      => $row['image'],
        ], $rows);
    }

    public function setStatus(int $id, string $status): bool
    {
        return $this->db->execute('UPDATE orders SET status = ? WHERE id = ?', [$status, $id]) >= 0;
    }

    /** Admin listing with a lightweight item count. */
    public function adminListing(array $filters = []): array
    {
        $where = ['1 = 1'];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = 'o.status = ?';
            $params[] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $where[] = '(o.reference LIKE ? OR o.customer_name LIKE ? OR o.email LIKE ?)';
            $like = '%' . $filters['search'] . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $rows = $this->db->all(
            "SELECT o.*, (
                SELECT COALESCE(SUM(quantity), 0) FROM order_items i WHERE i.order_id = o.id
             ) AS item_count
             FROM orders o
             {$whereSql}
             ORDER BY o.created_at DESC, o.id DESC",
            $params
        );

        return array_map([$this, 'present'], $rows);
    }

    public function statusCounts(): array
    {
        $rows = $this->db->all('SELECT status, COUNT(*) AS total FROM orders GROUP BY status');
        $counts = [
            'pending'   => 0,
            'confirmed' => 0,
            'shipped'   => 0,
            'delivered' => 0,
            'cancelled' => 0,
        ];

        foreach ($rows as $row) {
            $counts[$row['status']] = (int) $row['total'];
        }

        return $counts;
    }

    public function revenue(): float
    {
        $value = $this->db->value(
            "SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled'"
        );

        return (float) $value;
    }

    public function present(array $row): array
    {
        return [
            'id'            => (int) $row['id'],
            'reference'     => $row['reference'],
            'customer_name' => $row['customer_name'],
            'email'         => $row['email'],
            'phone'         => $row['phone'],
            'address'       => $row['address'],
            'city'          => $row['city'],
            'note'          => $row['note'],
            'subtotal'      => (float) $row['subtotal'],
            'shipping'      => (float) $row['shipping'],
            'total'         => (float) $row['total'],
            'status'        => $row['status'],
            'item_count'    => (int) ($row['item_count'] ?? 0),
            'created_at'    => $row['created_at'] ?? null,
        ];
    }
}
