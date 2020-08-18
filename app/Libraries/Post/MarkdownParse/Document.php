<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Post\MarkdownParse;

use Illuminate\Support\Arr;

/**
 * Class Document.
 */
class Document
{
    /**
     * @var array
     */
    protected array $matter;
    /**
     * @var string
     */
    protected string $body;

    /**
     * Document constructor.
     * @param $matter
     * @param string $body
     */
    public function __construct($matter, string $body)
    {
        $this->matter = is_array($matter) ? $matter : [];
        $this->body = $body;
    }

    /**
     * @param null|string $key
     * @param null $default
     * @return array|\ArrayAccess|mixed
     */
    public function matter(string $key = null, $default = null)
    {
        if ($key) {
            return Arr::get($this->matter, $key, $default);
        }

        return $this->matter;
    }

    /**
     * @return string
     */
    public function body(): string
    {
        return $this->body;
    }

    /**
     * @param $key
     * @return array|\ArrayAccess|mixed
     */
    public function __get($key)
    {
        return $this->matter($key);
    }
}
