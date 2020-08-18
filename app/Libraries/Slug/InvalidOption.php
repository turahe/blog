<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Slug;

use Exception;

/**
 * Class InvalidOption.
 */
class InvalidOption extends Exception
{
    /**
     * @return InvalidOption
     */
    public static function missingFromField()
    {
        return new static('Could not determine which fields should be sluggified');
    }

    /**
     * @return InvalidOption
     */
    public static function missingSlugField()
    {
        return new static('Could not determine in which field the slug should be saved');
    }

    /**
     * @return InvalidOption
     */
    public static function invalidMaximumLength()
    {
        return new static('Maximum length should be greater than zero');
    }
}
