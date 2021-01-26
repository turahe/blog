<div class="col-md-9">
    <!-- Basic Card Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">New content</h6>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label for="title">@lang('forms.label.title')</label>
                <input class="form-control {{ $errors->has('title') ? ' is-invalid' : '' }}" name="title" type="text"
                       id="title" value="{{ old('title') ?? isset($post) ? $post->title : null }}" required>

                @error('title')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>
            <div class="form-group">
                <label for="subtitle">@lang('forms.label.subtitle')</label>
                <textarea class="form-control {{ $errors->has('subtitle') ? ' is-invalid' : '' }}" name="subtitle"
                          type="text" id="subtitle"
                          required>{{ old('subtitle') ?? isset($post) ? $post->subtitle : null }}</textarea>

                @error('subtitle')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <label for="content">@lang('forms.label.content')</label>
                <textarea class="form-control editor {{ $errors->has('content') ? ' is-invalid' : '' }}" id="content"
                          name="content" rows="5"
                          required>{{ old('content') ?? isset($post) ? $post->content : null }}</textarea>

                @error('content')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>

        </div>
    </div>
</div>

<div class="col-md-3">
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Attribute</h6>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label for="user_id">@lang('forms.label.author')</label>
                <select id="user_id" class="form-control select2 {{ $errors->has('user_id') ? ' is-invalid' : '' }}"
                        name="category">
                    @foreach ($users as $key => $value)
                        <option
                            value="{{ $key }}" {{ ( isset($post) ? $key == $post->user->id: null) ? 'selected' : '' }}>
                            {{ $value }}
                        </option>
                    @endforeach
                </select>

                @error('user_id')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>
            <div class="form-group">
                <label for="publish_date">@lang('forms.label.publish_date')</label>
                <div class="input-group date" id="reservationdate" data-target-input="nearest">
                    <input type="date" name="publish_date" id="publish_date"
                           class="form-control {{ $errors->has('publish_date') ? ' is-invalid' : '' }} datetimepicker-input"
                           data-target="#reservationdate" required
                           value="{{ old('publish_date') ?? isset($post) ? $post->publish_date : null }}">
                    <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
                @error('publish_date')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <label for="publish_time">@lang('forms.label.publish_time')</label>
                <div class="input-group date" id="timepicker" data-target-input="nearest">
                    <input type="time" name="publish_time" id="publish_time"
                           class="form-control {{ $errors->has('publish_time') ? ' is-invalid' : '' }} datetimepicker-input"
                           data-target="#timepicker" required
                           value="{{ old('publish_time') ?? isset($post) ? $post->publish_time : null }}">
                    <div class="input-group-append" data-target="#timepicker" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="far fa-clock"></i></div>
                    </div>
                </div>
                @error('publish_time')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>
        </div>
    </div>

    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="form-group">
                <label for="category_id">@lang('forms.label.category')</label>
                <select id="category_id"
                        class="form-control select2 {{ $errors->has('category') ? ' is-invalid' : '' }}"
                        name="category">
                    @foreach ($categories as $key => $value)
                        <option
                            value="{{ $key }}" {{ ( isset($post) ? $key == $post->category->id: null) ? 'selected' : '' }}>
                            {{ $value }}
                        </option>
                    @endforeach
                </select>

                @error('category')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">

                <label for="tags">@lang('forms.label.tags')</label>
                <select id="tags" class="form-control select2 {{ $errors->has('tags') ? ' is-invalid' : '' }}" multiple
                        name="tags[]">
                    @foreach ($tags as $key => $value)
                        <option value="{{ $key }}" {{ ( isset($post) ? $key == $post->id: null) ? 'selected' : '' }}>
                            {{ $value }}
                        </option>
                    @endforeach
                </select>

                @error('tags')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <label for="image">@lang('forms.label.cover')</label>
                <input name="image" type="file"
                       class="form-control-file {{ $errors->has('image') ? ' is-invalid' : '' }}" id="image">

                @error('image')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror

            </div>
        </div>
    </div>

</div>

@push('styles')
    <link rel="stylesheet" href="/assets/admin/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
    <link rel="stylesheet" href="/assets/admin/plugins/select2/css/select2.min.css">
    <link rel="stylesheet" href="/assets/admin/plugins/summernote/summernote-bs4.css">
    <link rel="stylesheet" href="/assets/admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
@endpush
@push('scripts')
    <script src="/assets/admin/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
    <script src="/assets/admin/plugins/select2/js/select2.full.min.js"></script>
    <script src="/assets/admin/plugins/summernote/summernote-bs4.min.js"></script>
    <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
    <script>
        //Initialize Select2 Elements
        $('.select2').select2({
            theme: 'bootstrap4'
        })
        // $('#content').summernote({
        //     height: 300
        // })
        var simplemde = new SimpleMDE({
            // previewRender: function(plainText) {
            //     return customMarkdownParser(plainText); // Returns HTML from a custom parser
            // },
            element: document.getElementById("content")
        });


    </script>
@endpush






