@extends('blog._layouts.layout', [
    'title' => __('contact_us')
])

@section('content')
    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h2 class="mb-4">Contact Us</h2>


                    <img src="/assets/images/contact.jpg" alt="Contact Us" class="img-fluid w-100 mb-4">

                    <p class="mb-5">Strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream and, as I lie close to the earth, a thousand unknown plants are noticed by me.<br><br>When I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love which bears and sustains.</p>

                    <form action="{{ url('contact') }}" method="POST" class="row">
                        @csrf
                        <div class="col-lg-6">
                            <label for="name" class="sr-only">@lang('form.label.name')</label>
                            <input type="text" class="form-control mb-4" name="name" id="name" placeholder="Name">
                        </div>
                        <div class="col-lg-6">
                            <label for="email" class="sr-only">@lang('form.label.email')</label>
                            <input type="email" class="form-control mb-4" name="_replyto" id="email" placeholder="Email">
                        </div>
                        <div class="col-12">
                            <label for="message" class="sr-only">@lang('form.label.message')</label>
                            <textarea name="message" id="message" class="form-control mb-4" placeholder="Message..."></textarea>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

@endsection
