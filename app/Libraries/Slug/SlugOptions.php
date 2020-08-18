<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Slug;

/**
 * Class SlugOptions.
 */
class SlugOptions
{
    /**
     * @var
     */
    public $generateSlugFrom;
    /**
     * @var
     */
    public $slugField;
    /**
     * @var bool
     */
    public bool $generateUniqueSlugs = true;
    /**
     * @var int
     */
    public int $maximumLength = 250;
    /**
     * @var bool
     */
    public bool $generateSlugsOnCreate = true;
    /**
     * @var bool
     */
    public bool $generateSlugsOnUpdate = true;
    /**
     * @var string
     */
    public string $slugSeparator = '-';
    /**
     * @var string
     */
    public string $slugLanguage = 'en';

    /**
     * @return SlugOptions
     */
    public static function create(): self
    {
        return new static();
    }

    /**
     * @param array|callable|string $fieldName
     *
     * @return SlugOptions
     */
    public function generateSlugsFrom($fieldName): self
    {
        if (is_string($fieldName)) {
            $fieldName = [$fieldName];
        }
        $this->generateSlugFrom = $fieldName;

        return $this;
    }

    /**
     * @param string $fieldName
     * @return SlugOptions
     */
    public function saveSlugsTo(string $fieldName): self
    {
        $this->slugField = $fieldName;

        return $this;
    }

    /**
     * @return SlugOptions
     */
    public function allowDuplicateSlugs(): self
    {
        $this->generateUniqueSlugs = false;

        return $this;
    }

    /**
     * @param int $maximumLength
     * @return SlugOptions
     */
    public function slugsShouldBeNoLongerThan(int $maximumLength): self
    {
        $this->maximumLength = $maximumLength;

        return $this;
    }

    /**
     * @return SlugOptions
     */
    public function doNotGenerateSlugsOnCreate(): self
    {
        $this->generateSlugsOnCreate = false;

        return $this;
    }

    /**
     * @return SlugOptions
     */
    public function doNotGenerateSlugsOnUpdate(): self
    {
        $this->generateSlugsOnUpdate = false;

        return $this;
    }

    /**
     * @param string $separator
     * @return SlugOptions
     */
    public function usingSeparator(string $separator): self
    {
        $this->slugSeparator = $separator;

        return $this;
    }

    /**
     * @param string $language
     * @return SlugOptions
     */
    public function usingLanguage(string $language): self
    {
        $this->slugLanguage = $language;

        return $this;
    }
}
