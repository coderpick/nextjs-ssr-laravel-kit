<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        $user = \App\Models\User::where('email', 'admin@gmail.com')->first();
        
        // // create admin role and customer role and assign some permissions  
        $adminRole = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        $customerRole = \Spatie\Permission\Models\Role::create(['name' => 'author']);

        // create permissions
        $createPostPermission = \Spatie\Permission\Models\Permission::create(['name' => 'create post']);
        $editPostPermission = \Spatie\Permission\Models\Permission::create(['name' => 'edit post']);
        $deletePostPermission = \Spatie\Permission\Models\Permission::create(['name' => 'delete post']);

        $adminRole->givePermissionTo($createPostPermission);
        $adminRole->givePermissionTo($editPostPermission);
        $adminRole->givePermissionTo($deletePostPermission);

        $customerRole->givePermissionTo($createPostPermission);

        $user->assignRole('admin'); 

        $user->assignRole('author');

        $changeSystemSettingPermission = \Spatie\Permission\Models\Permission::create(['name' => 'change system setting']);

        $user->givePermissionTo($changeSystemSettingPermission);

    }
}
