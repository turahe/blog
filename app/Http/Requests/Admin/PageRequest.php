<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/14/20, 4:46 AM
 *  @name          PageRequest.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Requests\Admin;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class PageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['string', 'max:255'],
            'content' => ['required'],
        ];
    }

    /**
     * @return array
     */
    public function pageFillData(): array
    {
        return [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'content_raw' => $this->get('content'),
            'user_id' => Auth::id(),
            'category_id' => 1,
            'type' => 'page',
            'meta_description' => $this->title,
            'is_draft' => false,
            'published_at' => now(),
        ];
    }
}
