<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    4/27/20, 5:04 AM
 *  @name          ProfileUpdateRequest.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($this->user()),
            ],
        ];
    }
}
