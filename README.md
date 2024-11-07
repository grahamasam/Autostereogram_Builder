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
  <img src="https://github.com/user-attachments/assets/267773e5-db66-49e0-86d1-e027cfcae8f4" width="550">
</p>

---

- In "Create Stereogram", import your depth map by clicking "Use Depth Map".
- Click "Generate Random" to generate black and white noise for the repeated slice.
- Otherwise, select two colors in the circles to create a gradient.

<p align="center">
  <img src="https://github.com/user-attachments/assets/301a0c5c-57d3-4520-9211-140ac30183d3" width="550">
</p>

---

- Adjusting noise and darkness can help with the final clarity of the image; if the pixels are too similar, your brain cant pick up on the repeated sequences propogated across the image to make the illusion work. See why it works here: (https://en.wikipedia.org/wiki/Autostereogram).
- Depending on the complexity of the depth map, adjusting the number of slices can ensure more information is retained in the illusion.
  
<p align="center">
  <img src="https://github.com/user-attachments/assets/6e3ce2b1-c72a-4c92-97de-84fc192f51d6" width="550">
</p>

---

- Finally, click "Generate Stereogram".
- If you're happy with the result, "Save Stereogram" to download it.
- Otherwise, continue to iterate with different settings!

<p align="center">
  <img src="https://github.com/user-attachments/assets/adcef092-f814-4d80-a452-b15d05c153c7" width="550">
</p>

---

- Also, here is a classic shark depth map to have some fun with.

<p align="center">
  <img src="https://github.com/user-attachments/assets/27d5dbb5-3d9d-4687-8b74-84f0da88997c" width="350"> <img src="https://github.com/user-attachments/assets/f471a28d-1568-4e95-9131-85ce660d3b66" width="350">
</p>


