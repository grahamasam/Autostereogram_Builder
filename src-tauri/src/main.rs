// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
use rand::Rng;
use std::io::Cursor;
use base64::{decode, encode};
use image::{ImageBuffer, RgbImage, Rgb};

// Function to generate the random image
fn generate_random_image(width: u32, height: u32) -> RgbImage {
    let mut img = ImageBuffer::new(width, height);
    let mut rng = rand::thread_rng();

    for (_, _, pixel) in img.enumerate_pixels_mut() {
        let value = if rng.gen_bool(0.5) { 0 } else { 255 };
        *pixel = image::Rgb([value, value, value]);
    }

    img
}

fn generate_random_color_image(width: u32, height: u32) -> RgbImage {
    let mut img = ImageBuffer::new(width, height);
    let mut rng = rand::thread_rng();
/*
    for (_, _, pixel) in img.enumerate_pixels_mut() {
        let mut value = rng.gen_range(0..=255);
        let mut v2 = if rng.gen_bool(0.5) { 0 } else { value };
        *pixel = image::Rgb([0, v2, value]);
    }

    for (_, _, pixel) in img.enumerate_pixels_mut() {
        let mut v1 = rng.gen_range(0..=255);
        let mut v2 = rng.gen_range(0..=255);
        if rng.gen_bool(0.5) { v1 = 0 } else { v2 = 0 };
        *pixel = image::Rgb([v1, 0, v2]);
    }

    for (x, y, pixel) in img.enumerate_pixels_mut() {
        // Create a gradient value based on the x position
        let mut value = rng.gen_range(0..=255);
        let gradient_value = (y as f32 / height as f32 * 255.0) as u8;
        *pixel = image::Rgb([0, value, gradient_value]);
    }

    for (x, y, pixel) in img.enumerate_pixels_mut() {
        // Create a gradient value based on the x position
        let mut gradient_value = (y as f32 / height as f32 * 255.0) as u8;

        // Determine whether to add or subtract a random value
        let random_value = rng.gen_range(0..256) as i32;
        if rng.gen_bool(0.5) {
            // Add random value
            gradient_value = (gradient_value as i32 + random_value).clamp(0, 255) as u8;
        } else {
            // Subtract random value
            gradient_value = (gradient_value as i32 - random_value).clamp(0, 255) as u8;
        }

        *pixel = image::Rgb([gradient_value, 0, gradient_value]);
    }
*/

    let tan = [210, 180, 140];
    let pink = [255, 192, 203];
    let darken = 100;

    for (_, y, pixel) in img.enumerate_pixels_mut() {
        // Calculate interpolation factor
        let t = y as f32 / width as f32;

        // Interpolate between tan and pink
        let mut color = [
            ((1.0 - t) * tan[0] as f32 + t * pink[0] as f32) as i32,
            ((1.0 - t) * tan[1] as f32 + t * pink[1] as f32) as i32,
            ((1.0 - t) * tan[2] as f32 + t * pink[2] as f32) as i32,
        ];

        // Add noise to each color component
        for i in 0..3 {
            let random_value = rng.gen_range(0..=50) as i32; // Random value from 0 to 50
            if rng.gen_bool(0.5) {
                color[i] = (color[i] + random_value - darken).clamp(0, 255);
            } else {
                color[i] = (color[i] - random_value - darken).clamp(0, 255);
            }
        }

        *pixel = image::Rgb([color[0] as u8, color[1] as u8, color[2] as u8]);
    }

    img
}

// Helper function to convert hex color code to Rgb
fn hex_to_rgb(hex: &str) -> Rgb<u8> {
    let hex = hex.trim_start_matches('#'); // Remove '#' if present
    let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0);
    let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0);
    let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0);
    Rgb([r, g, b])
}

fn generate_gradient_image(width: u32, height: u32, top_color: &str, bottom_color: &str, darken: i32, noise: i32 ) -> RgbImage {
    let mut img = ImageBuffer::new(width, height);
    let mut rng = rand::thread_rng();

    // Convert hex color codes to Rgb values
    let top_color_rgb = hex_to_rgb(top_color);
    let bottom_color_rgb = hex_to_rgb(bottom_color);

    for (_, y, pixel) in img.enumerate_pixels_mut() {
        // Calculate interpolation factor
        let t = y as f32 / height as f32;

        // Interpolate between top_color_rgb and bottom_color_rgb
        let mut color = [
            ((1.0 - t) * top_color_rgb[0] as f32 + t * bottom_color_rgb[0] as f32) as i32,
            ((1.0 - t) * top_color_rgb[1] as f32 + t * bottom_color_rgb[1] as f32) as i32,
            ((1.0 - t) * top_color_rgb[2] as f32 + t * bottom_color_rgb[2] as f32) as i32,
        ];

        // Add noise to each color component
        for i in 0..3 {
            let random_value = rng.gen_range(0..=noise) as i32; // Random value from 0 to 50
            if rng.gen_bool(0.5) {
                color[i] = (color[i] + random_value - darken).clamp(0, 255);
            } else {
                color[i] = (color[i] - random_value - darken).clamp(0, 255);
            }
        }

        *pixel = image::Rgb([color[0] as u8, color[1] as u8, color[2] as u8]);
    }

    img
}

// Function to convert the image to a base64 string
fn image_to_base64(img: &RgbImage) -> String {
    let mut buffer = Cursor::new(Vec::new());
    img.write_to(&mut buffer, image::ImageOutputFormat::Png).unwrap();
    encode(buffer.get_ref())
}

// Command to generate the random image and return it as a base64 string
#[command]
fn generate_random_repeat(width: u32, height: u32) -> String {
    let img = generate_random_image(width, height);
    image_to_base64(&img)
}

#[command]
fn generate_random_color_repeat(width: u32, height: u32) -> String {
    let img = generate_random_color_image(width, height);
    image_to_base64(&img)
}

#[command]
fn generate_gradient_repeat(width: u32, height: u32, top_color: &str, bottom_color: &str, darken: i32, noise: i32) -> String {
    let img = generate_gradient_image(width, height, top_color, bottom_color, darken, noise);
    image_to_base64(&img)
}

#[command]
fn generate_stereogram(slices: u32, image_src: String, depth_map: String) -> String {
    // Decode base64 strings to image buffers
    let image_data = decode(&image_src).unwrap();
    let depth_map_data = decode(&depth_map).unwrap();

    let img = image::load_from_memory(&image_data).unwrap().to_rgba8();
    let depth_map_img = image::load_from_memory(&depth_map_data).unwrap().to_luma8();

    let width = img.width();
    let height = img.height();
    
    // Create a new image with the repeated pattern
    let mut repeated_image = ImageBuffer::new(width * slices, height);

    for section_count in 0..slices {
        for x in 0..width {
            for y in 0..height {
                let new_x = x + section_count * width;
                let pixel = img.get_pixel(x, y);
                repeated_image.put_pixel(new_x, y, *pixel);
            }
        }
    }

    let full_width = repeated_image.width();
    let slice_width = full_width / slices;

    let num_levels = 30 as f32;
    let popout = 5;
    let relative_scale = 1;

    for section_count in 0..(slices - 1) {
        for x in (slice_width * (section_count + 1))..(slice_width * (section_count + 2)) {
            for y in 0..height {
                let depth_pixel = depth_map_img.get_pixel(x, y);

                if depth_pixel[0] != 0 {
                    let pixel_float = depth_pixel[0] as f32;
                    let mut offset = (pixel_float / 255.0 * num_levels) as u32; // map to value 0-20 and truncate
                    offset = offset * relative_scale + popout;
                    for i in 0..(slices - section_count) {
                        if ((x + i * slice_width) - offset) < repeated_image.width() {
                            *repeated_image.get_pixel_mut((x + i * slice_width) - offset, y) = *repeated_image.get_pixel(x, y);
                        }
                    }
                }
            }
        }
    }

    // Encode the final image to base64
    let mut output = Cursor::new(Vec::new());
    repeated_image.write_to(&mut output, image::ImageOutputFormat::Png).unwrap();
    let base64_output = encode(&output.into_inner());

    base64_output
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_random_repeat, generate_random_color_repeat, generate_gradient_repeat, generate_stereogram])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
