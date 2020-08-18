<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Slug;

use Str;
use Illuminate\Database\Eloquent\Model;

/**
 * Traits HasSlug.
 */
trait HasSlug
{
    /**
     * @var
     */
    protected $slugOptions;

    /**
     * @return SlugOptions
     */
    abstract public function getSlugOptions(): SlugOptions;

    protected static function bootHasSlug()
    {
        static::creating(function (Model $model) {
            $model->generateSlugOnCreate();
        });
        static::updating(function (Model $model) {
            $model->generateSlugOnUpdate();
        });
    }

    /**
     * @throws InvalidOption
     */
    protected function generateSlugOnCreate()
    {
        $this->slugOptions = $this->getSlugOptions();
        if (! $this->slugOptions->generateSlugsOnCreate) {
            return;
        }
        $this->addSlug();
    }

    /**
     * @throws InvalidOption
     */
    protected function generateSlugOnUpdate()
    {
        $this->slugOptions = $this->getSlugOptions();
        if (! $this->slugOptions->generateSlugsOnUpdate) {
            return;
        }
        $this->addSlug();
    }

    /**
     * @throws InvalidOption
     */
    public function generateSlug()
    {
        $this->slugOptions = $this->getSlugOptions();
        $this->addSlug();
    }

    /**
     * @throws InvalidOption
     */
    protected function addSlug()
    {
        $this->ensureValidSlugOptions();
        $slug = $this->generateNonUniqueSlug();
        if ($this->slugOptions->generateUniqueSlugs) {
            $slug = $this->makeSlugUnique($slug);
        }
        $slugField = $this->slugOptions->slugField;
        $this->$slugField = $slug;
    }

    /**
     * @return string
     */
    protected function generateNonUniqueSlug(): string
    {
        $slugField = $this->slugOptions->slugField;
        if ($this->hasCustomSlugBeenUsed() && ! empty($this->$slugField)) {
            return $this->$slugField;
        }

        return Str::slug($this->getSlugSourceString(), $this->slugOptions->slugSeparator, $this->slugOptions->slugLanguage);
    }

    /**
     * @return bool
     */
    protected function hasCustomSlugBeenUsed(): bool
    {
        $slugField = $this->slugOptions->slugField;

        return $this->getOriginal($slugField) != $this->$slugField;
    }

    /**
     * @return string
     */
    protected function getSlugSourceString(): string
    {
        if (is_callable($this->slugOptions->generateSlugFrom)) {
            $slugSourceString = call_user_func($this->slugOptions->generateSlugFrom, $this);

            return substr($slugSourceString, 0, $this->slugOptions->maximumLength);
        }
        $slugSourceString = collect($this->slugOptions->generateSlugFrom)
            ->map(function (string $fieldName): string {
                return data_get($this, $fieldName, '');
            })
            ->implode($this->slugOptions->slugSeparator);

        return substr($slugSourceString, 0, $this->slugOptions->maximumLength);
    }

    /**
     * @param string $slug
     * @return string
     */
    protected function makeSlugUnique(string $slug): string
    {
        $originalSlug = $slug;
        $i = 1;
        while ($this->otherRecordExistsWithSlug($slug) || $slug === '') {
            $slug = $originalSlug.$this->slugOptions->slugSeparator.$i++;
        }

        return $slug;
    }

    /**
     * @param string $slug
     * @return bool
     */
    protected function otherRecordExistsWithSlug(string $slug): bool
    {
        $key = $this->getKey();
        if ($this->incrementing) {
            $key = $key ?? '0';
        }

        return static::where($this->slugOptions->slugField, $slug)
            ->where($this->getKeyName(), '!=', $key)
            ->withoutGlobalScopes()
            ->exists();
    }

    /**
     * @throws InvalidOption
     */
    protected function ensureValidSlugOptions()
    {
        if (is_array($this->slugOptions->generateSlugFrom) && ! count($this->slugOptions->generateSlugFrom)) {
            throw InvalidOption::missingFromField();
        }
        if (! strlen($this->slugOptions->slugField)) {
            throw InvalidOption::missingSlugField();
        }
        if ($this->slugOptions->maximumLength <= 0) {
            throw InvalidOption::invalidMaximumLength();
        }
    }
}
