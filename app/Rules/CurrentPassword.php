<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Rules;

use Hash;
use Illuminate\Contracts\Validation\Rule;

/**
 * Class CurrentPassword.
 */
class CurrentPassword implements Rule
{
    /**
     * Determine if the validation rule passes.
     * @param $attribute
     * @param $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return Hash::check($value, auth()->user()->password);
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return trans('validation.current_password');
    }
}
