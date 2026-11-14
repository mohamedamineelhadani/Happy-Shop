<?php

class UploadController extends Controller
{
    /**
     * POST /api/admin/uploads (admin)
     *
     * Accepts a multipart/form-data request with a file field named "image"
     * (or "file") and returns the stored image's public URL.
     */
    public function store(): void
    {
        Auth::require();

        $file = $_FILES['image'] ?? $_FILES['file'] ?? null;

        if (!is_array($file)) {
            $this->error('No image was uploaded. Send a multipart field named "image".', 422);
        }

        try {
            $result = Upload::image($file, 'product');
        } catch (RuntimeException $exception) {
            $this->error($exception->getMessage(), 422);
            return;
        }

        $this->success($result, 'Image uploaded.', 201);
    }
}
