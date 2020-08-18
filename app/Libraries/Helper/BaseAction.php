<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/7/20, 8:33 PM
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Helper;

abstract class BaseAction
{
    /**
     * Holds the event listeners.
     *
     * @var array
     */
    protected $listeners = null;

    public function __construct()
    {
        $this->listeners = collect([]);
    }

    /**
     * Adds a listener.
     *
     * @param string $hook      Hook name
     * @param mixed  $callback  Function to execute
     * @param int    $priority  Priority of the action
     * @param int    $arguments Number of arguments to accept
     *
     * @return $this
     */
    public function listen($hook, $callback, $priority = 20, $arguments = 1)
    {
        $this->listeners->push([
            'hook'      => $hook,
            'callback'  => $callback,
            'priority'  => $priority,
            'arguments' => $arguments,
        ]);

        return $this;
    }

    /**
     * Removes a listener.
     *
     * @param string $hook     Hook name
     * @param mixed  $callback Function to execute
     * @param int    $priority Priority of the action
     */
    public function remove($hook, $callback, $priority = 20)
    {
        if ($this->listeners) {
            $this->listeners->where('hook', $hook)
                ->filter(function ($listener) use ($callback) {
                    return $callback === $listener['callback'];
                })
                ->where('priority', $priority)
                ->each(function ($listener, $key) {
                    $this->listeners->forget($key);
                });
        }
    }

    /**
     * Remove all listeners with given hook in collection. If no hook, clear all listeners.
     *
     * @param string $hook Hook name
     */
    public function removeAll($hook = null)
    {
        if ($hook) {
            if ($this->listeners) {
                $this->listeners->where('hook', $hook)->each(function ($listener, $key) {
                    $this->listeners->forget($key);
                });
            }
        } else {
            // no hook was specified, so clear entire collection
            $this->listeners = collect([]);
        }
    }

    /**
     * Gets a sorted list of all listeners.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getListeners()
    {
        // $listeners = $this->listeners->values();
        // sort by priority
        // uksort($values, function ($a, $b) {
        //     return strnatcmp($a, $b);
        // });
        return $this->listeners->sortBy('priority');
    }

    /**
     * Gets the function.
     *
     * @param mixed $callback Callback
     *
     * @throws
     * @return mixed A closure, an array if "class@method" or a string if "function_name"
     */
    protected function getFunction($callback)
    {
        if (is_string($callback) && strpos($callback, '@')) {
            $callback = explode('@', $callback);

            return [app('\\'.$callback[0]), $callback[1]];
        }
        if (is_callable($callback)) {
            return $callback;
        }
        throw new \Exception('$callback is not a Callable', 1);
    }

    /**
     * Fires a new action.
     *
     * @param string $action Name of action
     * @param array  $args   Arguments passed to the action
     */
    abstract public function fire($action, $args);
}
