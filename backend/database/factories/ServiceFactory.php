<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title'=>fake()->words(2, true),
            'description'=>fake()->sentence(10, true),
            'icon'=>'fa-solid fa-star',
            'link_url'=>'https://example.com',
            'is_new_tab'=>true,
            'status'=>'online',
            'color_from'=>fake()->hexColor(),
            'color_to'=>fake()->hexColor(),
        ];
    }
}
