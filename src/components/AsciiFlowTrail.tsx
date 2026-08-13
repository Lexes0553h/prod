import React, { useRef, useEffect } from "react";

export default function AsciiFlowTrail(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  const mousePos = useRef({ x: 100, y: 100 });
  const smoothPos = useRef({ x: 100, y: 100 });
  const trail = useRef<any[]>([]);
  const time = useRef(0);

  // Extract props with defaults
  const glyphDither = props.glyphDither || {};
  const mouseDraw = props.mouseDraw || {};
  const interactivity = props.interactivity || {};

  // Parse all values
  const glyphSet = glyphDither.glyphSet ?? 3;
  const scale = glyphDither.scale ?? 24;
  const gamma = glyphDither.gamma ?? 0;
  const mix = glyphDither.mix ?? 100;
  const invertOrder = glyphDither.invertOrder ?? true;
  const monochrome = glyphDither.monochrome ?? true;
  const blendMode = glyphDither.blendMode || "Normal";

  const radius = mouseDraw.radius ?? 20;
  const strength = mouseDraw.strength ?? 82;
  const turbulence = mouseDraw.turbulence ?? 100;
  const tint = mouseDraw.tint || "#000000"; // Changed to black tint for light bg
  const colorMix = mouseDraw.colorMix ?? 100;
  const tailLength = mouseDraw.tail ?? 100;
  const drawBlendMode = mouseDraw.drawBlendMode || "Screen";

  const trackMouse = interactivity.trackMouse ?? 100;
  const momentum = interactivity.momentum ?? 42;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    window.addEventListener("mousemove", handleMouse);

    // ASCII characters array - different sets for different modes
    let baseChars = "@%#*+=-:. ";

    // Select character set based on glyph set
    switch (glyphSet) {
      case 0: baseChars = "●•\xb7. "; break;
      case 1: baseChars = "■□▪▫ "; break;
      case 2: baseChars = "█▓▒░ "; break;
      case 3: baseChars = "▣▤▥▦▧▨▩ "; break;
      case 4: baseChars = "◆◇◈○◉◊◌ "; break;
      default: baseChars = "@%#*+=-:. ";
    }

    const chars = invertOrder ? baseChars.split("").reverse().join("") : baseChars;

    // Parse tint color
    let tintR = 0, tintG = 0, tintB = 0; // default black
    if (typeof tint === "string") {
      if (tint.startsWith("#")) {
        tintR = parseInt(tint.slice(1, 3), 16) || 0;
        tintG = parseInt(tint.slice(3, 5), 16) || 0;
        tintB = parseInt(tint.slice(5, 7), 16) || 0;
      } else if (tint.startsWith("rgb")) {
        const matches = tint.match(/\d+/g);
        if (matches) {
          tintR = parseInt(matches[0]);
          tintG = parseInt(matches[1]);
          tintB = parseInt(matches[2]);
        }
      }
    } else if (typeof tint === "object" && tint !== null) {
      tintR = Math.round(((tint as any).r || 1) * 255);
      tintG = Math.round(((tint as any).g || 1) * 255);
      tintB = Math.round(((tint as any).b || 1) * 255);
    }

    // Animation loop
    const animate = () => {
      time.current += .016;

      // Clear canvas with transparency support
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate target position based on trackMouse
      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (trackMouse < 100) {
        // Mix between mouse and autonomous movement
        const autoX = canvas.width / 2 + Math.sin(time.current) * 150;
        const autoY = canvas.height / 2 + Math.cos(time.current * .7) * 150;
        const trackFactor = trackMouse / 100;
        targetX = mousePos.current.x * trackFactor + autoX * (1 - trackFactor);
        targetY = mousePos.current.y * trackFactor + autoY * (1 - trackFactor);
      }

      // Apply momentum
      const momentumFactor = 1 - momentum / 100 * .95;
      smoothPos.current.x += (targetX - smoothPos.current.x) * momentumFactor;
      smoothPos.current.y += (targetY - smoothPos.current.y) * momentumFactor;

      // Add to trail
      trail.current.push({ x: smoothPos.current.x, y: smoothPos.current.y, life: 1 });

      // Manage trail length and decay
      const maxLength = Math.floor(tailLength / 100 * 50) + 5;
      while (trail.current.length > maxLength) {
        trail.current.shift();
      }

      const decay = .02 * (1 - tailLength / 100) + .01;
      trail.current.forEach(p => p.life -= decay);
      trail.current = trail.current.filter(p => p.life > 0);

      // Character size
      const charSize = Math.max(6, Math.floor(16 * scale / 100));
      ctx.font = `${charSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Apply blend mode
      if (blendMode === "Add") {
        ctx.globalCompositeOperation = "lighter";
      } else if (blendMode === "Screen") {
        ctx.globalCompositeOperation = "screen";
      } else if (blendMode === "Multiply") {
        ctx.globalCompositeOperation = "multiply";
      } else if (blendMode === "Difference") {
        ctx.globalCompositeOperation = "difference";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      // Draw grid of characters
      const cols = Math.ceil(canvas.width / charSize);
      const rows = Math.ceil(canvas.height / charSize);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * charSize + charSize / 2;
          const y = row * charSize + charSize / 2;

          // Calculate intensity from trail
          let intensity = 0;
          trail.current.forEach(point => {
            const dist = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
            const maxDist = radius / 100 * 150;
            if (dist < maxDist) {
              const value = (1 - dist / maxDist) * point.life * (strength / 100);
              // Apply draw blend mode
              if (drawBlendMode === "Add") {
                intensity += value;
              } else if (drawBlendMode === "Multiply") {
                intensity = intensity * value;
              } else if (drawBlendMode === "Difference") {
                intensity = Math.abs(intensity - value);
              } else if (drawBlendMode === "Screen") {
                intensity = 1 - (1 - intensity) * (1 - value);
              } else {
                intensity = Math.max(intensity, value);
              }
            }
          });

          // Add turbulence
          if (turbulence > 0 && intensity > 0) {
            const turb = Math.sin(x * .01 + time.current) * Math.cos(y * .01 + time.current * .7) * (turbulence / 1e3);
            intensity += turb;
          }

          // Apply gamma
          if (gamma !== 0 && intensity > 0) {
            intensity = Math.pow(intensity, 1 - gamma);
          }

          // Apply glyph set dithering
          if (glyphSet > 0 && intensity > 0) {
            const ditherAmount = .2;
            if (glyphSet === 1) { // Halftone dots
              const phase = (Math.sin(col * .5) + Math.cos(row * .5)) * ditherAmount;
              intensity += phase;
            } else if (glyphSet === 2) { // Halftone square
              const phase = (col % 2 + row % 2) * ditherAmount - ditherAmount;
              intensity += phase;
            } else if (glyphSet === 3) { // Bayer
              const bayer = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
              const threshold = bayer[row % 4][col % 4] / 16;
              intensity = intensity > threshold ? 1 : intensity * .5;
            } else if (glyphSet === 4 || glyphSet === 5) { // Floyd-Steinberg / Atkinson
              const noise = Math.random() * ditherAmount - ditherAmount / 2;
              intensity += noise;
            }
          }

          intensity = Math.max(0, Math.min(1, intensity));

          if (intensity > .01) {
            // Select character based on intensity
            const charIndex = Math.min(chars.length - 1, Math.floor(intensity * chars.length));
            const char = chars[charIndex];

            // Calculate final opacity with mix
            const alpha = intensity * (mix / 100);

            // Apply color with better visibility
            if (monochrome) {
              // Pure tint color with full saturation
              ctx.fillStyle = `rgba(${tintR}, ${tintG}, ${tintB}, ${alpha})`;
            } else {
              // Mix between grayscale and tint based on colorMix
              const mixFactor = colorMix / 100;
              // Use intensity to modulate brightness
              const brightness = intensity;
              // Calculate final color - blend white with tint
              const r = Math.round(255 * brightness * (1 - mixFactor) + tintR * mixFactor * brightness);
              const g = Math.round(255 * brightness * (1 - mixFactor) + tintG * mixFactor * brightness);
              const b = Math.round(255 * brightness * (1 - mixFactor) + tintB * mixFactor * brightness);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            ctx.fillText(char, x, y);
          }
        }
      }

      // Reset blend mode
      ctx.globalCompositeOperation = "source-over";
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouse);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        ...props.style,
        width: props.style?.width || "100%",
        height: props.style?.height || "100%",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none" // So it doesn't block clicks on the content underneath!
      }}
    />
  );
}
