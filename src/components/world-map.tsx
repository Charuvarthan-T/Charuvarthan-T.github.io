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
    controls.autoRotate = false;
    let dragging = false, visible = false, frame = 0, disposed = false, needsRender = true;
    let pendingHover: { clientX: number; clientY: number } | null = null;
    function scheduleFrame() {
      if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render);
    }
    function requestRender() {
      needsRender = true;
      scheduleFrame();
    }
    controls.addEventListener("change", requestRender);
    const changeMotion = () => { controls.enableDamping = !reduced.matches; requestRender(); };
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
    // Project country outlines once; reuse the same geometry for painting and picking.
    const path = geoPath(projection);
    const outlines = features.map(feature => new Path2D(path(feature) || ""));
    outlines.forEach((outline, index) => {
      const id = index + 1;
      pickContext.fillStyle = `rgb(${id & 255},${id >> 8},0)`;
      pickContext.fill(outline);
    });
    const pickPixels = pickContext.getImageData(0, 0, width, height).data;
    picking.width = picking.height = 1;
    const base = document.createElement("canvas");
    base.width = width; base.height = height;
    const baseContext = base.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    let selected = -1;
    const image = new Image();
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.drawImage(base, 0, 0);
      if (selected >= 0) {
        context.fillStyle = "rgba(157,193,219,.44)";
        context.fill(outlines[selected]);
        context.strokeStyle = "rgba(214,226,225,.38)";
        context.lineWidth = .65; context.stroke(outlines[selected]);
      }
      texture.needsUpdate = true;
      requestRender();
    };
    const drawBase = () => {
      baseContext.fillStyle = "#102b42"; baseContext.fillRect(0, 0, width, height);
      if (image.complete && image.naturalWidth) baseContext.drawImage(image, 0, 0, width, height);
      features.forEach((feature, index) => {
        const code = String(feature.id);
        baseContext.fillStyle = visitedCountries.includes(code) ? "rgba(25,155,122,.48)" : targetWorkCountries.includes(code) ? "rgba(201,164,92,.40)" : "rgba(173,188,186,.04)";
        baseContext.fill(outlines[index]);
        baseContext.strokeStyle = "rgba(214,226,225,.38)";
        baseContext.lineWidth = .65; baseContext.stroke(outlines[index]);
      });
      draw();
    };
    image.onload = drawBase; image.src = "/globe/earth.jpg";
    drawBase();
    const geometry = new THREE.SphereGeometry(1, 96, 64);
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 9, specular: 0x1c3745 });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    const select = (index: number) => {
      if (selected === index) return;
      selected = index;
      setCountry(index < 0 ? null : String(features[index].properties?.name));
      draw();
    };
    const hover = (event: { clientX: number; clientY: number }) => {
      if (dragging) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);
      const uv = raycaster.intersectObject(earth)[0]?.uv;
      if (!uv) { select(-1); return; }
      const x = Math.max(0, Math.min(width - 1, Math.floor(uv.x * width)));
      const y = Math.max(0, Math.min(height - 1, Math.floor((1 - uv.y) * height)));
      const offset = (y * width + x) * 4;
      const id = pickPixels[offset] + (pickPixels[offset + 1] << 8) - 1;
      select(id >= 0 && id < features.length ? id : -1);
    };
    const queueHover = (event: PointerEvent) => {
      if (dragging) return;
      pendingHover = { clientX: event.clientX, clientY: event.clientY };
      scheduleFrame();
    };
    const start = () => { dragging = true; pendingHover = null; select(-1); };
    const end = (event: PointerEvent) => { dragging = false; queueHover(event); };
    const leave = () => { dragging = false; pendingHover = null; select(-1); };
    const keyboard = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault(); pendingHover = null; select(-1);
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      if (event.key === "ArrowLeft") spherical.theta -= .12;
      if (event.key === "ArrowRight") spherical.theta += .12;
      if (event.key === "ArrowUp") spherical.phi -= .12;
      if (event.key === "ArrowDown") spherical.phi += .12;
      spherical.makeSafe(); camera.position.setFromSpherical(spherical); controls.update();
    };
    const surface = renderer.domElement;
    surface.addEventListener("pointermove", queueHover);
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
      camera.updateProjectionMatrix(); requestRender();
    });
    resize.observe(element);
    function render() {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      // OrbitControls emits change only while the camera is moving. Its final
      // damping frames request themselves; an idle globe schedules no work.
      controls.update();
      if (pendingHover) {
        const event = pendingHover;
        pendingHover = null;
        hover(event);
      }
      if (needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }
    }
    const suspend = () => {
      cancelAnimationFrame(frame); frame = 0;
    };
    const visibility = () => { if (document.hidden) suspend(); else requestRender(); };
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender(); else suspend();
    });
    observer.observe(element);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      controls.removeEventListener("change", requestRender);
      reduced.removeEventListener("change", changeMotion); image.onload = null; image.src = "";
      surface.removeEventListener("pointermove", queueHover); surface.removeEventListener("pointerdown", start);
      surface.removeEventListener("pointerup", end); surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("pointercancel", leave); surface.removeEventListener("keydown", keyboard);
      controls.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose(); surface.remove();
      canvas.width = canvas.height = base.width = base.height = 1;
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
