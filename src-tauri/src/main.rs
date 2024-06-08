// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
use rand::Rng;
use std::io::Cursor;
use base64::{decode, encode};
use image::{ImageBuffer, RgbImage};

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

    for section_count in 0..(slices - 1) {
        for x in (slice_width * (section_count + 1))..(slice_width * (section_count + 2)) {
            for y in 0..height {
                let depth_pixel = depth_map_img.get_pixel(x, y);

                if depth_pixel[0] == 255 {  // popout level 1 (white)
                    for i in 0..(slices - section_count) {
                        if ((x + i * slice_width) - 10) < repeated_image.width() {
                            *repeated_image.get_pixel_mut((x + i * slice_width) - 10, y) = *repeated_image.get_pixel(x, y);
                        }
                    }
                }
                else if depth_pixel[0] == 128 {  // popout level 2 (grey)
                    for i in 0..(slices - section_count) {
                        if ((x + i * slice_width) - 5) < repeated_image.width() {
                            *repeated_image.get_pixel_mut((x + i * slice_width) - 5, y) = *repeated_image.get_pixel(x, y);
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
        .invoke_handler(tauri::generate_handler![generate_random_repeat, generate_stereogram])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
