<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Post\MarkdownParse;

use Symfony\Component\Yaml\Yaml;

/**
 * Class YamlFrontMatter.
 */
class YamlFrontMatter
{
    /**
     * @param string $content
     * @return Document
     */
    public static function parse(string $content): Document
    {
        $pattern = '/^[\s\r\n]?---[\s\r\n]?$/sm';

        $parts = preg_split($pattern, PHP_EOL.ltrim($content));

        if (count($parts) < 3) {
            return new Document([], $content);
        }

        $matter = Yaml::parse(trim($parts[1]));

        $body = implode(PHP_EOL.'---'.PHP_EOL, array_slice($parts, 2));

        return new Document($matter, $body);
    }

    /**
     * @param string $path
     * @return Document
     */
    public static function parseFile(string $path): Document
    {
        return static::parse(
            file_get_contents($path)
        );
    }
}
