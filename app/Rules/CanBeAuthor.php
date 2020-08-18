<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

/**
 * Class CanBeAuthor.
 */
class CanBeAuthor implements Rule
{
    /**
     * Determine if the validation rule passes.
     * @param $attribute
     * @param $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $author = User::find($value);

        return $author->canBeAuthor();
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return trans('validation.can_be_author');
    }
}
