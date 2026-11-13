<?php

/**
 * Declarative request validator.
 *
 * Rules are written as a pipe separated string, e.g.
 *   ['title' => 'required|string|max:250', 'price' => 'required|numeric|min:0']
 */
class Validator
{
    /**
     * @return array<string, string> field => first error message
     */
    public static function check(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $ruleString) {
            $value = $data[$field] ?? null;
            $ruleList = explode('|', (string) $ruleString);
            $required = in_array('required', $ruleList, true);

            if (self::isBlank($value)) {
                if ($required) {
                    $errors[$field] = self::label($field) . ' is required.';
                }
                continue;
            }

            foreach ($ruleList as $rule) {
                if ($rule === '' || $rule === 'required') {
                    continue;
                }

                [$name, $param] = array_pad(explode(':', $rule, 2), 2, null);

                switch ($name) {
                    case 'string':
                        if (!is_string($value) && !is_numeric($value)) {
                            $errors[$field] = self::label($field) . ' must be text.';
                        }
                        break;

                    case 'numeric':
                        if (!is_numeric($value)) {
                            $errors[$field] = self::label($field) . ' must be a number.';
                        }
                        break;

                    case 'integer':
                        if (filter_var($value, FILTER_VALIDATE_INT) === false) {
                            $errors[$field] = self::label($field) . ' must be a whole number.';
                        }
                        break;

                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$field] = self::label($field) . ' must be a valid email address.';
                        }
                        break;

                    case 'min':
                        if (is_numeric($value) && (float) $value < (float) $param) {
                            $errors[$field] = self::label($field) . " must be at least {$param}.";
                        }
                        break;

                    case 'max':
                        if (is_numeric($value) && (float) $value > (float) $param) {
                            $errors[$field] = self::label($field) . " may not be greater than {$param}.";
                        }
                        break;

                    case 'minlen':
                        if (mb_strlen((string) $value) < (int) $param) {
                            $errors[$field] = self::label($field) . " must be at least {$param} characters.";
                        }
                        break;

                    case 'maxlen':
                        if (mb_strlen((string) $value) > (int) $param) {
                            $errors[$field] = self::label($field) . " may not be greater than {$param} characters.";
                        }
                        break;

                    case 'in':
                        if (!in_array((string) $value, explode(',', (string) $param), true)) {
                            $errors[$field] = self::label($field) . ' is not a valid option.';
                        }
                        break;
                }

                if (isset($errors[$field])) {
                    break;
                }
            }
        }

        return $errors;
    }

    private static function isBlank($value): bool
    {
        return $value === null
            || $value === ''
            || (is_array($value) && $value === []);
    }

    private static function label(string $field): string
    {
        return ucfirst(str_replace('_', ' ', $field));
    }
}
