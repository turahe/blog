<?php

use App\Models\Social;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class SocialsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        foreach (config('blog.socials') as $social) {
            Social::updateOrCreate([
                'user_id' => 1,
                'name' => $social['name'],
                'url'=> $social['url'],
                'text'=> $social['text'],
            ]);
        }

        if (App::environment(['local', 'staging', 'testing'])) {
            foreach (config('blog.socials') as $social) {
                Social::firstOrCreate([
                    'user_id' => 1,
                    'name' => $social['name'],
                    'url' => $social['url'],
                    'text' => $social['text'],
                ]);
            }
        }
    }
}
