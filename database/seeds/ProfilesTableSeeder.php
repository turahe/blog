<?php

use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class ProfilesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        if (App::environment(['local', 'staging', 'testing'])) {
            Profile::firstOrCreate([
                'user_id' => 1,
                'first_name' => 'Nur',
                'last_name' => 'Wachid',
                'gender' => true,
                'birthplace' => 'Batang',
                'birthday' => '1990-12-01',
                'biography' => 'Strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream and, as I lie close to the earth, a thousand unknown plants are noticed by me. When I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love which bears and sustains.',
            ]);
        }
    }
}
