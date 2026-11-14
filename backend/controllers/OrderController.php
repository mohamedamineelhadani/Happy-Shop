<?php

class OrderController extends Controller
{
    private Order $orders;
    private Product $products;

    public function __construct()
    {
        $this->orders = new Order();
        $this->products = new Product();
    }

    /**
     * POST /api/orders
     * Totals are always recalculated from the database, never trusted from the client.
     */
    public function store(): void
    {
        $data = $this->validate([
            'customer_name' => 'required|string|maxlen:200',
            'email'         => 'required|email|maxlen:200',
            'phone'         => 'required|string|maxlen:50',
            'address'       => 'string|maxlen:400',
            'city'          => 'string|maxlen:120',
            'note'          => 'string|maxlen:600',
            'items'         => 'required',
        ]);

        $requested = $data['items'];

        if (!is_array($requested) || $requested === []) {
            $this->error('Your cart is empty.', 422);
        }

        $items = [];
        $subtotal = 0.0;

        foreach ($requested as $line) {
            $productId = (int) ($line['product_id'] ?? $line['id'] ?? 0);
            $quantity = max(1, (int) ($line['quantity'] ?? 1));

            $product = $this->products->details((string) $productId);

            if ($product === null) {
                $this->error("Product #{$productId} is no longer available.", 422);
            }

            if ($product['stock'] < $quantity) {
                $this->error("Only {$product['stock']} left of \"{$product['title']}\".", 422);
            }

            $items[] = [
                'product_id' => $product['id'],
                'title'      => $product['title'],
                'price'      => $product['price'],
                'quantity'   => $quantity,
                'image'      => $product['image'],
            ];

            $subtotal += $product['price'] * $quantity;
        }

        $shipping = $subtotal >= FREE_SHIPPING_FROM ? 0.0 : (float) SHIPPING_COST;
        $total = $subtotal + $shipping;

        $created = $this->orders->createWithItems([
            'customer_name' => trim((string) $data['customer_name']),
            'email'         => trim((string) $data['email']),
            'phone'         => trim((string) $data['phone']),
            'address'       => Str::nullIfBlank($data['address'] ?? null),
            'city'          => Str::nullIfBlank($data['city'] ?? null),
            'note'          => Str::nullIfBlank($data['note'] ?? null),
            'subtotal'      => round($subtotal, 2),
            'shipping'      => round($shipping, 2),
            'total'         => round($total, 2),
        ], $items);

        $this->success($this->orders->findWithItems($created['id']), 'Order placed successfully.', 201);
    }

    /** GET /api/orders (admin) */
    public function index(): void
    {
        Auth::require();

        $this->success($this->orders->adminListing([
            'status' => $this->query('status'),
            'search' => $this->query('search'),
        ]));
    }

    /** GET /api/orders/{reference} (admin) */
    public function show(string $reference): void
    {
        Auth::require();

        $order = $this->orders->findByReference($reference);

        if ($order === null) {
            $this->error('Order not found.', 404);
        }

        $this->success($order);
    }

    /** PUT /api/orders/{id} (admin) — edit the order's customer details. */
    public function update(string $id): void
    {
        Auth::require();

        if (!$this->orders->exists((int) $id)) {
            $this->error('Order not found.', 404);
        }

        $data = $this->validate([
            'customer_name' => 'string|maxlen:200',
            'email'         => 'email|maxlen:200',
            'phone'         => 'string|maxlen:50',
            'address'       => 'string|maxlen:400',
            'city'          => 'string|maxlen:120',
            'note'          => 'string|maxlen:600',
        ]);

        $payload = [];

        foreach (['customer_name', 'email', 'phone'] as $field) {
            if (array_key_exists($field, $data) && trim((string) $data[$field]) !== '') {
                $payload[$field] = trim((string) $data[$field]);
            }
        }

        foreach (['address', 'city', 'note'] as $field) {
            if (array_key_exists($field, $data)) {
                $payload[$field] = Str::nullIfBlank($data[$field]);
            }
        }

        if ($payload !== []) {
            $this->orders->update((int) $id, $payload);
        }

        $this->success($this->orders->findWithItems((int) $id), 'Order updated.');
    }

    /** PUT /api/orders/{id}/status (admin) */
    public function updateStatus(string $id): void
    {
        Auth::require();

        $data = $this->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        if (!$this->orders->exists((int) $id)) {
            $this->error('Order not found.', 404);
        }

        $this->orders->setStatus((int) $id, (string) $data['status']);

        $this->success($this->orders->findWithItems((int) $id), 'Order status updated.');
    }
}
