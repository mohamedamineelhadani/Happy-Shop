<?php

class CategoryController extends Controller
{
    private Category $categories;
    private Product $products;

    public function __construct()
    {
        $this->categories = new Category();
        $this->products = new Product();
    }

    /** GET /api/categories */
    public function index(): void
    {
        $this->success($this->categories->withCounts());
    }

    /** GET /api/categories/{slug} */
    public function show(string $slug): void
    {
        $category = $this->categories->findBySlug($slug);

        if ($category === null) {
            $this->error('Category not found.', 404);
        }

        $listing = $this->products->listing([
            'category' => $slug,
            'sort'     => $this->query('sort'),
            'min'      => $this->query('min'),
            'max'      => $this->query('max'),
            'page'     => $this->query('page', 1),
            'per_page' => $this->query('per_page', 12),
        ]);

        $category['products'] = $listing['items'];
        $category['meta'] = $listing['meta'];

        $this->success($category);
    }

    /** POST /api/categories (admin) */
    public function store(): void
    {
        Auth::require();

        $data = $this->validate([
            'name'        => 'required|string|maxlen:120',
            'description' => 'string|maxlen:400',
        ]);

        $id = $this->categories->create([
            'name'        => trim((string) $data['name']),
            'slug'        => $this->categories->uniqueSlug((string) $data['name']),
            'description' => Str::nullIfBlank($data['description'] ?? null),
            'icon'        => Str::nullIfBlank($data['icon'] ?? null),
        ]);

        $this->success($this->categories->find($id), 'Category created.', 201);
    }

    /** PUT /api/categories/{id} (admin) */
    public function update(string $id): void
    {
        Auth::require();

        if (!$this->categories->exists((int) $id)) {
            $this->error('Category not found.', 404);
        }

        $data = $this->validate([
            'name'        => 'string|maxlen:120',
            'description' => 'string|maxlen:400',
        ]);

        $payload = [];

        if (array_key_exists('name', $data)) {
            $payload['name'] = trim((string) $data['name']);
            $payload['slug'] = $this->categories->uniqueSlug($payload['name'], (int) $id);
        }

        if (array_key_exists('description', $data)) {
            $payload['description'] = Str::nullIfBlank($data['description']);
        }

        if (array_key_exists('icon', $data)) {
            $payload['icon'] = Str::nullIfBlank($data['icon']);
        }

        $this->categories->update((int) $id, $payload);

        $this->success($this->categories->find((int) $id), 'Category updated.');
    }

    /** DELETE /api/categories/{id} (admin) */
    public function destroy(string $id): void
    {
        Auth::require();

        if (!$this->categories->delete((int) $id)) {
            $this->error('Category not found.', 404);
        }

        $this->success(null, 'Category deleted. Its products are now uncategorised.');
    }
}
