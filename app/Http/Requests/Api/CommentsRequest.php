<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/16/20, 11:32 AM
 *  @name          CommentsRequest.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Requests\Api;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class CommentsRequest extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $polymorphExistsRule = '';
        if ($this->has('commentable_type')) {
            $polymorphExistsRule .= '|model_exists:'.$this->commentable_type.',id';
        }

        return [
            'content' => 'required',
            'commentable_type' => 'required_with:comentable_id',
            'comentable_id' => 'required_with:commentable_type'.$polymorphExistsRule,
        ];
    }
}
