# AURA 2050 | Neural Ecosystem

A futuristic, interactive web experience demonstrating the "Web of 2050". Powered by Neural scrolling logic, 3D reactive shaders, and spatial hand tracking.

![Aura 2050 Banner](public/aura-icon.svg)

## 🌟 Features

*   **Neural Hand Scroll**: Control the interface with your physical hand movements.
    *   **Anti-Gravity Control**: Raise hand to scroll up, lower hand to scroll down.
    *   **Calibrated Logic**: Tuned for natural, weightless interaction with a calibrated neutral axis (0.3) and infinite vector physics.
*   **Reactive 3D Core**: A central Basalt/Molten rock that responds to your hand's position, rotation, and proximity using Three.js + React Three Fiber.
*   **Immersive Aesthetics**:
    *   "Molten" design system (Deep Space Black & Magma Orange).
    *   Dynamic Glassmorphism and Neon Glow effects.
    *   Smooth GSAP animations and parallax effects.
*   **Performance**: Optimized React + Vite build with efficient `requestAnimationFrame` physics loops.

## 🛠️ Tech Stack

*   **Core**: React 18, TypeScript, Vite
*   **3D**: Three.js, @react-three/fiber, @react-three/drei
*   **AI/Vision**: MediaPipe Hands (Google)
*   **Animation**: GSAP (GreenSock)
*   **Styling**: TailwindCSS, Custom CSS Variables

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    *   The server will start at `http://localhost:8080`.
    *   **Note**: Camera access requires a secure context (accessed via `localhost` or `https`).

3.  **Enable Hand Tracking**
    *   Click the "Enable Neural Scroll" badge at the bottom of the screen.
    *   Allow Camera permissions when prompted.
    *   **Controls**:
        *   **Rest/Stop**: Hold palm comfortably in the lower-center of the frame.
        *   **Scroll UP**: Clearly raise your hand towards the top.
        *   **Scroll DOWN**: Drop your hand towards the bottom.

## 🎨 Theme Configuration

The project uses a custom "Molten" theme defined in `tailwind.config.ts` and `index.css`:
*   **Primary**: Molten Orange (`#FF4D00`)
*   **Secondary**: Neural Violet (`#8A2BE2`)
*   **Background**: Deep Space Black (`#0A0A0F`)

---

*Built for the Future.*
