<?php

class AuthController extends Controller
{
    private Admin $admins;

    public function __construct()
    {
        $this->admins = new Admin();
    }

    /** POST /api/auth/login */
    public function login(): void
    {
        $data = $this->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = $this->admins->findByEmail(trim((string) $data['email']));

        if ($admin === null || !password_verify((string) $data['password'], $admin['password_hash'])) {
            $this->error('These credentials do not match our records.', 401);
        }

        $token = Auth::issue([
            'sub'   => (int) $admin['id'],
            'name'  => $admin['name'],
            'email' => $admin['email'],
            'role'  => $admin['role'],
        ]);

        $this->success([
            'token' => $token,
            'user'  => [
                'id'    => (int) $admin['id'],
                'name'  => $admin['name'],
                'email' => $admin['email'],
                'role'  => $admin['role'],
            ],
        ], 'Welcome back.');
    }

    /** GET /api/auth/me */
    public function me(): void
    {
        $user = Auth::require();

        $this->success([
            'id'    => $user['sub'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ]);
    }
}
