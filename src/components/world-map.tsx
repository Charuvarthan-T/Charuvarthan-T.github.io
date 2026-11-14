"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { geoEquirectangular, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import geoData from "../../public/world-countries.json";
import BlurFade from "./magicui/blur-fade";

// List of countries you've visited (ISO 3166-1 alpha-3 codes)
const visitedCountries = [
  "IND", // India (Home)
];

// FAANG and major tech company locations where you want to work
const targetWorkCountries = [
  "USA", // United States - Silicon Valley, Seattle, New York
  "GBR", // United Kingdom - London
  "IRL", // Ireland - Dublin (European HQs)
  "CHE", // Switzerland - Zurich
  "DEU", // Germany - Munich, Berlin
  "CAN", // Canada - Toronto, Vancouver
  "AUS", // Australia - Sydney
  "SGP", // Singapore
  "JPN", // Japan - Tokyo
  "KOR", // South Korea - Seoul
  "ISR", // Israel - Tel Aviv
  "SWE", // Sweden - Stockholm
  "NLD", // Netherlands - Amsterdam
];


export const WorldMap = ({ delay }: { delay?: number }) => {
  const host = useRef<HTMLDivElement>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "Interactive Earth. Drag or use arrow keys to rotate; hover or tap a country to identify it.");
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.tabIndex = 0;
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;outline-offset:-4px;";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.set(0, .25, 3.45);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    controls.enableDamping = !reduced.matches;
    controls.dampingFactor = .07;
    controls.rotateSpeed = .55;
    controls.autoRotateSpeed = .12;
    const changeMotion = () => { controls.enableDamping = !reduced.matches; };
    reduced.addEventListener("change", changeMotion);
    scene.add(new THREE.AmbientLight(0xd3e1ef, 2));
    const sun = new THREE.DirectionalLight(0xfff1dd, 2.5);
    sun.position.set(-3, 3, 5); scene.add(sun);
    const features = (geoData as FeatureCollection).features;
    const width = 2048, height = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext("2d")!;
    const picking = document.createElement("canvas");
    picking.width = width; picking.height = height;
    const pickContext = picking.getContext("2d", { willReadFrequently: true })!;
    const projection = geoEquirectangular().scale(width / (2 * Math.PI)).translate([width / 2, height / 2]);
    const path = geoPath(projection, context), pickPath = geoPath(projection, pickContext);
    features.forEach((feature, index) => {
      pickContext.beginPath(); pickPath(feature);
      const id = index + 1;
      pickContext.fillStyle = `rgb(${id & 255},${id >> 8},0)`;
      pickContext.fill();
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    let selected = -1;
    const image = new Image();
    const draw = () => {
      context.fillStyle = "#102b42"; context.fillRect(0, 0, width, height);
      if (image.complete && image.naturalWidth) context.drawImage(image, 0, 0, width, height);
      features.forEach((feature, index) => {
        context.beginPath(); path(feature);
        const code = String(feature.id);
        context.fillStyle = index === selected ? "rgba(157,193,219,.44)" : visitedCountries.includes(code) ? "rgba(25,155,122,.48)" : targetWorkCountries.includes(code) ? "rgba(201,164,92,.40)" : "rgba(173,188,186,.04)";
        context.fill();
        context.strokeStyle = "rgba(214,226,225,.38)";
        context.lineWidth = .65; context.stroke();
      });
      texture.needsUpdate = true;
    };
    image.onload = draw; image.src = "/globe/earth.jpg";
    draw();
    const geometry = new THREE.SphereGeometry(1, 96, 64);
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 9, specular: 0x1c3745 });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let dragging = false, resumeAt = 0, visible = false, frame = 0, disposed = false;
    const select = (index: number) => {
      if (selected === index) return;
      selected = index;
      setCountry(index < 0 ? null : String(features[index].properties?.name));
      draw();
    };
    const hover = (event: PointerEvent) => {
      if (dragging) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const uv = raycaster.intersectObject(earth)[0]?.uv;
      if (!uv) { select(-1); return; }
      const pixel = pickContext.getImageData(Math.min(width - 1, Math.floor(uv.x * width)), Math.min(height - 1, Math.floor((1 - uv.y) * height)), 1, 1).data;
      const id = pixel[0] + (pixel[1] << 8) - 1;
      select(id >= 0 && id < features.length ? id : -1);
    };
    const start = () => { dragging = true; select(-1); };
    const end = (event: PointerEvent) => { dragging = false; resumeAt = performance.now() + 5000; hover(event); };
    const leave = () => { dragging = false; select(-1); resumeAt = performance.now() + 2500; };
    const keyboard = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault(); select(-1); resumeAt = performance.now() + 5000;
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      if (event.key === "ArrowLeft") spherical.theta -= .12;
      if (event.key === "ArrowRight") spherical.theta += .12;
      if (event.key === "ArrowUp") spherical.phi -= .12;
      if (event.key === "ArrowDown") spherical.phi += .12;
      spherical.makeSafe(); camera.position.setFromSpherical(spherical); controls.update();
    };
    const surface = renderer.domElement;
    surface.addEventListener("pointermove", hover);
    surface.addEventListener("pointerdown", start);
    surface.addEventListener("pointerup", end);
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("pointercancel", leave);
    surface.addEventListener("keydown", keyboard);
    const resize = new ResizeObserver(() => {
      const w = element.clientWidth, h = element.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      // Fit the full sphere with breathing room even in narrow containers.
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(42) / 2) / Math.min(1, camera.aspect)));
      camera.updateProjectionMatrix();
    });
    resize.observe(element);
    const render = () => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      controls.autoRotate = !reduced.matches && !dragging && selected < 0 && performance.now() > resumeAt;
      controls.update(); renderer.render(scene, camera);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element); render();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      reduced.removeEventListener("change", changeMotion); image.onload = null;
      surface.removeEventListener("pointermove", hover); surface.removeEventListener("pointerdown", start);
      surface.removeEventListener("pointerup", end); surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("pointercancel", leave); surface.removeEventListener("keydown", keyboard);
      controls.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose(); surface.remove();
    };
  }, []);
  return <BlurFade delay={delay}>
    <div className="bg-card border rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-auto">
      <div className="relative w-full aspect-square sm:aspect-[4/3] max-h-[460px]">
        <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
        {failed && <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground text-center">The interactive globe needs WebGL enabled in your browser.</p>}
        {country && <div className="absolute top-1 left-1/2 -translate-x-1/2 rounded-md border bg-background/85 px-3 py-1 text-xs text-foreground backdrop-blur pointer-events-none whitespace-nowrap">{country}</div>}
      </div>
    </div>
  </BlurFade>;
};
