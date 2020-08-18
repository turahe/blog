<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    4/27/20, 5:04 AM
 *  @name          FileUploadRequest.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class FileUploadRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'file' => [
                'required',
                'image',
                Rule::dimensions()->maxWidth(1000)->maxHeight(1000)->ratio(1),
            ],
        ];
    }
}
