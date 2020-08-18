<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Post\ReadTime;

use Exception;

/**
 * Class ReadTime.
 */
class ReadTime
{
    /**
     * Whether or not minutes/seconds should be abbreviated as min/sec.
     *
     * @var bool
     */
    public bool $abbreviated;
    /**
     * The string content to evaluate.
     *
     * @var string
     */
    public string $content;
    /**
     * An array containing the read time estimate data.
     * @var array
     */
    protected array $estimate;
    /**
     * The direction the language reads. Default ltr is true.
     * @var bool
     */
    public bool $ltr;
    /**
     * Omit seconds from being displayed in the read time estimate.
     * @var bool
     */
    public bool $omitSeconds;
    /**
     * Whether or not only the time should be displayed.
     * @var bool
     */
    public bool $timeOnly;
    /**
     * An array containing all translation values.
     *
     * @var array
     */
    public array $translations;
    /**
     * The sum total number of words in the content.
     *
     * @var int
     */
    protected int $wordsInContent;
    /**
     * The average words read per minute.
     * @var int (int)
     */
    public int $wordsPerMinute;

    /**
     * ReadTime constructor.
     * @param $content
     * @param bool $omitSeconds
     * @param bool $abbreviated
     * @param int $wordsPerMinute
     * @throws Exception
     */
    public function __construct($content, bool $omitSeconds = true, bool $abbreviated = false, int $wordsPerMinute = 230)
    {
        $this->abbreviated = $abbreviated;
        $this->content = $this->parseContent($content);
        $this->ltr = true;
        $this->timeOnly = false;
        $this->omitSeconds = $omitSeconds;
        $this->defaultTranslations();
        $this->wordsInContent = (int) str_word_count($this->content);
        $this->wordsPerMinute = (int) $wordsPerMinute;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->get();
    }

    /**
     * @return string
     */
    public function __invoke(): string
    {
        return $this->get();
    }

    /**
     * Abbreviate the minutes/seconds.
     *
     * @param bool $abbreviated
     * @return ReadTime
     */
    public function abbreviated($abbreviated = true): self
    {
        $this->abbreviated = $abbreviated;

        return $this;
    }

    /**
     * Calculate the reading time for minutes.
     *
     * @return int
     */
    protected function calculateMinutes(): int
    {
        $minutes = floor($this->wordsInContent / $this->wordsPerMinute);

        return (int) $minutes < 1 ? 1 : $minutes;
    }

    /**
     * Calculate the reading time for seconds.
     *
     * @return int
     */
    protected function calculateSeconds(): int
    {
        return (int) floor($this->wordsInContent % $this->wordsPerMinute / ($this->wordsPerMinute / 60));
    }

    /**
     * Strip html tags from content.
     *
     * @param  string $content
     * @return string
     */
    protected function cleanContent($content): string
    {
        return strip_tags($content);
    }

    /**
     * Remove any double spaces or post/prefixed spaces.
     * @param  string $string
     * @return string
     */
    protected function cleanReadTimeString($string): string
    {
        return trim(preg_replace('/\s+/u', ' ', $string));
    }

    /**
     * Set the default translation when the class is instantiated.
     *
     * @return void
     */
    protected function defaultTranslations()
    {
        $this->setTranslation([]);
    }

    /**
     * Set the estimate property.
     *
     * @return void
     */
    protected function estimate()
    {
        $this->estimate = [
            'minutes' => $this->calculateMinutes(),
            'seconds' => $this->omitSeconds ? 0 : $this->calculateSeconds(),
            'read_time' => $this->formatReadTime(),
        ];
    }

    /**
     * Return the formatted read time string based on the set properties.
     *
     * @return string
     */
    protected function formatReadTime(): string
    {
        $minuteTime = $this->calculateMinutes();
        $secondTime = $this->calculateSeconds();
        $message = '';
        $minutes = $this->abbreviated ? $this->getTranslation('min') : $this->getTranslation('minute');
        $message .= "$minuteTime $minutes";
        if ($this->omitSeconds || ! $secondTime) {
            $seconds = '';
        } else {
            $seconds = $this->abbreviated ? $this->getTranslation('sec') : $this->getTranslation('second');
            $message .= " $secondTime $seconds";
        }
        $message = $this->timeOnly ? $this->cleanReadTimeString($message) : $this->cleanReadTimeString("$message {$this->translations['read']}");
        if ($this->ltr == false) {
            $message = $this->reverseWords($message);
        }

        return $message;
    }

    /**
     * Return the formatted read time string.
     *
     * @return string
     */
    public function get(): string
    {
        $this->estimate();

        return $this->estimate['read_time'];
    }

    /**
     * Get the translation array or specific key.
     *
     * @param  null|string $key The translation key
     * @return mixed array if no key is passed, or string if existing key is passed
     */
    public function getTranslation($key = null)
    {
        return is_null($key) ? $this->translations : $this->translations[$key];
    }

    /**
     * Check if the given content is formatted appropriately.
     *
     * @param  mixed $content
     * @return bool
     */
    protected function invalidContent($content): bool
    {
        if (is_array($content) || is_string($content)) {
            return false;
        }

        return true;
    }

    /**
     * Set ltr mode for the read time.
     *
     * @param bool
     * @return ReadTime
     */
    public function ltr(bool $ltr = true)
    {
        $this->ltr = $ltr;

        return $this;
    }

    /**
     * Omit seconds from being displayed in the read time result.
     *
     * @param bool $omitSeconds
     * @return ReadTime
     */
    public function omitSeconds(bool $omitSeconds = true)
    {
        $this->omitSeconds = $omitSeconds;

        return $this;
    }

    /**
     * Parse the given content so it can be output as a read time.
     *
     * @param mixed $receivedContent String or array of content
     * @throws Exception
     * @return string
     */
    protected function parseContent($receivedContent)
    {
        if ($this->invalidContent($receivedContent)) {
            throw new Exception('Content must be type of array or string');
        }
        if (is_array($receivedContent)) {
            $content = '';
            foreach ($receivedContent as $item) {
                if (is_array($item)) {
                    $item = $this->parseContent($item);
                }
                $content .= trim($item);
            }
        } else {
            $content = $receivedContent;
        }

        return $this->cleanContent($content);
    }

    /**
     * Reverse the words in a string.
     *
     * @param  string $string
     * @return string
     */
    protected function reverseWords($string): string
    {
        return implode(' ', array_reverse(explode(' ', $string)));
    }

    /**
     * Set the read time results to read from right to left.
     *
     * @param bool $rtl
     * @return ReadTime
     */
    public function rtl(bool $rtl = true)
    {
        $this->ltr = $rtl ? false : true;

        return $this;
    }

    /**
     * Set the translation keys for the read time string.
     *
     * @param array $translations An associative array of translation text
     * @return ReadTime
     */
    public function setTranslation(array $translations)
    {
        $this->translations = [
            'min' => isset($translations['min']) ? $translations['min'] : 'min',
            'minute' => isset($translations['minute']) ? $translations['minute'] : 'minute',
            'sec' => isset($translations['sec']) ? $translations['sec'] : 'sec',
            'second' => isset($translations['second']) ? $translations['second'] : 'second',
            'read' => isset($translations['read']) ? $translations['read'] : 'read',
        ];

        return $this;
    }

    /**
     * Determine if any text should accompany the time in the read time.
     *
     * @param bool $timeOnly
     * @return ReadTime
     */
    public function timeOnly(bool $timeOnly = true)
    {
        $this->timeOnly = $timeOnly;

        return $this;
    }

    /**
     * Return an array of the class data.
     *
     * @return array
     */
    public function toArray(): array
    {
        $this->estimate();

        return array_merge($this->estimate, [
            'abbreviated' => (bool) $this->abbreviated,
            'left_to_right' => (bool) $this->ltr,
            'omit_seconds' => (bool) $this->omitSeconds,
            'time_only' => (bool) $this->timeOnly,
            'translation' => $this->translations,
            'words_in_content' => (int) $this->wordsInContent,
            'words_per_minute' => (int) $this->wordsPerMinute,
        ]);
    }

    /**
     * Return a json string of the class data.
     *
     * @return string
     */
    public function toJson(): string
    {
        return json_encode($this->toArray());
    }

    /**
     * Set the average words read per minute.
     *
     * @param int $wordsPerMinute
     * @return ReadTime
     */
    public function wpm(int $wordsPerMinute): self
    {
        $this->wordsPerMinute = $wordsPerMinute;

        return $this;
    }
}
