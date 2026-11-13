<?php

class ContactController extends Controller
{
    private Contact $contacts;

    public function __construct()
    {
        $this->contacts = new Contact();
    }

    /** POST /api/contacts */
    public function store(): void
    {
        $data = $this->validate([
            'full_name' => 'required|string|maxlen:200',
            'email'     => 'required|email|maxlen:200',
            'phone'     => 'string|maxlen:50',
            'subject'   => 'string|maxlen:200',
            'message'   => 'required|string|maxlen:2000',
        ]);

        $this->contacts->create([
            'full_name' => trim((string) $data['full_name']),
            'email'     => trim((string) $data['email']),
            'phone'     => Str::nullIfBlank($data['phone'] ?? null),
            'subject'   => Str::nullIfBlank($data['subject'] ?? null),
            'message'   => trim((string) $data['message']),
        ]);

        $this->success(null, 'Thank you! Your message has been received.', 201);
    }

    /** GET /api/contacts (admin) */
    public function index(): void
    {
        Auth::require();
        $this->success($this->contacts->adminListing());
    }

    /** PUT /api/contacts/{id}/read (admin) */
    public function markRead(string $id): void
    {
        Auth::require();

        if (!$this->contacts->exists((int) $id)) {
            $this->error('Message not found.', 404);
        }

        $this->contacts->update((int) $id, ['is_read' => 1]);
        $this->success($this->contacts->find((int) $id), 'Message marked as read.');
    }

    /** DELETE /api/contacts/{id} (admin) */
    public function destroy(string $id): void
    {
        Auth::require();

        if (!$this->contacts->delete((int) $id)) {
            $this->error('Message not found.', 404);
        }

        $this->success(null, 'Message deleted.');
    }
}
