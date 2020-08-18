<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/7/20, 8:30 PM
 *  @name          MenuWalker.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Menu;

/**
 * Class MenuWalker.
 */
class MenuWalker
{
    /**
     * @var
     */
    protected static $currentMenuItem;
    /**
     * @var
     */
    protected $menu;
    /**
     * @var array
     */
    protected $activeItems = [];

    /**
     * MenuWalker constructor.
     * @param $menu
     */
    public function __construct($menu)
    {
        $this->menu = $menu;
    }

    public function generate()
    {
        $items = json_decode($this->menu->items, true);
        if (! empty($items)) {
            echo '<ul class="main-menu menu-generated">';
            $this->generateTree($items);
            echo '</ul>';
        }
    }

    /**
     * @param array $items
     * @param int $depth
     * @param string $parentKey
     */
    public function generateTree($items = [], $depth = 0, $parentKey = '')
    {
        foreach ($items as $k=>$item) {
            $class = $item['class'] ?? '';
            $url = $item['url'] ?? '';
            $item['target'] = $item['target'] ?? '';
            if (! isset($item['item_model'])) {
                continue;
            }
            if (class_exists($item['item_model'])) {
                $itemClass = $item['item_model'];
                $itemObj = $itemClass::find($item['id']);
                if (empty($itemObj)) {
                    continue;
                }
                $url = $itemObj->getDetailUrl();
            }
            if ($this->checkCurrentMenu($item, $url)) {
                $class .= ' active';
                $this->activeItems[] = $parentKey;
            }

            if (! empty($item['children'])) {
                ob_start();
                $this->generateTree($item['children'], $depth + 1, $parentKey.'_'.$k);
                $html = ob_get_clean();
                if (in_array($parentKey.'_'.$k, $this->activeItems)) {
                    $class .= ' active ';
                }
            }
            $class .= ' depth-'.($depth);
            printf('<li class="%s">', $class);
            if (! empty($item['children'])) {
                $item['name'] .= ' <i class="fa fa-angle-down"></i>';
            }
            printf('<a  target="%s" href="%s" >%s</a>', $item['target'], $url, $item['name']);
            if (! empty($item['children'])) {
                echo '<ul class="children-menu menu-dropdown">';
                echo $html;
                echo '</ul>';
            }
            echo '</li>';
        }
    }

    /**
     * @param $item
     * @param string $url
     * @return bool
     */
    protected function checkCurrentMenu($item, $url = '')
    {
        if (trim($url, '/') == request()->path()) {
            return true;
        }
        if (! static::$currentMenuItem) {
            return false;
        }
        if (empty($item['item_model'])) {
            return false;
        }
        if (is_string(static::$currentMenuItem) and ($url == static::$currentMenuItem or $url == url(static::$currentMenuItem))) {
            return true;
        }
        if (is_object(static::$currentMenuItem) and get_class(static::$currentMenuItem) == $item['item_model'] && static::$currentMenuItem->id == $item['id']) {
            return true;
        }

        return false;
    }

    /**
     * @param $item
     */
    public static function setCurrentMenuItem($item)
    {
        static::$currentMenuItem = $item;
    }

    /**
     * @return mixed
     */
    public static function getActiveMenu()
    {
        return static::$currentMenuItem;
    }
}
