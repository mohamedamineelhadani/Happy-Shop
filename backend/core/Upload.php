<?php

require_once __DIR__ . '/Str.php';

/**
 * Handles admin image uploads for products (and other content).
 *
 * Files are stored on disk and only their public URL is persisted in the
 * database, which keeps the API responses portable.
 */
class Upload
{
    /** Allowed mime types mapped to the file extension we save them with. */
    private const ALLOWED = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
    ];

    /**
     * Validate and store an uploaded image.
     *
     * @param array  $file   a single entry from $_FILES
     * @param string $prefix filename prefix, e.g. "product"
     * @return array{url:string, filename:string, size:int, mime:string}
     *
     * @throws RuntimeException when the file is missing, too large or unsupported
     */
    public static function image(array $file, string $prefix = 'product'): array
    {
        $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;

        if ($error === UPLOAD_ERR_NO_FILE) {
            throw new RuntimeException('No file was uploaded.');
        }

        if ($error !== UPLOAD_ERR_OK) {
            throw new RuntimeException('The upload failed. Please try again.');
        }

        $tmp = (string) ($file['tmp_name'] ?? '');

        if ($tmp === '' || !is_uploaded_file($tmp)) {
            throw new RuntimeException('The uploaded file could not be read.');
        }

        $size = (int) ($file['size'] ?? 0);

        if ($size <= 0) {
            throw new RuntimeException('The uploaded file is empty.');
        }

        if ($size > UPLOAD_MAX_BYTES) {
            throw new RuntimeException(
                'The image must be smaller than ' . (int) (UPLOAD_MAX_BYTES / 1048576) . ' MB.'
            );
        }

        $mime = self::mimeType($tmp);

        if (!isset(self::ALLOWED[$mime])) {
            throw new RuntimeException('Unsupported image type. Use JPG, PNG, WEBP or GIF.');
        }

        $extension = self::ALLOWED[$mime];
        $base = Str::slug(pathinfo((string) ($file['name'] ?? $prefix), PATHINFO_FILENAME));
        $filename = sprintf('%s-%s-%s.%s', $prefix, $base, bin2hex(random_bytes(4)), $extension);

        $directory = rtrim(UPLOAD_DIR, '/\\');

        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('The upload directory could not be created.');
        }

        $destination = $directory . DIRECTORY_SEPARATOR . $filename;

        if (!move_uploaded_file($tmp, $destination)) {
            throw new RuntimeException('The image could not be saved.');
        }

        return [
            'url'      => rtrim(UPLOAD_URL, '/') . '/' . $filename,
            'filename' => $filename,
            'size'     => $size,
            'mime'     => $mime,
        ];
    }

    private static function mimeType(string $path): string
    {
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);

            if ($finfo !== false) {
                $mime = finfo_file($finfo, $path);
                finfo_close($finfo);

                if (is_string($mime) && $mime !== '') {
                    return $mime;
                }
            }
        }

        $mime = function_exists('mime_content_type') ? mime_content_type($path) : false;

        return is_string($mime) ? $mime : '';
    }
}
