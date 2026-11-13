<?php

class ProductController extends Controller
{
    private Product $products;
    private Review $reviews;

    public function __construct()
    {
        $this->products = new Product();
        $this->reviews = new Review();
    }

    /** GET /api/products */
    public function index(): void
    {
        $result = $this->products->listing([
            'category' => $this->query('category'),
            'search'   => $this->query('search'),
            'sort'     => $this->query('sort'),
            'featured' => $this->query('featured'),
            'min'      => $this->query('min'),
            'max'      => $this->query('max'),
            'page'     => $this->query('page', 1),
            'per_page' => $this->query('per_page', 12),
        ]);

        $this->success($result);
    }

    /** GET /api/products/{slug} */
    public function show(string $key): void
    {
        $product = $this->products->details($key);

        if ($product === null) {
            $this->error('Product not found.', 404);
        }

        $product['reviews'] = $this->reviews->forProduct($product['id']);
        $product['related'] = $this->products->related($product['id'], $product['category']['id'] ?? null);

        $this->success($product);
    }

    /** POST /api/products/{slug}/reviews */
    public function addReview(string $key): void
    {
        $product = $this->products->details($key);

        if ($product === null) {
            $this->error('Product not found.', 404);
        }

        $data = $this->validate([
            'author'  => 'required|string|maxlen:150',
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'string|maxlen:600',
        ]);

        $this->reviews->create([
            'product_id' => $product['id'],
            'author'     => trim((string) $data['author']),
            'rating'     => (int) $data['rating'],
            'comment'    => Str::nullIfBlank($data['comment'] ?? null),
        ]);

        $this->success($this->products->details((string) $product['id']), 'Thank you for your review.', 201);
    }

    /** POST /api/products (admin) */
    public function store(): void
    {
        Auth::require();

        $data = $this->validate([
            'title'       => 'required|string|maxlen:250',
            'price'       => 'required|numeric|min:0',
            'description' => 'required|string',
            'category_id' => 'integer',
            'stock'       => 'integer|min:0',
        ]);

        $id = $this->products->create($this->payload($data, null));

        $this->success($this->products->details((string) $id), 'Product created.', 201);
    }

    /** PUT /api/products/{id} (admin) */
    public function update(string $id): void
    {
        Auth::require();

        if (!$this->products->exists((int) $id)) {
            $this->error('Product not found.', 404);
        }

        $data = $this->validate([
            'title'       => 'string|maxlen:250',
            'price'       => 'numeric|min:0',
            'description' => 'string',
            'category_id' => 'integer',
            'stock'       => 'integer|min:0',
        ]);

        $this->products->update((int) $id, $this->payload($data, (int) $id));

        $this->success($this->products->details($id), 'Product updated.');
    }

    /** DELETE /api/products/{id} (admin) */
    public function destroy(string $id): void
    {
        Auth::require();

        if (!$this->products->delete((int) $id)) {
            $this->error('Product not found.', 404);
        }

        $this->success(null, 'Product deleted.');
    }

    /** Normalise incoming data into DB-ready values. */
    private function payload(array $data, ?int $id): array
    {
        $payload = [];

        if (array_key_exists('title', $data)) {
            $payload['title'] = trim((string) $data['title']);
            $payload['slug'] = $this->products->uniqueSlug($payload['title'], $id);
        }

        if (array_key_exists('price', $data)) {
            $payload['price'] = round((float) $data['price'], 2);
        }

        if (array_key_exists('old_price', $data)) {
            $value = Str::nullIfBlank($data['old_price']);
            $payload['old_price'] = $value === null ? null : round((float) $value, 2);
        }

        if (array_key_exists('description', $data)) {
            $payload['description'] = trim((string) $data['description']);
        }

        if (array_key_exists('image', $data)) {
            $payload['image'] = Str::nullIfBlank($data['image']);
        }

        if (array_key_exists('stock', $data)) {
            $payload['stock'] = max(0, (int) $data['stock']);
        }

        if (array_key_exists('category_id', $data)) {
            $categoryId = (int) ($data['category_id'] ?? 0);
            $payload['category_id'] = $categoryId > 0 ? $categoryId : null;
        }

        if (array_key_exists('featured', $data)) {
            $payload['featured'] = $data['featured'] ? 1 : 0;
        }

        if (array_key_exists('status', $data)) {
            $payload['status'] = in_array($data['status'], ['active', 'draft', 'archived'], true)
                ? $data['status']
                : 'active';
        }

        return $payload;
    }
}
