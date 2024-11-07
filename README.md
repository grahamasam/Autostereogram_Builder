# Autostereogram_Builder

A desktop application to create custom autostereogram images. Built with Tauri, reactjs frontend, and rust backend.

Draw depth maps or import your own and customize the number of repeats, noise, color, and gradient of generated autostereogram.

*See below for a brief tutorial*

---

- navigate to "Draw Depth Map" to create a black and white image that will be translated into an autostereogram image.
- skip to "Create Stereogram" if you have one ready.

<p align="center">
  <img src="https://github.com/user-attachments/assets/0a8c773c-e41a-419f-8906-efed473d94a6" width="550">
</p>

---

- Draw a depth map. Lighter coloring will pop out further in the 3d view of the image.
- Save the map to your computer.
  
<p align="center">
  <img src="https://github.com/user-attachments/assets/c8e501b3-21c2-4fc6-a5d0-44cd0399f209" width="550">
</p>

---

- In "Create Stereogram", import your depth map by clicking "Use Depth Map".
- Click "Generate Random" to generate black and white noise for the repeated slice.
- Otherwise, select two colors in the circles to create a gradient.

<p align="center">
  <img src="https://github.com/user-attachments/assets/bca70bdb-de6d-4806-a304-3aa1a3861e22" width="550">
</p>

---

- Adjusting noise and darkness can help with the final clarity of the image; if the pixels are too similar, your brain cant pick up on the repeated sequences propogated across the image to make the illusion work. See why it works here: (https://en.wikipedia.org/wiki/Autostereogram).
- Depending on the complexity of the depth map, adjusting the number of slices can ensure more information is retained in the illusion.
  
<p align="center">
  <img src="hhttps://github.com/user-attachments/assets/9ea9b0f0-5b13-4538-afd4-51479bc2926d" width="550">
</p>



