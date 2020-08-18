<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/16/20, 11:32 AM
 *  @name          PostRequest.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Requests\Admin;

use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class PostRequest.
 * @property mixed publish_date
 * @property mixed publish_time
 * @property mixed subtitle
 * @property mixed title
 * @property mixed category
 * @property mixed image
 * @property mixed type
 * @property mixed user
 * @property mixed meta_description
 * @property mixed is_draft
 */
class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'published_at' => Carbon::parse($this->input('published_at')),
        ]);
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
//            'publish_date' => ['required', 'date'],
//            'publish_time' => ['required']
        ];
    }

    /**
     * @throws Exception
     * @return array
     */
    public function postFillData()
    {
        $published_at = new Carbon(
            $this->publish_date.' '.$this->publish_time
        );

        return [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'content' => $this->get('content'),
            'user_id' => $this->user ?: Auth::id(),
            'category_id' => $this->category,
            'type' => $this->type ?: 'blog',
            'image' => $this->image,
            'meta_description' => $this->meta_description ?: 'meta'.$this->title,
            'is_draft' => (bool) $this->is_draft,
            'published_at' => $published_at,
        ];
    }
}
