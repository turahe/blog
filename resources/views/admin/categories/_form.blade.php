<div class="col-md-9">
    <!-- Basic Card Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">new content</h6>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label for="title">Title</label>
                <input class="form-control {{ $errors->has('title') ? ' is-invalid' : '' }}"  name="title" type="text" id="title" value="{{ old('title') ?? isset($post) ? $post->title : null }}" required>

                @error('title')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>
            <div class="form-group">
                <label for="subtitle">SubTitle</label>
                <textarea class="form-control {{ $errors->has('subtitle') ? ' is-invalid' : '' }}"  name="subtitle" type="text" id="subtitle" required>{{ old('subtitle') ?? isset($post) ? $post->subtitle : null }}</textarea>

                @error('subtitle')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <label for="content">{{  __('posts.attributes.content') }}</label>
                <textarea class="form-control editor {{ $errors->has('content') ? ' is-invalid' : '' }}" id="content" name="content" rows="5" required>{{ old('content') ?? isset($post) ? $post->content : null }}</textarea>

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
            <h6 class="m-0 font-weight-bold text-primary">new content</h6>
        </div>
        <div class="card-body">

            <div class="form-group">
                <label for="publish_date">{{ __('posts.attributes.publish_date') }}</label>
                <input type="date" name="publish_date" id="publish_date" class="form-control {{ $errors->has('publish_date') ? ' is-invalid' : '' }}" required value="{{ old('publish_date') ?? isset($post) ? $post->publish_date : null }}">
                @error('publish_date')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>
            <div class="form-group">
                <label for="publish_time">{{ __('posts.attributes.publish_time') }}</label>
                <input type="time" name="publish_time" id="publish_time" class="form-control {{ $errors->has('publish_time') ? ' is-invalid' : '' }}" required value="{{ old('publish_time') ?? isset($post) ? $post->publish_time : null }}">
                @error('publish_time')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror
            </div>
        </div>
    </div>

    <div class="card shadow mb-4">
        <div class="card-body">

            <div class="form-group">
                <label for="image">Product Image</label>
                <input name="image" type="file" class="form-control-file {{ $errors->has('image') ? ' is-invalid' : '' }}" id="image">

                @error('image')
                <span class="invalid-feedback">{{ $message }}</span>
                @enderror

            </div>
        </div>
    </div>

</div>

@push('styles')

@endpush
@push('scripts')
@endpush





