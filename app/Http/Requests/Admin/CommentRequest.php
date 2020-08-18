<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    3/17/20, 2:38 AM
 *  @name          CommentRequest.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Requests\Admin;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'content' => 'required',
            'published_at' => 'required|after_or_equal:'.$this->comment->post->published_at,
            'user_id' => 'required|exists:users,id',
        ];
    }
}
