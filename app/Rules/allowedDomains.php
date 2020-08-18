<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

/**
 * Class allowedDomains.
 */
class allowedDomains implements Rule
{
    /**
     * @var array
     */
    protected array $allowedDomains = [
        'domain.com',
        'another-domain.com',
    ];

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $domain = substr(strrchr($value, '@'), 1);
        if (in_array($domain, $this->allowedDomains)) {
            return true;
        }

        return false;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The validation error message.';
    }
}
