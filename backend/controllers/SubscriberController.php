<?php

class SubscriberController extends Controller
{
    private Subscriber $subscribers;

    public function __construct()
    {
        $this->subscribers = new Subscriber();
    }

    /** POST /api/subscribers — public newsletter sign-up. */
    public function store(): void
    {
        $data = $this->validate([
            'email' => 'required|email|maxlen:200',
        ]);

        $email = strtolower(trim((string) $data['email']));
        $existing = $this->subscribers->findByEmail($email);

        if ($existing !== null) {
            // Already on the list — keep the form idempotent instead of erroring.
            if (!$existing['is_active']) {
                $this->subscribers->update((int) $existing['id'], ['is_active' => 1]);
                $existing['is_active'] = 1;
            }

            $this->success($this->subscribers->present($existing), 'You are already on the list.', 200);
        }

        $id = $this->subscribers->create(['email' => $email, 'is_active' => 1]);

        $this->success(
            $this->subscribers->present($this->subscribers->find($id) ?? []),
            'Welcome to the list — watch your inbox.',
            201
        );
    }

    /** GET /api/subscribers (admin) */
    public function index(): void
    {
        Auth::require();
        $this->success($this->subscribers->adminListing());
    }

    /** DELETE /api/subscribers/{id} (admin) */
    public function destroy(string $id): void
    {
        Auth::require();

        if (!$this->subscribers->delete((int) $id)) {
            $this->error('Subscriber not found.', 404);
        }

        $this->success(null, 'Subscriber removed.');
    }
}
