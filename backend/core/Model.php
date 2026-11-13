<?php

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Str.php';

/**
 * Base model with safe, reusable CRUD helpers.
 */
abstract class Model
{
    protected Database $db;
    protected string $table = '';
    protected string $primaryKey = 'id';

    /** Columns that may be mass-assigned through create()/update(). */
    protected array $fillable = [];

    public function __construct()
    {
        $this->db = new Database();
    }

    public function all(string $orderBy = ''): array
    {
        $orderBy = $orderBy !== '' ? $orderBy : "`{$this->primaryKey}` ASC";
        return $this->db->all("SELECT * FROM `{$this->table}` ORDER BY {$orderBy}");
    }

    public function find($id): ?array
    {
        return $this->db->one(
            "SELECT * FROM `{$this->table}` WHERE `{$this->primaryKey}` = ? LIMIT 1",
            [$id]
        );
    }

    public function findBy(string $column, $value): ?array
    {
        $column = $this->safeColumn($column);
        return $this->db->one(
            "SELECT * FROM `{$this->table}` WHERE `{$column}` = ? LIMIT 1",
            [$value]
        );
    }

    public function exists($id): bool
    {
        return $this->db->value(
            "SELECT 1 FROM `{$this->table}` WHERE `{$this->primaryKey}` = ? LIMIT 1",
            [$id]
        ) !== null;
    }

    public function count(): int
    {
        return (int) $this->db->value("SELECT COUNT(*) FROM `{$this->table}`");
    }

    public function create(array $data): int
    {
        $data = $this->only($data);
        if ($data === []) {
            throw new InvalidArgumentException('No valid fields provided.');
        }

        $columns = array_keys($data);
        $placeholders = implode(', ', array_fill(0, count($columns), '?'));
        $sql = sprintf(
            'INSERT INTO `%s` (`%s`) VALUES (%s)',
            $this->table,
            implode('`, `', $columns),
            $placeholders
        );

        return $this->db->insert($sql, array_values($data));
    }

    public function update($id, array $data): bool
    {
        $data = $this->only($data);
        if ($data === []) {
            return false;
        }

        $assignments = implode(', ', array_map(
            static fn (string $column): string => "`{$column}` = ?",
            array_keys($data)
        ));

        $sql = "UPDATE `{$this->table}` SET {$assignments} WHERE `{$this->primaryKey}` = ?";
        $this->db->execute($sql, [...array_values($data), $id]);

        return true;
    }

    public function delete($id): bool
    {
        return $this->db->execute(
            "DELETE FROM `{$this->table}` WHERE `{$this->primaryKey}` = ?",
            [$id]
        ) > 0;
    }

    /**
     * Build a slug that is unique for this table, appending -2, -3, ...
     */
    public function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $candidate = $base;
        $suffix = 2;

        while (true) {
            $sql = "SELECT 1 FROM `{$this->table}` WHERE `slug` = ?";
            $params = [$candidate];

            if ($ignoreId !== null) {
                $sql .= " AND `{$this->primaryKey}` <> ?";
                $params[] = $ignoreId;
            }

            if ($this->db->value($sql . ' LIMIT 1', $params) === null) {
                return $candidate;
            }

            $candidate = $base . '-' . $suffix++;
        }
    }

    /** Keep only columns listed in $fillable (or everything if it is empty). */
    protected function only(array $data): array
    {
        if ($this->fillable === []) {
            return $data;
        }

        return array_intersect_key($data, array_flip($this->fillable));
    }

    protected function safeColumn(string $column): string
    {
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $column)) {
            throw new InvalidArgumentException('Invalid column name.');
        }

        return $column;
    }
}
